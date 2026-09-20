package com.ayurai.ayuraibackend.controller;

import com.ayurai.ayuraibackend.exception.GlobalExceptionHandler;
import com.ayurai.ayuraibackend.service.SkinModelClient;
import com.ayurai.ayuraibackend.service.SkinScanService;
import com.ayurai.ayuraibackend.service.UserAccessService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class SkinScanErrorHandlingTest {
    @Test
    void unavailableModelReturns503WithoutSaving() throws Exception {
        checkFailure(new ResourceAccessException("connection refused"),503);
    }

    @Test
    void invalidImagePreserves415WithoutSaving() throws Exception {
        checkFailure(new HttpClientErrorException(HttpStatus.UNSUPPORTED_MEDIA_TYPE),415);
    }

    private void checkFailure(RuntimeException error,int statusCode) throws Exception {
        SkinScanService scans=mock(SkinScanService.class);
        SkinModelClient model=mock(SkinModelClient.class);
        when(model.predict(any())).thenThrow(error);
        var mvc=MockMvcBuilders.standaloneSetup(new SkinScanController(scans,
                mock(UserAccessService.class),model))
                .setControllerAdvice(new GlobalExceptionHandler()).build();
        mvc.perform(multipart("/api/skin-scans/analyze/user/7")
                .file(new MockMultipartFile("image","test.png","image/png",new byte[]{1})))
                .andExpect(status().is(statusCode)).andExpect(jsonPath("$.message").isNotEmpty());
        verifyNoInteractions(scans);
    }

    @Test
    void missingImageReturns400WithoutCallingModelOrSaving() throws Exception {
        SkinScanService scans=mock(SkinScanService.class);
        SkinModelClient model=mock(SkinModelClient.class);
        var mvc=MockMvcBuilders.standaloneSetup(new SkinScanController(scans,
                mock(UserAccessService.class),model))
                .setControllerAdvice(new GlobalExceptionHandler()).build();
        mvc.perform(multipart("/api/skin-scans/analyze/user/7"))
                .andExpect(status().isBadRequest());
        verifyNoInteractions(scans,model);
    }
}
