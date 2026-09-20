package com.ayurai.ayuraibackend.service;

import com.ayurai.ayuraibackend.dto.SkinScanRequest;
import com.ayurai.ayuraibackend.entity.SkinScan;
import com.ayurai.ayuraibackend.entity.User;
import com.ayurai.ayuraibackend.repository.SkinScanRepository;
import com.ayurai.ayuraibackend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;

class SkinTypeHistoryTest {
    @Test
    void savesAndReadsSeparateFieldsWithoutChangingLegacySeverity() {
        var scans = mock(SkinScanRepository.class);
        var users = mock(UserRepository.class);
        var user = new User();
        user.setId(7L);
        when(users.findById(7L)).thenReturn(Optional.of(user));
        when(scans.save(any(SkinScan.class))).thenAnswer(call -> call.getArgument(0));
        var request = new SkinScanRequest();
        request.setUserId(7L);
        request.setEstimatedSkinType("Moderate");
        request.setSkinType("uncertain");
        request.setSkinTypePredictedClass("combination");
        request.setSkinTypeConfidence(.46);
        request.setSkinTypeRequiresReview(true);
        request.setSensitivityScore(2);
        var response = new SkinScanService(scans, users).createSkinScan(request);
        assertEquals("Moderate", response.getEstimatedSkinType());
        assertEquals("uncertain", response.getSkinType());
        assertEquals("combination", response.getSkinTypePredictedClass());
        assertEquals(.46, response.getSkinTypeConfidence());
        assertTrue(response.getSkinTypeRequiresReview());
        assertEquals(2, response.getSensitivityScore());

        var legacy = new SkinScan();
        legacy.setUser(user);
        legacy.setEstimatedSkinType("Mild");
        when(scans.findById(1L)).thenReturn(Optional.of(legacy));
        var oldResponse = new SkinScanService(scans, users).getSkinScanById(1L);
        assertEquals("Mild", oldResponse.getEstimatedSkinType());
        assertNull(oldResponse.getSkinType());
        assertNull(oldResponse.getSkinTypeConfidence());
        assertNull(oldResponse.getSensitivityScore());
    }
}
