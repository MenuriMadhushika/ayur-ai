package com.ayurai.ayuraibackend.repository;

import com.ayurai.ayuraibackend.entity.HomeRemedy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HomeRemedyRepository extends JpaRepository<HomeRemedy, Long> {

    List<HomeRemedy> findByDoshaIgnoreCase(String dosha);

}
