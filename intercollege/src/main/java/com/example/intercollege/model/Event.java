package com.example.intercollege.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class Event {

    private Long id;

    private String name;
    private String description;
    private String college;
    private String category;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private String venue;
    private String city;

    private double latitude;
    private double longitude;

    private String registrationLink;

    private String organizer;
    private String contact;

    // Optional fields
    private String imageUrl;
    private Integer maxParticipants;

    // Automatically maintained by backend
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Event() {
    }

    // ---------- GETTERS AND SETTERS ----------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getRegistrationLink() {
        return registrationLink;
    }

    public void setRegistrationLink(String registrationLink) {
        this.registrationLink = registrationLink;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // ---------- EVENT STATUS ----------

    /*
     * Status is calculated automatically.
     * It is NOT stored in events.json.
     */
    @JsonProperty(access = Access.READ_ONLY)
    public String getStatus() {

        if (date == null || startTime == null || endTime == null) {
            return "Upcoming";
        }

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // Event is in the future
        if (date.isAfter(today)) {

            long daysUntilEvent =
                    java.time.temporal.ChronoUnit.DAYS.between(
                            today,
                            date
                    );

            if (daysUntilEvent <= 3) {
                return "Happening Soon";
            }

            if (daysUntilEvent <= 7) {
                return "This Week";
            }

            return "Upcoming";
        }

        // Event is in the past
        if (date.isBefore(today)) {
            return "Completed";
        }

        // Event is today
        if (now.isBefore(startTime)) {
            return "Happening Today";
        }

        if (now.isAfter(endTime)) {
            return "Completed";
        }

        return "Ongoing";
    }
}