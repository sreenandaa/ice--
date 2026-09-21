package com.example.intercollege.controller;

import com.example.intercollege.model.User;
import com.example.intercollege.service.AuthService;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // REGISTER
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        User savedUser = authService.register(user);

        // Never send password back to the frontend
        savedUser.setPassword(null);

        return savedUser;
    }

    // LOGIN
    @PostMapping("/login")
public User login(
        @RequestBody LoginRequest request,
        HttpSession session) {

    User user = authService.login(
            request.username(),
            request.password()
    );

    session.setAttribute("username", user.getUsername());
    session.setAttribute("role", user.getRole());

    user.setPassword(null);

    return user;
}
// LOGOUT
@PostMapping("/logout")
public String logout(HttpSession session) {

    session.invalidate();

    return "Logged out successfully";
}

   // PROFILE
@GetMapping("/profile")
public User profile(HttpSession session) {

    String username = (String) session.getAttribute("username");

    if (username == null) {
        throw new ResponseStatusException(
        HttpStatus.UNAUTHORIZED,
        "Not logged in"
);
    }

    User user = authService.getProfile(username);

    user.setPassword(null);

    return user;
}

    // LOGIN REQUEST
    public record LoginRequest(
            String username,
            String password
    ) {
    }
}