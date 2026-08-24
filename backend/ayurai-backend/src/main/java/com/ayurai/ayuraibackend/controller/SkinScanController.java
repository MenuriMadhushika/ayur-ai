package com.ayurai.ayuraibackend.controller;

import com.ayurai.ayuraibackend.dto.SkinScanRequest;
import com.ayurai.ayuraibackend.dto.SkinScanResponse;
import com.ayurai.ayuraibackend.service.SkinScanService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
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

    public SkinScanController(SkinScanService skinScanService) {
        this.skinScanService = skinScanService;
    }

    @PostMapping
    public ResponseEntity<SkinScanResponse> createSkinScan(
            @Valid @RequestBody SkinScanRequest request) {

        return ResponseEntity.ok(
                skinScanService.createSkinScan(request)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SkinScanResponse>> getUserSkinScans(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                skinScanService.getUserSkinScans(userId)
        );
    }

    @GetMapping("/user/{userId}/latest")
    public ResponseEntity<SkinScanResponse> getLatestSkinScan(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                skinScanService.getLatestSkinScan(userId)
        );
    }
}