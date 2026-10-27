let currentUser = null;
let editingEventId = null;


// ========================================
// LOAD LOGGED-IN USER
// ========================================

async function loadUser() {

    try {

        const response =
            await fetch("/api/auth/profile");


        if (!response.ok) {

            window.location.href =
                "login.html";

            return null;
        }


        const user =
            await response.json();


        if (user.role !== "COORDINATOR") {

            window.location.href =
                "student-dashboard.html";

            return null;
        }


        return user;

    } catch (error) {

        console.error(error);

        window.location.href =
            "login.html";

        return null;
    }
}


// ========================================
// GET FORM DATA
// ========================================

function getEventFormData() {

    return {

        name:
            document.getElementById(
                "eventName"
            ).value.trim(),

        description:
            document.getElementById(
                "description"
            ).value.trim(),

        college:
            document.getElementById(
                "college"
            ).value.trim(),

        category:
            document.getElementById(
                "category"
            ).value,

        date:
            document.getElementById(
                "date"
            ).value,

        startTime:
            document.getElementById(
                "startTime"
            ).value,

        endTime:
            document.getElementById(
                "endTime"
            ).value,

        venue:
            document.getElementById(
                "venue"
            ).value.trim(),

        city:
            document.getElementById(
                "city"
            ).value.trim(),

        latitude:
            Number(
                document.getElementById(
                    "latitude"
                ).value
            ) || 0,

        longitude:
            Number(
                document.getElementById(
                    "longitude"
                ).value
            ) || 0,

        registrationLink:
            document.getElementById(
                "registrationLink"
            ).value.trim(),

        organizer:
            document.getElementById(
                "organizer"
            ).value.trim(),

        contact:
            document.getElementById(
                "contact"
            ).value.trim(),

        imageUrl:
            document.getElementById(
                "imageUrl"
            ).value.trim(),

        maxParticipants:
            document.getElementById(
                "maxParticipants"
            ).value
                ? Number(
                    document.getElementById(
                        "maxParticipants"
                    ).value
                )
                : null
    };
}


// ========================================
// CREATE OR UPDATE EVENT
// ========================================

async function saveEvent(event) {

    event.preventDefault();


    const eventData =
        getEventFormData();


    const message =
        document.getElementById(
            "eventMessage"
        );


    try {

        let response;


        // ==================================
        // UPDATE
        // ==================================

        if (editingEventId !== null) {

            response =
                await fetch(
                    `/api/events/${editingEventId}`,
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                eventData
                            )
                    }
                );

        }


        // ==================================
        // CREATE
        // ==================================

        else {

            response =
                await fetch(
                    "/api/events",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                eventData
                            )
                    }
                );
        }


        // ==================================
        // HANDLE ERRORS
        // ==================================

        if (!response.ok) {

            if (
                response.status === 403
            ) {

                throw new Error(
                    "You are not allowed to modify this event."
                );
            }


            throw new Error(
                "Could not save event."
            );
        }


        // ==================================
        // SUCCESS
        // ==================================

        if (editingEventId !== null) {

            message.textContent =
                "Event updated successfully!";

        } else {

            message.textContent =
                "Event created successfully!";

        }


        resetForm();


        await loadEvents();


    } catch (error) {

        console.error(error);

        message.textContent =
            error.message ||
            "Something went wrong.";

    }
}


// ========================================
// EDIT EVENT
// ========================================

