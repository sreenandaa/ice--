package com.example.intercollege.model;

import java.util.List;

public class User {

    private Long id;
    private String name;
    private String username;
    private String password;
    private String role;
    private String college;
    private String location;
    private List<String> interests;

    public User() {
    }

    public User(Long id, String name, String username, String password,
                String role, String college, String location,
                List<String> interests) {

        this.id = id;
        this.name = name;
        this.username = username;
        this.password = password;
        this.role = role;
        this.college = college;
        this.location = location;
        this.interests = interests;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }
}