package com.ayurai.ayuraibackend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.mock.web.MockMultipartFile;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import javax.imageio.ImageIO;
import static org.junit.jupiter.api.Assertions.*;

@EnabledIfEnvironmentVariable(named="AYURAI_LIVE_MODEL_TEST", matches="true")
class SkinModelLiveTest {
    @Test
    void predictsThroughRealFastApiUsingExistingModel() throws Exception {
        var buffer=new ByteArrayOutputStream();
        ImageIO.write(new BufferedImage(256,256,BufferedImage.TYPE_INT_RGB),"png",buffer);
        var image=new MockMultipartFile("image","synthetic.png","image/png",buffer.toByteArray());
        var prediction=new SkinModelClient("http://127.0.0.1:8000").predict(image);
        assertTrue(java.util.Set.of("estimated","uncertain").contains(prediction.status()));
        assertEquals(4,prediction.probabilities().size());
        assertTrue(prediction.disclaimer().contains("not a medical diagnosis"));
        assertEquals("acne-mobilenetv3-baseline-v1",prediction.modelVersion());
    }
}
