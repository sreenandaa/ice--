package com.example.intercollege.model;

import java.time.LocalDateTime;

public class Notification {

    private Long id;
    private String username;
    private String message;
    private String type;
    private Long eventId;
    private LocalDateTime timestamp;
    private boolean read;

    public Notification() {
    }

    public Notification(Long id, String username, String message,
                        String type, Long eventId,
                        LocalDateTime timestamp, boolean read) {

        this.id = id;
        this.username = username;
        this.message = message;
        this.type = type;
        this.eventId = eventId;
        this.timestamp = timestamp;
        this.read = read;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }
}