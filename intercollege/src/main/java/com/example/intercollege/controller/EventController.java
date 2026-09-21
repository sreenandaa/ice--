package com.example.intercollege.controller;

import com.example.intercollege.model.Event;
import com.example.intercollege.service.EventService;

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


    // GET /api/events
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {

        return ResponseEntity.ok(
                eventService.getAllEvents()
        );
    }


    // GET /api/events/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(
            @PathVariable Long id) {

        return eventService
                .getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // POST /api/events
    @PostMapping
    public ResponseEntity<Event> createEvent(
            @RequestBody Event event) {

        try {

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


    // PUT /api/events/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long id,
            @RequestBody Event event) {

        try {

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


    // DELETE /api/events/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id) {

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