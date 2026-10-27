
package com.example.intercollege.service;

import com.example.intercollege.model.Event;
import com.example.intercollege.model.Review;
import com.example.intercollege.model.User;
import com.example.intercollege.repository.EventRepository;
import com.example.intercollege.repository.ReviewRepository;
import com.example.intercollege.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            EventRepository eventRepository,
            UserRepository userRepository) {

        this.reviewRepository = reviewRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    // Get reviews, newest first.
    public List<Review> getReviewsForEvent(Long eventId) {

        List<Review> reviews = new ArrayList<>(
                reviewRepository.findByEventId(eventId)
        );

        for (Review review : reviews) {

            // Fill names for existing and new reviews.
            if (review.getStudentName() == null ||
                    review.getStudentName().isBlank()) {

                Optional<User> user =
                        userRepository.findByUsername(
                                review.getUsername()
                        );

                review.setStudentName(
                        user.map(User::getName)
                                .orElse(review.getUsername())
                );
            }
        }

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

    // Add one review per student per event.
    public Review addReview(
            Long eventId,
            String username,
            int rating,
            String reviewText) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Event not found")
                );

        if (!"Completed".equalsIgnoreCase(event.getStatus())) {
            throw new IllegalArgumentException(
                    "Only completed events can be reviewed"
            );
        }

        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException(
                    "Rating must be between 1 and 5"
            );
        }

        if (reviewText == null || reviewText.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Review cannot be empty"
            );
        }

        if (reviewText.trim().length() > 2000) {
            throw new IllegalArgumentException(
                    "Review must be 2000 characters or fewer"
            );
        }

        Optional<Review> existing =
                reviewRepository.findByEventIdAndUsername(
                        eventId, username
                );

        if (existing.isPresent()) {
            throw new IllegalArgumentException(
                    "You have already reviewed this event"
            );
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        long nextId = reviewRepository.findAll()
                .stream()
                .map(Review::getId)
                .filter(id -> id != null)
                .mapToLong(Long::longValue)
                .max()
                .orElse(0) + 1;

        Review newReview = new Review();

        newReview.setId(nextId);
        newReview.setEventId(eventId);
        newReview.setUsername(username);
        newReview.setStudentName(user.getName());
        newReview.setRating(rating);
        newReview.setReview(reviewText.trim());
        newReview.setCreatedAt(LocalDateTime.now());

        return reviewRepository.save(newReview);
    }
}
