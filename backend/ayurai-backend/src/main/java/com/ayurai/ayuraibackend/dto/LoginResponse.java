package com.ayurai.ayuraibackend.dto;

public class LoginResponse {

    private Long id;
    private String name;
    private String email;
    private Integer age;
    private String profileIcon;
    private String role;
    private String token;

    public LoginResponse(
            Long id,
            String name,
            String email,
            Integer age,
            String profileIcon,
            String role,
            String token
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.profileIcon = profileIcon;
        this.role = role;
        this.token = token;
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

    public String getProfileIcon() {
        return profileIcon;
    }

    public String getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }
}