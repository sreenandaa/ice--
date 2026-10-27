package com.example.intercollege;

import com.example.intercollege.model.Review;
import com.example.intercollege.model.User;
import com.example.intercollege.repository.EventRepository;
import com.example.intercollege.repository.ReviewRepository;
import com.example.intercollege.repository.UserRepository;
import com.example.intercollege.service.AuthService;
import com.example.intercollege.service.ReviewService;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ReviewAndAuthServiceTests {

    @Test
    void registrationAlwaysCreatesStudentRole() {
        UserRepository userRepository = mock(UserRepository.class);
        User submittedUser = new User();
        submittedUser.setUsername("new-coordinator");
        submittedUser.setPassword("password");
        submittedUser.setRole("COORDINATOR");

        when(userRepository.findByUsername("new-coordinator"))
                .thenReturn(Optional.empty());
        when(userRepository.findAll()).thenReturn(List.of());
        when(userRepository.save(submittedUser)).thenReturn(submittedUser);

        AuthService authService = new AuthService(
                userRepository,
                new BCryptPasswordEncoder()
        );

        User registeredUser = authService.register(submittedUser);

        assertEquals("STUDENT", registeredUser.getRole());
    }

    @Test
    void reviewsAreSortedNewestFirstWithoutMutatingRepositoryResults() {
        ReviewRepository reviewRepository = mock(ReviewRepository.class);
        LocalDateTime olderTime = LocalDateTime.of(2026, 1, 1, 12, 0);
        LocalDateTime newerTime = olderTime.plusDays(1);
        Review olderReview = new Review();
        olderReview.setCreatedAt(olderTime);
        Review newerReview = new Review();
        newerReview.setCreatedAt(newerTime);

        when(reviewRepository.findByEventId(7L))
                .thenReturn(List.of(olderReview, newerReview));

        ReviewService reviewService = new ReviewService(
                reviewRepository,
                mock(EventRepository.class)
        );

        List<Review> reviews = reviewService.getReviewsForEvent(7L);

        assertEquals(2, reviews.size());
        assertSame(newerReview, reviews.get(0));
        assertSame(olderReview, reviews.get(1));
    }
}
