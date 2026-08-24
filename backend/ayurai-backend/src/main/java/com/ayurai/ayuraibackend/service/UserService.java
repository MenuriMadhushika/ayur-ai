package com.ayurai.ayuraibackend.service;

import com.ayurai.ayuraibackend.dto.UserRequest;
import com.ayurai.ayuraibackend.dto.UserResponse;
import com.ayurai.ayuraibackend.entity.User;
import com.ayurai.ayuraibackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Create a new user
    public UserResponse createUser(UserRequest request) {

        // Check whether email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    // Get all users
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get user by ID
    public Optional<UserResponse> getUserById(Long id) {

        return userRepository.findById(id)
                .map(this::convertToResponse);
    }

    // Convert User entity to UserResponse
    private UserResponse convertToResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}