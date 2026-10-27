
package com.example.intercollege.repository;

import com.example.intercollege.model.Review;
import com.example.intercollege.util.JsonFileUtil;
import com.fasterxml.jackson.core.type.TypeReference;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Repository
public class ReviewRepository {

    @Value("${app.data.directory:data}")
    private String dataDirectory;

    private String filePath() {
        return Paths.get(dataDirectory, "reviews.json").toString();
    }

    public List<Review> findAll() {
        return JsonFileUtil.readList(
                filePath(),
                new TypeReference<List<Review>>() {}
        );
    }

    public Optional<Review> findById(Long id) {
        return findAll().stream()
                .filter(review -> review.getId() != null
                        && review.getId().equals(id))
                .findFirst();
    }

    public List<Review> findByEventId(Long eventId) {
        return findAll().stream()
                .filter(review -> review.getEventId() != null
                        && review.getEventId().equals(eventId))
                .toList();
    }

    public Optional<Review> findByEventIdAndUsername(
            Long eventId, String username) {

        return findAll().stream()
                .filter(review -> review.getEventId() != null
                        && review.getEventId().equals(eventId)
                        && review.getUsername() != null
                        && review.getUsername().equals(username))
                .findFirst();
    }

    public Review save(Review review) {
        List<Review> reviews = findAll();
        reviews.add(review);

        JsonFileUtil.writeList(filePath(), reviews);
        return review;
    }
}
