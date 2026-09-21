package com.example.intercollege.service;

import com.example.intercollege.model.Event;
import com.example.intercollege.repository.EventRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class EventService {

    private final EventRepository eventRepository;


    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }


    // ---------- GET ALL ----------

    public List<Event> getAllEvents() {

        return eventRepository.findAll();
    }


    // ---------- GET BY ID ----------

    public Optional<Event> getEventById(Long id) {

        return eventRepository.findById(id);
    }


    // ---------- CREATE ----------

    public Event createEvent(Event event) {

        validateEvent(event);


        // Generate next ID
        long nextId =
                eventRepository.findAll()
                        .stream()
                        .filter(existingEvent ->
                                existingEvent.getId() != null
                        )
                        .mapToLong(Event::getId)
                        .max()
                        .orElse(0) + 1;


        event.setId(nextId);


        LocalDateTime now =
                LocalDateTime.now();

        event.setCreatedAt(now);
        event.setUpdatedAt(now);


        return eventRepository.save(event);
    }


    // ---------- UPDATE ----------

    public Optional<Event> updateEvent(
            Long id,
            Event event) {


        Optional<Event> existing =
                eventRepository.findById(id);


        if (existing.isEmpty()) {
            return Optional.empty();
        }


        validateEvent(event);


        Event oldEvent = existing.get();


        event.setId(id);


        // Don't change original creation time
        event.setCreatedAt(
                oldEvent.getCreatedAt()
        );


        event.setUpdatedAt(
                LocalDateTime.now()
        );


        return Optional.of(
                eventRepository.update(event)
        );
    }


    // ---------- DELETE ----------

    public boolean deleteEvent(Long id) {

        return eventRepository.deleteById(id);
    }


    // ---------- VALIDATION ----------

    private void validateEvent(Event event) {

        // Name
        if (isBlank(event.getName())) {

            throw new IllegalArgumentException(
                    "Event name is required"
            );
        }


        // Description
        if (isBlank(event.getDescription())) {

            throw new IllegalArgumentException(
                    "Event description is required"
            );
        }


        // College
        if (isBlank(event.getCollege())) {

            throw new IllegalArgumentException(
                    "College is required"
            );
        }


        // Category
        validateCategory(
                event.getCategory()
        );


        // Date
        if (event.getDate() == null) {

            throw new IllegalArgumentException(
                    "Event date is required"
            );
        }


        // Start time
        if (event.getStartTime() == null) {

            throw new IllegalArgumentException(
                    "Start time is required"
            );
        }


        // End time
        if (event.getEndTime() == null) {

            throw new IllegalArgumentException(
                    "End time is required"
            );
        }


        // Time validation
        if (!event.getEndTime()
                .isAfter(event.getStartTime())) {

            throw new IllegalArgumentException(
                    "End time must be after start time"
            );
        }


        // Venue
        if (isBlank(event.getVenue())) {

            throw new IllegalArgumentException(
                    "Venue is required"
            );
        }


        // City
        if (isBlank(event.getCity())) {

            throw new IllegalArgumentException(
                    "City is required"
            );
        }


        // Organizer
        if (isBlank(event.getOrganizer())) {

            throw new IllegalArgumentException(
                    "Organizer is required"
            );
        }


        // Contact
        if (isBlank(event.getContact())) {

            throw new IllegalArgumentException(
                    "Contact is required"
            );
        }


        // Participants
        if (event.getMaxParticipants() != null &&
                event.getMaxParticipants() <= 0) {

            throw new IllegalArgumentException(
                    "Maximum participants must be greater than zero"
            );
        }
    }


    // ---------- CATEGORY VALIDATION ----------

    private void validateCategory(String category) {

        Set<String> validCategories = Set.of(

                "Technical",
                "Cultural",
                "Talk Session",
                "Treasure Hunt",
                "Public Speaking",
                "Quiz",
                "Makeathon",
                "Workshop",
                "Sports",
                "Other"
        );


        if (isBlank(category)) {

            throw new IllegalArgumentException(
                    "Category is required"
            );
        }


        if (!validCategories.contains(category)) {

            throw new IllegalArgumentException(
                    "Invalid event category"
            );
        }
    }


    // ---------- HELPER ----------

    private boolean isBlank(String value) {

        return value == null ||
                value.trim().isEmpty();
    }
}