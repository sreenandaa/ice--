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

    // Anyone who is logged in can view events
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // Anyone who is logged in can view one event
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Only COORDINATOR can create an event
    @PostMapping
    public ResponseEntity<Event> createEvent(
            @RequestBody Event event,
            HttpSession session) {

        if (!isCoordinator(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            Event createdEvent = eventService.createEvent(event);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdEvent);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Only COORDINATOR can update an event
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long id,
            @RequestBody Event event,
            HttpSession session) {

        if (!isCoordinator(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            return eventService.updateEvent(id, event)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Only COORDINATOR can delete an event
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id,
            HttpSession session) {

        if (!isCoordinator(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (eventService.deleteEvent(id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    // Check whether the logged-in user is a coordinator
    private boolean isCoordinator(HttpSession session) {

        String role = (String) session.getAttribute("role");

        return "COORDINATOR".equals(role);
    }
}