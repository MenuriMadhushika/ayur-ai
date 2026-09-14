package com.ayurai.ayuraibackend.service;

import com.ayurai.ayuraibackend.exception.TooManyScanRequestsException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SkinScanRateLimitService {
    private static final int MAX_REQUESTS = 5;
    private static final Duration WINDOW = Duration.ofMinutes(1);
    private final ConcurrentHashMap<Long, Deque<Instant>> attempts = new ConcurrentHashMap<>();

    public void check(Long userId) {
        Deque<Instant> userAttempts = attempts.computeIfAbsent(userId, ignored -> new ArrayDeque<>());
        Instant cutoff = Instant.now().minus(WINDOW);
        synchronized (userAttempts) {
            while (!userAttempts.isEmpty() && userAttempts.peekFirst().isBefore(cutoff)) {
                userAttempts.removeFirst();
            }
            if (userAttempts.size() >= MAX_REQUESTS) throw new TooManyScanRequestsException();
            userAttempts.addLast(Instant.now());
        }
    }
}
