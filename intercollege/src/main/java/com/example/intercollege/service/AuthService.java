package com.example.intercollege.service;

import com.example.intercollege.model.User;
import com.example.intercollege.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // REGISTER
    public User register(User user) {

        // Check required fields.
        if (user.getName() == null ||
                user.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }

        if (user.getUsername() == null ||
                user.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }

        if (user.getPassword() == null ||
                user.getPassword().length() < 6) {
            throw new IllegalArgumentException(
                    "Password must contain at least 6 characters");
        }

        user.setUsername(user.getUsername().trim());

        // Check whether the username already exists.
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException(
                    "Username already exists. Please choose another.");
        }

        // Accept only Student or Coordinator.
        String role = user.getRole();

        if (role == null ||
                (!role.equalsIgnoreCase("STUDENT") &&
                 !role.equalsIgnoreCase("COORDINATOR"))) {

            throw new IllegalArgumentException(
                    "Please choose Student or Coordinator");
        }

        // Save the selected role.
        user.setRole(role.toUpperCase());

        // Encrypt the password before saving.
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        // Generate the next user ID.
        List<User> users = userRepository.findAll();

        long nextId = users.stream()
                .map(User::getId)
                .filter(id -> id != null)
                .mapToLong(Long::longValue)
                .max()
                .orElse(0) + 1;

        user.setId(nextId);

        return userRepository.save(user);
    }

    // LOGIN
    public User login(String username, String password) {

        User user = userRepository.findByUsername(username.trim())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid username or password"));

        if (password == null ||
                !passwordEncoder.matches(
                        password,
                        user.getPassword())) {

            throw new IllegalArgumentException(
                    "Invalid username or password");
        }

        return user;
    }

    // GET PROFILE
    public User getProfile(String username) {

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));
    }
}
