package com.ayurai.ayuraibackend.controller;

import com.ayurai.ayuraibackend.dto.AdminHomeRemedyRequest;
import com.ayurai.ayuraibackend.entity.HomeRemedy;
import com.ayurai.ayuraibackend.repository.HomeRemedyRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// =========================================================
// ADMIN-ONLY REMEDY MANAGEMENT
// SecurityConfig protects every /api/admin/** endpoint.
// =========================================================
@RestController
@RequestMapping("/api/admin/remedies")
public class AdminHomeRemedyController {

    private final HomeRemedyRepository homeRemedyRepository;

    public AdminHomeRemedyController(
            HomeRemedyRepository homeRemedyRepository
    ) {
        this.homeRemedyRepository = homeRemedyRepository;
    }

    // GET /api/admin/remedies
    @GetMapping
    public ResponseEntity<List<HomeRemedy>> getAllRemedies() {
        return ResponseEntity.ok(homeRemedyRepository.findAll());
    }

    // POST /api/admin/remedies
    @PostMapping
    public ResponseEntity<HomeRemedy> createRemedy(
            @Valid @RequestBody AdminHomeRemedyRequest request
    ) {
        HomeRemedy remedy = new HomeRemedy();
        copyRequestToRemedy(request, remedy);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(homeRemedyRepository.save(remedy));
    }

    // PUT /api/admin/remedies/{id}
    @PutMapping("/{id}")
    public ResponseEntity<HomeRemedy> updateRemedy(
            @PathVariable Long id,
            @Valid @RequestBody AdminHomeRemedyRequest request
    ) {
        HomeRemedy remedy = findRemedy(id);
        copyRequestToRemedy(request, remedy);

        return ResponseEntity.ok(homeRemedyRepository.save(remedy));
    }

    // DELETE /api/admin/remedies/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRemedy(@PathVariable Long id) {
        HomeRemedy remedy = findRemedy(id);
        homeRemedyRepository.delete(remedy);

        return ResponseEntity.noContent().build();
    }

    private HomeRemedy findRemedy(Long id) {
        return homeRemedyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Home remedy not found."
                ));
    }

    private void copyRequestToRemedy(
            AdminHomeRemedyRequest request,
            HomeRemedy remedy
    ) {
        remedy.setTitle(request.getTitle().trim());
        remedy.setDescription(request.getDescription());
        remedy.setIngredients(request.getIngredients());
        remedy.setInstructions(request.getInstructions());
        remedy.setDosha(request.getDosha());
        remedy.setSkinType(request.getSkinType());
        remedy.setCategory(request.getCategory());
        remedy.setIcon(request.getIcon());
        remedy.setDuration(request.getDuration());
        remedy.setDifficulty(request.getDifficulty());
        remedy.setFrequency(request.getFrequency());
        remedy.setBenefits(request.getBenefits());
        remedy.setImportantNote(request.getImportantNote());
    }
}
