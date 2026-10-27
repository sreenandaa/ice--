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
@CrossOrigin
public class ReviewController {

    private final ReviewService reviewService;


    public ReviewController(
            ReviewService reviewService) {

        this.reviewService = reviewService;
    }


    // ========================================
    // GET REVIEWS FOR EVENT
    // ========================================

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Review>> getReviews(
            @PathVariable Long eventId) {

        return ResponseEntity.ok(
                reviewService.getReviewsForEvent(eventId)
        );
    }


    // ========================================
    // ADD REVIEW
    // ONLY LOGGED-IN STUDENTS
    // ========================================

    @PostMapping("/event/{eventId}")
    public ResponseEntity<?> addReview(
            @PathVariable Long eventId,
            @RequestBody Review review,
            HttpSession session) {


        String username =
                (String) session.getAttribute(
                        "username"
                );

        String role =
                (String) session.getAttribute(
                        "role"
                );


        // Must be logged-in student

        if (username == null ||
                !"STUDENT".equals(role)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            Map.of(
                                    "message",
                                    "Only logged-in students can submit reviews."
                            )
                    );
        }


        try {

            Review savedReview =
                    reviewService.addReview(
                            eventId,
                            username,
                            review.getRating(),
                            review.getReview()
                    );


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedReview);


        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}