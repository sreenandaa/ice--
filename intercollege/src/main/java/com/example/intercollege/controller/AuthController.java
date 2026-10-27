
package com.example.intercollege.controller;

import com.example.intercollege.model.User;
import com.example.intercollege.service.AuthService;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // REGISTER AND AUTOMATICALLY LOG IN
    @PostMapping("/register")
    public User register(
            @RequestBody User user,
            HttpSession session) {

        User savedUser = authService.register(user);

        // Log in the newly registered user.
        session.setAttribute(
                "username", savedUser.getUsername());

        session.setAttribute(
                "role", savedUser.getRole());

        // Never send the password to the browser.
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

        session.setAttribute(
                "username", user.getUsername());

        session.setAttribute(
                "role", user.getRole());

        // Never send the password to the browser.
        user.setPassword(null);

        return user;
    }

    // LOGOUT
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "Logged out successfully";
    }

    // GET CURRENT USER PROFILE
    @GetMapping("/profile")
    public User profile(HttpSession session) {

        String username =
                (String) session.getAttribute("username");

        if (username == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Not logged in"
            );
        }

        User user = authService.getProfile(username);

        // Never send the password to the browser.
        user.setPassword(null);

        return user;
    }

    // RETURN VALIDATION ERRORS AS JSON
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>>
            handleIllegalArgument(
                    IllegalArgumentException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "message",
                        ex.getMessage() == null
                                ? "Invalid registration details"
                                : ex.getMessage()
                ));
    }

    // LOGIN REQUEST
    public record LoginRequest(
            String username,
            String password
    ) {
    }
}
