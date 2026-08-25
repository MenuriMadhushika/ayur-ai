package com.ayurai.ayuraibackend.service;

import com.ayurai.ayuraibackend.dto.LoginRequest;
import com.ayurai.ayuraibackend.dto.LoginResponse;
import com.ayurai.ayuraibackend.dto.UserRequest;
import com.ayurai.ayuraibackend.dto.UserResponse;
import com.ayurai.ayuraibackend.entity.User;
import com.ayurai.ayuraibackend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================================================
    // REGISTER
    // =========================================================

    public UserResponse createUser(UserRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setAge(request.getAge());
        user.setProfileIcon(request.getProfileIcon());

        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    // =========================================================
    // LOGIN
    // =========================================================

    public LoginResponse login(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAge(),
                user.getProfileIcon()
        );
    }

    // =========================================================
    // UPDATE USER
    // =========================================================

    public UserResponse updateUser(
            Long id,
            UserRequest request
    ) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        if (request.getName() != null) {
            user.setName(request.getName());
        }

        if (request.getEmail() != null &&
                !request.getEmail().isBlank()) {

            user.setEmail(
                    request.getEmail()
                            .trim()
                            .toLowerCase()
            );
        }

        user.setAge(request.getAge());
        user.setProfileIcon(request.getProfileIcon());

        if (request.getPassword() != null &&
                !request.getPassword().isBlank()) {

            user.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()
                    )
            );
        }

        User updatedUser =
                userRepository.save(user);

        return convertToResponse(updatedUser);
    }

    // =========================================================
    // GET ALL USERS
    // =========================================================

    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =========================================================
    // GET USER BY ID
    // =========================================================

    public Optional<UserResponse> getUserById(Long id) {

        return userRepository.findById(id)
                .map(this::convertToResponse);
    }

    // =========================================================
    // CONVERT USER → RESPONSE
    // =========================================================

    private UserResponse convertToResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAge(),
                user.getProfileIcon()
        );
    }
}