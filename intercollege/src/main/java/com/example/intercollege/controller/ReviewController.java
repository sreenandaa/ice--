
package com.example.intercollege.controller;

import com.example.intercollege.model.Review;
import com.example.intercollege.service.ReviewService;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // View reviews: only logged-in students and coordinators.
    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getReviews(
            @PathVariable Long eventId,
            HttpSession session) {

        String username =
                (String) session.getAttribute("username");

        String role =
                (String) session.getAttribute("role");

        if (username == null ||
                (!"STUDENT".equalsIgnoreCase(role) &&
                 !"COORDINATOR".equalsIgnoreCase(role))) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Please log in to view reviews."
                    ));
        }

        return ResponseEntity.ok(
                reviewService.getReviewsForEvent(eventId)
        );
    }

    // Only logged-in students can submit reviews.
    @PostMapping("/event/{eventId}")
    public ResponseEntity<?> addReview(
            @PathVariable Long eventId,
            @RequestBody Review review,
            HttpSession session) {

        String username =
                (String) session.getAttribute("username");

        String role =
                (String) session.getAttribute("role");

        if (username == null ||
                !"STUDENT".equalsIgnoreCase(role)) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "Only logged-in students can submit reviews."
                    ));
        }

        try {
            Review savedReview = reviewService.addReview(
                    eventId,
                    username,
                    review.getRating(),
                    review.getReview()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(savedReview);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
