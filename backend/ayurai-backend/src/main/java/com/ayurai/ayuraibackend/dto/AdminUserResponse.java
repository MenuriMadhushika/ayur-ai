package com.ayurai.ayuraibackend.dto;

// =========================================================
// SAFE ADMIN USER VIEW
// Passwords and other sensitive fields are intentionally omitted.
// =========================================================
public class AdminUserResponse {

    private final Long id;
    private final String name;
    private final String email;
    private final Integer age;
    private final String role;

    public AdminUserResponse(
            Long id,
            String name,
            String email,
            Integer age,
            String role
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Integer getAge() {
        return age;
    }

    public String getRole() {
        return role;
    }
}
