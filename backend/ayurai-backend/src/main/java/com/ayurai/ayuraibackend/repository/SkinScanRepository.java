package com.ayurai.ayuraibackend.repository;

import com.ayurai.ayuraibackend.entity.SkinScan;
import com.ayurai.ayuraibackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SkinScanRepository
        extends JpaRepository<SkinScan, Long> {

    // Get all skin scans belonging to a user
    List<SkinScan> findByUserOrderByCreatedAtDesc(User user);

    // Retained for administrative summaries that do not require display ordering.
    List<SkinScan> findByUser(User user);

    // Get the latest skin scan belonging to a user
    Optional<SkinScan> findTopByUserOrderByCreatedAtDesc(User user);
}
