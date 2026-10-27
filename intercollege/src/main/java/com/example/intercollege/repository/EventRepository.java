
package com.example.intercollege.repository;

import com.example.intercollege.model.Event;
import com.example.intercollege.util.JsonFileUtil;
import com.fasterxml.jackson.core.type.TypeReference;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class EventRepository {

    @Value("${app.data.directory:data}")
    private String dataDirectory;

    private String filePath() {
        return Paths.get(dataDirectory, "events.json").toString();
    }

    public List<Event> findAll() {
        return JsonFileUtil.readList(
                filePath(),
                new TypeReference<List<Event>>() {}
        );
    }

    public Optional<Event> findById(Long id) {
        return findAll().stream()
                .filter(event -> event.getId() != null
                        && event.getId().equals(id))
                .findFirst();
    }

    public Event save(Event event) {
        List<Event> events = findAll();
        events.add(event);

        JsonFileUtil.writeList(filePath(), events);
        return event;
    }

    public Event update(Event updatedEvent) {
        List<Event> events = findAll();

        for (int i = 0; i < events.size(); i++) {
            Event existing = events.get(i);

            if (existing.getId() != null
                    && existing.getId().equals(updatedEvent.getId())) {
                events.set(i, updatedEvent);
                JsonFileUtil.writeList(filePath(), events);
                return updatedEvent;
            }
        }

        return null;
    }

    public boolean deleteById(Long id) {
        List<Event> events = new ArrayList<>(findAll());

        boolean removed = events.removeIf(event ->
                event.getId() != null && event.getId().equals(id));

        if (removed) {
            JsonFileUtil.writeList(filePath(), events);
        }

        return removed;
    }
}
