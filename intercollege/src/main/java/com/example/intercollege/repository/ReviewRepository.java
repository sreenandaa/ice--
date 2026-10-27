package com.example.intercollege.repository;

import com.example.intercollege.model.Review;
import com.example.intercollege.util.JsonFileUtil;
import com.fasterxml.jackson.core.type.TypeReference;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ReviewRepository {

    private static final String FILE_PATH =
            "data/reviews.json";


    // ========================================
    // GET ALL REVIEWS
    // ========================================

    public List<Review> findAll() {

        return JsonFileUtil.readList(
                FILE_PATH,
                new TypeReference<List<Review>>() {}
        );
    }


    // ========================================
    // GET REVIEW BY ID
    // ========================================

    public Optional<Review> findById(Long id) {

        return findAll()
                .stream()
                .filter(review ->
                        review.getId() != null &&
                        review.getId().equals(id)
                )
                .findFirst();
    }


    // ========================================
    // GET REVIEWS FOR EVENT
    // ========================================

    public List<Review> findByEventId(Long eventId) {

        return findAll()
                .stream()
                .filter(review ->
                        review.getEventId() != null &&
                        review.getEventId().equals(eventId)
                )
                .toList();
    }


    // ========================================
    // FIND STUDENT REVIEW FOR EVENT
    // ========================================

    public Optional<Review> findByEventIdAndUsername(
            Long eventId,
            String username) {

        return findAll()
                .stream()
                .filter(review ->
                        review.getEventId() != null &&
                        review.getEventId().equals(eventId) &&
                        review.getUsername() != null &&
                        review.getUsername().equals(username)
                )
                .findFirst();
    }


    // ========================================
    // SAVE
    // ========================================

    public Review save(Review review) {

        List<Review> reviews = findAll();

        reviews.add(review);

        JsonFileUtil.writeList(
                FILE_PATH,
                reviews
        );

        return review;
    }
}