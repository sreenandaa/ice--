package com.example.intercollege.service;

import com.example.intercollege.model.Event;
import com.example.intercollege.model.Review;
import com.example.intercollege.repository.EventRepository;
import com.example.intercollege.repository.ReviewRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final EventRepository eventRepository;


    public ReviewService(
            ReviewRepository reviewRepository,
            EventRepository eventRepository) {

        this.reviewRepository = reviewRepository;
        this.eventRepository = eventRepository;
    }


    // ========================================
    // GET REVIEWS FOR EVENT
    // ========================================

    public List<Review> getReviewsForEvent(Long eventId) {

        List<Review> reviews =
                new ArrayList<>(
                        reviewRepository.findByEventId(eventId)
                );

        reviews.sort(
                Comparator.comparing(
                        Review::getCreatedAt,
                        Comparator.nullsLast(
                                Comparator.reverseOrder()
                        )
                )
        );

        return reviews;
    }


    // ========================================
    // ADD REVIEW
    // ========================================

    public Review addReview(
            Long eventId,
            String username,
            int rating,
            String reviewText) {

        Event event =
                eventRepository.findById(eventId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Event not found"
                                )
                        );


        // Only completed events can be reviewed

        if (!"Completed".equals(event.getStatus())) {

            throw new IllegalArgumentException(
                    "Only completed events can be reviewed"
            );
        }


        // Rating validation

        if (rating < 1 || rating > 5) {

            throw new IllegalArgumentException(
                    "Rating must be between 1 and 5"
            );
        }


        // Review validation

        if (reviewText == null ||
                reviewText.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Review cannot be empty"
            );
        }


        // One review per student per event

        Optional<Review> existingReview =
                reviewRepository
                        .findByEventIdAndUsername(
                                eventId,
                                username
                        );

        if (existingReview.isPresent()) {

            throw new IllegalArgumentException(
                    "You have already reviewed this event"
            );
        }


        // Generate ID

        long nextId =
                reviewRepository.findAll()
                        .stream()
                        .filter(existing ->
                                existing.getId() != null
                        )
                        .mapToLong(Review::getId)
                        .max()
                        .orElse(0) + 1;


        Review newReview = new Review();

        newReview.setId(nextId);

        newReview.setEventId(eventId);

        newReview.setUsername(username);

        newReview.setRating(rating);

        newReview.setReview(
                reviewText.trim()
        );

        newReview.setCreatedAt(
                LocalDateTime.now()
        );


        return reviewRepository.save(
                newReview
        );
    }
}