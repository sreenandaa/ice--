package com.example.intercollege.repository;

import com.example.intercollege.model.Event;
import com.example.intercollege.util.JsonFileUtil;
import com.fasterxml.jackson.core.type.TypeReference;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class EventRepository {

    private static final String FILE_PATH =
            "data/events.json";


    // GET ALL EVENTS
    public List<Event> findAll() {

        return JsonFileUtil.readList(
                FILE_PATH,
                new TypeReference<List<Event>>() {}
        );
    }


    // GET EVENT BY ID
    public Optional<Event> findById(Long id) {

        return findAll()
                .stream()
                .filter(event ->
                        event.getId() != null &&
                        event.getId().equals(id)
                )
                .findFirst();
    }


    // CREATE EVENT
    public Event save(Event event) {

        List<Event> events = findAll();

        events.add(event);

        JsonFileUtil.writeList(
                FILE_PATH,
                events
        );

        return event;
    }


    // UPDATE EVENT
    public Event update(Event updatedEvent) {

        List<Event> events = findAll();

        for (int i = 0; i < events.size(); i++) {

            Event existingEvent = events.get(i);

            if (existingEvent.getId() != null &&
                    existingEvent.getId()
                            .equals(updatedEvent.getId())) {

                events.set(i, updatedEvent);

                JsonFileUtil.writeList(
                        FILE_PATH,
                        events
                );

                return updatedEvent;
            }
        }

        return null;
    }


    // DELETE EVENT
    public boolean deleteById(Long id) {

        List<Event> events =
                new ArrayList<>(findAll());

        boolean removed =
                events.removeIf(event ->
                        event.getId() != null &&
                        event.getId().equals(id)
                );

        if (removed) {

            JsonFileUtil.writeList(
                    FILE_PATH,
                    events
            );
        }

        return removed;
    }
}