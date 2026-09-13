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

}
