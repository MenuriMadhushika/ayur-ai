"""Synthetic fixtures test API behavior, not clinical model accuracy."""
import asyncio
import io
import unittest
from unittest.mock import patch

import torch
from fastapi import HTTPException, UploadFile
from starlette.datastructures import Headers
from PIL import Image
import app as service


def photo(fmt='PNG'):
    out=io.BytesIO()
    Image.new('RGB', (256,256), (160,120,100)).save(out, format=fmt)
    return out.getvalue()


def predict(data, mime='image/png'):
    upload=UploadFile(file=io.BytesIO(data), filename='fixture',
                      headers=Headers({'content-type':mime}))
    return asyncio.run(service.predict(upload))


class ServiceTests(unittest.TestCase):
    def setUp(self):
        self.old=service.model
        service.model=lambda batch: torch.zeros((1,4))

    def tearDown(self):
        service.model=self.old

    def test_formats_and_uncertain_wording(self):
        for fmt,mime in [('JPEG','image/jpeg'),('PNG','image/png'),('WEBP','image/webp')]:
            with self.subTest(fmt=fmt):
                result=predict(photo(fmt),mime)
                self.assertEqual(result['status'],'uncertain')
                self.assertIsNone(result['estimatedCategory'])
                self.assertEqual(result['modelScore'],0.25)
                self.assertIn('not a medical diagnosis',result['disclaimer'])

    def test_threshold_boundary(self):
        for score,status in [(0.5999,'uncertain'),(0.60,'estimated'),(0.6001,'estimated')]:
            with self.subTest(score=score), patch.object(service.torch,'softmax',return_value=torch.tensor([[score,(1-score)/3,(1-score)/3,(1-score)/3]],dtype=torch.float64)):
                result=predict(photo())
                self.assertEqual(result['status'],status)
                self.assertEqual(result['estimatedCategory'],None if status=='uncertain' else 'Mild')

    def test_invalid_uploads(self):
        cases=[(b'', 'image/png',400),(b'not an image','image/png',400),
               (b'hello','text/plain',415),(photo('GIF'),'image/png',415),
               (b'x'*(service.MAX_UPLOAD_BYTES+1),'image/png',413),
               (photo()[:40],'image/png',400)]
        for data,mime,status in cases:
            with self.subTest(size=len(data),mime=mime), self.assertRaises(HTTPException) as ctx:
                predict(data,mime)
            self.assertEqual(ctx.exception.status_code,status)

    def test_not_ready(self):
        service.model=None
        with self.assertRaises(HTTPException) as ctx:
            predict(photo())
        self.assertEqual(ctx.exception.status_code,503)

    def test_real_model(self):
        async def run():
            async with service.lifespan(service.app):
                self.assertEqual(service.health()['status'],'ready')
                upload=UploadFile(file=io.BytesIO(photo()),headers=Headers({'content-type':'image/png'}))
                result=await service.predict(upload)
                self.assertEqual(set(result['probabilities']),set(service.CLASS_NAMES))
                self.assertAlmostEqual(sum(result['probabilities'].values()),1,places=3)
                self.assertIn(result['status'],('estimated','uncertain'))
        asyncio.run(run())


if __name__=='__main__':
    unittest.main(verbosity=2)
