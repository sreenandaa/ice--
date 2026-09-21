package com.intercollege.model;

import java.time.LocalDate;
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

    public Event() {
    }

    public Event(Long id, String name, String description, String college,
                 String category, LocalDate date, LocalTime startTime,
                 LocalTime endTime, String venue, String city,
                 double latitude, double longitude,
                 String registrationLink, String organizer,
                 String contact) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.college = college;
        this.category = category;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.venue = venue;
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
        this.registrationLink = registrationLink;
        this.organizer = organizer;
        this.contact = contact;
    }

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
}