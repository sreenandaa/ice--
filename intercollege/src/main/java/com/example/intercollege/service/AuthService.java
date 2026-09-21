package com.example.intercollege.service;

import com.example.intercollege.model.User;
import com.example.intercollege.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // REGISTER
    public User register(User user) {

        // Check if username already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Set default role if none is provided
        // Set default role if none is provided
if (user.getRole() == null || user.getRole().isBlank()) {
    user.setRole("STUDENT");
}

// Only STUDENT and COORDINATOR roles are allowed
if (!user.getRole().equals("STUDENT")
        && !user.getRole().equals("COORDINATOR")) {

   throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "Role must be STUDENT or COORDINATOR"
);
}

        // Hash the password before saving
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        // Generate an ID
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

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException("Invalid username or password");
        }

        return user;
    }

    // FIND PROFILE
    public User getProfile(String username) {

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}
