
package com.example.intercollege;

import com.example.intercollege.repository.ReviewRepository;
import com.example.intercollege.repository.EventRepository;
import com.example.intercollege.repository.UserRepository;
import com.example.intercollege.service.ReviewService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class ReviewAndAuthServiceTests {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @Test
    void reviewServiceCanBeCreated() {

        ReviewService reviewService = new ReviewService(
                reviewRepository,
                eventRepository,
                userRepository
        );

        assertNotNull(reviewService);
    }
}
