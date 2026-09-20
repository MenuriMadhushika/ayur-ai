package com.ayurai.ayuraibackend.controller;

import com.ayurai.ayuraibackend.entity.HomeRemedy;
import com.ayurai.ayuraibackend.service.HomeRemedyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/home-remedies")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5178"
        }
)
public class HomeRemedyController {

    private final HomeRemedyService homeRemedyService;

    public HomeRemedyController(
            HomeRemedyService homeRemedyService) {

        this.homeRemedyService = homeRemedyService;
    }

    @GetMapping
    public ResponseEntity<List<HomeRemedy>> getAllRemedies() {

        return ResponseEntity.ok(
                homeRemedyService.getAllRemedies()
        );
    }

    @GetMapping("/dosha/{dosha}")
    public ResponseEntity<List<HomeRemedy>> getByDosha(
            @PathVariable String dosha) {

        return ResponseEntity.ok(
                homeRemedyService.getByDosha(dosha)
        );
    }

}
