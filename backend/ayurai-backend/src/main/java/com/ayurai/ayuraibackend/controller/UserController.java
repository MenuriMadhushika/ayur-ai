package com.ayurai.ayuraibackend.controller;

import com.ayurai.ayuraibackend.dto.UserRequest;
import com.ayurai.ayuraibackend.dto.UserResponse;
import com.ayurai.ayuraibackend.entity.User;
import com.ayurai.ayuraibackend.service.UserAccessService;
import com.ayurai.ayuraibackend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(
        origins = "http://localhost:5178",
        allowCredentials = "true"
)
public class UserController {

    private final UserService userService;
    private final UserAccessService userAccessService;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public UserController(UserService userService,
                          UserAccessService userAccessService) {
        this.userService = userService;
        this.userAccessService = userAccessService;
    }

    // =========================================================
    // REGISTER USER
    // =========================================================

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody UserRequest request) {

        UserResponse response =
                userService.createUser(request);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET ALL USERS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        List<UserResponse> users =
                userService.getAllUsers();

        return ResponseEntity.ok(users);
    }

    // =========================================================
    // GET USER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id,
            @AuthenticationPrincipal User authenticatedUser) {

        userAccessService.requireOwner(authenticatedUser, id);

        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================================================
    // UPDATE USER PROFILE
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest request,
            @AuthenticationPrincipal User authenticatedUser) {

        userAccessService.requireOwner(authenticatedUser, id);

        UserResponse response =
                userService.updateUser(id, request);

        return ResponseEntity.ok(response);
    }
}