async function editEvent(eventId) {

    try {

        const response =
            await fetch(
                `/api/events/${eventId}`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load event."
            );
        }


        const event =
            await response.json();


        // Extra frontend ownership check

        if (
            event.createdBy !==
            currentUser.username
        ) {

            alert(
                "You can only edit events created by you."
            );

            return;
        }


        editingEventId =
            eventId;


        // Fill form

        document.getElementById(
            "eventName"
        ).value =
            event.name || "";


        document.getElementById(
            "description"
        ).value =
            event.description || "";


        document.getElementById(
            "college"
        ).value =
            event.college || "";


        document.getElementById(
            "category"
        ).value =
            event.category || "";


        document.getElementById(
            "date"
        ).value =
            event.date || "";


        document.getElementById(
            "startTime"
        ).value =
            event.startTime || "";


        document.getElementById(
            "endTime"
        ).value =
            event.endTime || "";


        document.getElementById(
            "venue"
        ).value =
            event.venue || "";


        document.getElementById(
            "city"
        ).value =
            event.city || "";


        document.getElementById(
            "latitude"
        ).value =
            event.latitude || "";


        document.getElementById(
            "longitude"
        ).value =
            event.longitude || "";


        document.getElementById(
            "registrationLink"
        ).value =
            event.registrationLink || "";


        document.getElementById(
            "organizer"
        ).value =
            event.organizer || "";


        document.getElementById(
            "contact"
        ).value =
            event.contact || "";


        document.getElementById(
            "imageUrl"
        ).value =
            event.imageUrl || "";


        document.getElementById(
            "maxParticipants"
        ).value =
            event.maxParticipants || "";


        // Change button

        document.getElementById(
            "submitEventButton"
        ).textContent =
            "Update Event";


        document.getElementById(
            "cancelEditButton"
        ).style.display =
            "inline-block";


        // Scroll to form

        document
            .getElementById("eventForm")
            .scrollIntoView({
                behavior: "smooth"
            });


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load event for editing."
        );
    }
}


// ========================================
// DELETE EVENT
// ========================================

