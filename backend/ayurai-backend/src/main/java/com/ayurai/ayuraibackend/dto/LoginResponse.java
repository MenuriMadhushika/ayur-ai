package com.ayurai.ayuraibackend.dto;

public class LoginResponse {

    private Long id;
    private String name;
    private String email;
    private Integer age;
    private String profileIcon;

    public LoginResponse(
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