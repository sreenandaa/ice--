package com.example.intercollege.controller;

import com.example.intercollege.model.Event;
import com.example.intercollege.service.EventService;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }


    // ========================================
    // GET ALL EVENTS
    // ========================================

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {

        return ResponseEntity.ok(
                eventService.getAllEvents()
        );
    }


    // ========================================
    // GET ONE EVENT
    // ========================================

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(
            @PathVariable Long id) {

        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    // ========================================
    // CREATE EVENT
    // ONLY COORDINATOR
    // ========================================

    @PostMapping
    public ResponseEntity<Event> createEvent(
            @RequestBody Event event,
            HttpSession session) {


        String username =
                (String) session.getAttribute("username");

        String role =
                (String) session.getAttribute("role");


        // Must be logged in as coordinator

        if (username == null ||
                !"COORDINATOR".equals(role)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }


        try {

            // IMPORTANT:
            // Never trust createdBy from frontend.
            // Set it from the logged-in session.

            event.setCreatedBy(username);


            Event createdEvent =
                    eventService.createEvent(event);


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdEvent);


        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }
    }


    // ========================================
    // UPDATE EVENT
    // ONLY ORIGINAL CREATOR
    // ========================================

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long id,
            @RequestBody Event event,
            HttpSession session) {


        String username =
                (String) session.getAttribute("username");

        String role =
                (String) session.getAttribute("role");


        // Must be coordinator

        if (username == null ||
                !"COORDINATOR".equals(role)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }


        // Find existing event

        var existingEvent =
                eventService.getEventById(id);


        if (existingEvent.isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        Event oldEvent =
                existingEvent.get();


        // Check ownership

        if (oldEvent.getCreatedBy() == null ||
                !oldEvent.getCreatedBy()
                        .equals(username)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }


        try {

            // Keep original owner.
            // Frontend cannot change ownership.

            event.setCreatedBy(username);


            return eventService
                    .updateEvent(id, event)
                    .map(ResponseEntity::ok)
                    .orElse(
                            ResponseEntity
                                    .notFound()
                                    .build()
                    );


        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }
    }


    // ========================================
    // DELETE EVENT
    // ONLY ORIGINAL CREATOR
    // ========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id,
            HttpSession session) {


        String username =
                (String) session.getAttribute("username");

        String role =
                (String) session.getAttribute("role");


        // Must be coordinator

        if (username == null ||
                !"COORDINATOR".equals(role)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }


        // Find event

        var existingEvent =
                eventService.getEventById(id);


        if (existingEvent.isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        Event event =
                existingEvent.get();


        // Check ownership

        if (event.getCreatedBy() == null ||
                !event.getCreatedBy()
                        .equals(username)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }


        // Delete

        if (eventService.deleteEvent(id)) {

            return ResponseEntity
                    .noContent()
                    .build();
        }


        return ResponseEntity
                .notFound()
                .build();
    }
}