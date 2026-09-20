package com.ayurai.ayuraibackend.controller;

import com.ayurai.ayuraibackend.dto.SkinModelPrediction;
import com.ayurai.ayuraibackend.dto.SkinScanAnalysisResponse;
import com.ayurai.ayuraibackend.dto.SkinScanResponse;
import com.ayurai.ayuraibackend.entity.User;
import com.ayurai.ayuraibackend.service.SkinModelClient;
import com.ayurai.ayuraibackend.service.SkinScanService;
import com.ayurai.ayuraibackend.service.UserAccessService;
import com.ayurai.ayuraibackend.service.SkinScanRateLimitService;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SkinScanControllerTest {
    @Test
    void analyzesAndSavesAResultForTheAuthenticatedOwner() {
        SkinScanService scans = mock(SkinScanService.class);
        UserAccessService access = mock(UserAccessService.class);
        SkinModelClient model = mock(SkinModelClient.class);
        SkinScanRateLimitService rateLimit = mock(SkinScanRateLimitService.class);
        SkinScanController controller = new SkinScanController(scans, access, model, rateLimit);
        User user = new User();
        user.setId(7L);
        MockMultipartFile image = new MockMultipartFile("image", "face.jpg", "image/jpeg", new byte[]{1});
        SkinModelPrediction prediction = new SkinModelPrediction("estimated", "Moderate", 0.74,
                Map.of("Moderate", 0.74), "Estimated moderate severity.", "Not a diagnosis.", "test-v1");
        LocalDateTime createdAt = LocalDateTime.now();
        SkinScanResponse saved = new SkinScanResponse(12L, 7L, null, "Moderate",
                prediction.message(), "ESTIMATED", createdAt, createdAt);
        when(model.predict(image)).thenReturn(prediction);
        when(scans.createSkinScan(any())).thenReturn(saved);

        SkinScanAnalysisResponse response = controller.analyzeSkinPhoto(7L, image, user).getBody();

        verify(access).requireOwner(user, 7L);
        verify(rateLimit).check(7L);
        verify(model).predict(image);
        verify(scans).createSkinScan(argThat(request -> request.getUserId().equals(7L)
                && request.getEstimatedSkinType().equals("Moderate")
                && request.getAnalysisStatus().equals("ESTIMATED")));
        assertEquals(12L, response.scanId());
        assertEquals("Moderate", response.estimatedCategory());
        assertEquals(0.74, response.modelScore());
    }
}
