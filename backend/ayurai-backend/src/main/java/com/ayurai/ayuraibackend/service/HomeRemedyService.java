package com.ayurai.ayuraibackend.service;

import com.ayurai.ayuraibackend.entity.HomeRemedy;
import com.ayurai.ayuraibackend.repository.HomeRemedyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HomeRemedyService {

    private final HomeRemedyRepository homeRemedyRepository;

    public HomeRemedyService(
            HomeRemedyRepository homeRemedyRepository) {

        this.homeRemedyRepository = homeRemedyRepository;
    }

    public List<HomeRemedy> getAllRemedies() {
        return homeRemedyRepository.findAll();
    }

    public List<HomeRemedy> getByDosha(String dosha) {
        return homeRemedyRepository.findByDoshaIgnoreCase(dosha);
    }

    public List<HomeRemedy> getBySkinType(String skinType) {
        return homeRemedyRepository.findBySkinTypeIgnoreCase(skinType);
    }

    public List<HomeRemedy> getByDoshaAndSkinType(
            String dosha,
            String skinType) {

        return homeRemedyRepository
                .findByDoshaIgnoreCase(dosha)
                .stream()
                .filter(remedy -> matchesSkinType(
                        remedy.getSkinType(),
                        skinType
                ))
                .toList();
    }

    // "All" remedies are intentionally available to every skin type.
    private boolean matchesSkinType(
            String remedySkinType,
            String selectedSkinType) {

        if (remedySkinType == null || remedySkinType.isBlank()) {
            return true;
        }

        return "all".equalsIgnoreCase(remedySkinType)
                || remedySkinType.equalsIgnoreCase(selectedSkinType);
    }
}
