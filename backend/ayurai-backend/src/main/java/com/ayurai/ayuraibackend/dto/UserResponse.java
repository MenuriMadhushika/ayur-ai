package com.ayurai.ayuraibackend.dto;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Integer age;
    private String profileIcon;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public UserResponse(
            Long id,
            String name,
            String email,
            Integer age,
            String profileIcon
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.profileIcon = profileIcon;
    }


    // =========================================================
    // GETTERS
    // =========================================================

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
}