package com.ayurai.ayuraibackend.controller;

import com.ayurai.ayuraibackend.dto.SkinScanRequest;
import com.ayurai.ayuraibackend.dto.SkinScanResponse;
import com.ayurai.ayuraibackend.entity.User;
import com.ayurai.ayuraibackend.service.SkinScanService;
import com.ayurai.ayuraibackend.service.UserAccessService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skin-scans")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174"
        }
)
public class SkinScanController {

    private final SkinScanService skinScanService;
    private final UserAccessService userAccessService;

    public SkinScanController(SkinScanService skinScanService,
                              UserAccessService userAccessService) {
        this.skinScanService = skinScanService;
        this.userAccessService = userAccessService;
    }

    @PostMapping
    public ResponseEntity<SkinScanResponse> createSkinScan(
            @Valid @RequestBody SkinScanRequest request,
            @AuthenticationPrincipal User authenticatedUser) {

        userAccessService.requireOwner(authenticatedUser, request.getUserId());

        return ResponseEntity.ok(
                skinScanService.createSkinScan(request)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SkinScanResponse>> getUserSkinScans(
            @PathVariable Long userId,
            @AuthenticationPrincipal User authenticatedUser) {

        userAccessService.requireOwner(authenticatedUser, userId);

        return ResponseEntity.ok(
                skinScanService.getUserSkinScans(userId)
        );
    }

    @GetMapping("/user/{userId}/latest")
    public ResponseEntity<SkinScanResponse> getLatestSkinScan(
            @PathVariable Long userId,
            @AuthenticationPrincipal User authenticatedUser) {

        userAccessService.requireOwner(authenticatedUser, userId);

        return ResponseEntity.ok(
                skinScanService.getLatestSkinScan(userId)
        );
    }
}