async function deleteEvent(eventId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this event?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/events/${eventId}`,
                {
                    method: "DELETE"
                }
            );


        if (
            response.status === 403
        ) {

            alert(
                "You can only delete events created by you."
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Could not delete event."
            );
        }


        await loadEvents();


    } catch (error) {

        console.error(error);

        alert(
            "Failed to delete event."
        );
    }
}


// ========================================
// RESET FORM
// ========================================

function resetForm() {

    editingEventId = null;


    document.getElementById(
        "eventForm"
    ).reset();


    document.getElementById(
        "submitEventButton"
    ).textContent =
        "Add Event";


    document.getElementById(
        "cancelEditButton"
    ).style.display =
        "none";
}


// ========================================
// LOAD EVENTS
// ========================================

async function loadEvents() {

    const container =
        document.getElementById(
            "eventsContainer"
        );


    const noEvents =
        document.getElementById(
            "noEventsMessage"
        );


    try {

        const response =
            await fetch(
                "/api/events"
            );


        if (!response.ok) {

            throw new Error(
                "Could not load events."
            );
        }


        const events =
            await response.json();


        container.innerHTML = "";


        if (events.length === 0) {

            noEvents.style.display =
                "block";

            return;
        }


        noEvents.style.display =
            "none";


        events.forEach(event => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "event-card";


            const isOwner =
                event.createdBy ===
                currentUser.username;


            let ownerButtons = "";


            if (isOwner) {

                ownerButtons = `

                    <button
                        class="event-btn edit-btn"
                        onclick="editEvent(${event.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="event-btn delete-btn"
                        onclick="deleteEvent(${event.id})"
                    >
                        Delete
                    </button>

                `;
            }


            card.innerHTML = `

                <span class="event-category">
                    ${event.category}
                </span>


                <h3>
                    ${event.name}
                </h3>


                <p>
                    <strong>Date:</strong>
                    ${event.date}
                </p>


                <p>
                    <strong>Location:</strong>
                    ${event.city}
                </p>


                <p>
                    <strong>Status:</strong>
                    ${event.status}
                </p>


                <div class="event-actions">

    <a
        href="event.html?id=${event.id}"
        class="event-btn"
    >
        View Event
    </a>

    <button
        type="button"
        class="event-btn coordinator-view-reviews"
        data-event-id="${event.id}"
        data-event-name="${event.name}"
    >
        View Reviews
    </button>

    ${ownerButtons}

</div>

            `;


            container.appendChild(
                card
            );

        });


    } catch (error) {

        console.error(error);


        container.innerHTML = `

            <div class="error-message">

                Unable to load events.

            </div>

        `;
    }
}


// ========================================
// LOGOUT
// ========================================

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                const response =
                    await fetch(
                        "/api/auth/logout",
                        {
                            method: "POST"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Logout failed"
                    );
                }


                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(error);

                alert(
                    "Logout failed."
                );
            }

        }
    );
}


// ========================================
// INITIALIZE
// ========================================

async function initialize() {

    currentUser =
        await loadUser();


    if (!currentUser) {
        return;
    }


    document.getElementById(
        "coordinatorWelcome"
    ).textContent =
        `Welcome, ${currentUser.name}!`;


    document.getElementById(
        "eventForm"
    ).addEventListener(
        "submit",
        saveEvent
    );


    document.getElementById(
        "cancelEditButton"
    ).addEventListener(
        "click",
        resetForm
    );


    setupLogout();


    await loadEvents();
}


document.addEventListener(
    "DOMContentLoaded",
    initialize
);



/* ========================================
   COORDINATOR: VIEW EVENT REVIEWS
======================================== */

document.addEventListener("click", async function (event) {

    const button = event.target.closest(
        ".coordinator-view-reviews"
    );

    if (!button) return;

    const eventId = button.dataset.eventId;
    const eventName = button.dataset.eventName;

    if (!eventId) {
        alert("Unable to identify this event.");
        return;
    }

    button.disabled = true;
    button.textContent = "Loading Reviews...";

    try {
        const response = await fetch(
            `/api/reviews/event/${encodeURIComponent(eventId)}`,
            {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        const responseText = await response.text();

        if (!response.ok) {
            let message = responseText;

            try {
                const errorData = JSON.parse(responseText);
                message = errorData.message || responseText;
            } catch {
                // Keep the original response text.
            }

            if (response.status === 401) {
                throw new Error(
                    "Your session has expired. Please log in again."
                );
            }

            if (response.status === 403) {
                throw new Error(
                    "You are not allowed to view these reviews."
                );
            }

            throw new Error(
                message || `Request failed (${response.status}).`
            );
        }

        const reviews = JSON.parse(responseText);

        if (!Array.isArray(reviews)) {
            throw new Error("The server returned invalid review data.");
        }

        const escapeHTML = value =>
            String(value ?? "").replace(/[&<>"']/g, char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[char]);

        const content = reviews.length
            ? reviews.map(review => {
                const rating = Math.max(
                    0,
                    Math.min(5, Number(review.rating) || 0)
                );

                return `
                    <article class="public-review">
                        <strong>${escapeHTML(
                            review.studentName ||
                            review.username ||
                            "Student"
                        )}</strong>

                        <div class="review-stars">
                            ${"★".repeat(rating)}${"☆".repeat(5 - rating)}
                        </div>

                        <p>${escapeHTML(review.review)}</p>
                    </article>
                `;
            }).join("")
            : "<p>No reviews have been submitted yet.</p>";

        document.getElementById(
            "coordinatorReviewsModal"
        )?.remove();

        const modal = document.createElement("div");
        modal.id = "coordinatorReviewsModal";
        modal.className = "public-reviews-modal";

        modal.innerHTML = `
            <div class="public-reviews-dialog"
                 role="dialog"
                 aria-modal="true"
                 aria-label="Event reviews">

                <button type="button"
                        class="close-reviews"
                        aria-label="Close">&times;</button>

                <h2>${escapeHTML(eventName)} — Reviews</h2>

                <div class="public-reviews-list">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector(".close-reviews").onclick = () => {
            modal.remove();
        };

        modal.addEventListener("click", e => {
            if (e.target === modal) {
                modal.remove();
            }
        });

    } catch (error) {
        console.error("Unable to load event reviews:", error);

        alert(
            error.message || "Unable to load reviews."
        );

    } finally {
        button.disabled = false;
        button.textContent = "View Reviews";
    }
});

