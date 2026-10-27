const API_URL = "/api/events";

let allEvents = [];


// Load events when page opens
document.addEventListener("DOMContentLoaded", loadEvents);


async function loadEvents() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load events");
        }

        allEvents = await response.json();

        displayEvents(allEvents);

    } catch (error) {

        console.error(error);

        document.getElementById("eventsContainer").innerHTML =
            "<p>Unable to load events.</p>";
    }
}


// Display event cards
function displayEvents(events) {

    const container =
        document.getElementById("eventsContainer");

    const noEvents =
        document.getElementById("noEventsMessage");


    container.innerHTML = "";


    if (events.length === 0) {

        noEvents.style.display = "block";

        return;
    }


    noEvents.style.display = "none";


    events.forEach(event => {

        const card =
            document.createElement("div");

        card.className =
            "event-card card";


        card.innerHTML = `

            <div class="event-poster">
    ${
        event.imageUrl
            ? `<img src="${event.imageUrl}" alt="${event.name}" class="event-image">`
            : "🎫"
    }
</div>

            <div class="event-content">

                <span class="event-category">
                    ${event.category}
                </span>

                <h3>
                    ${event.name}
                </h3>

                <p class="event-info">
                    🏫 ${event.college}
                </p>

                <p class="event-info">
                    📅 ${event.date}
                </p>

                <p class="event-info">
                    📍 ${event.city}
                </p>

                <div class="event-actions">
                    <a
                       href="event.html?id=${event.id}"
                       class="btn"
                    >
                    View Event
                    </a>

                    <button
                        type="button"
                        class="btn view-reviews-btn"
                        data-event-id="${event.id}"
                        data-event-name="${event.name}"
                    >
                        View Reviews
                    </button>
                </div>

            </div>

        `;


        container.appendChild(card);

    });
}


// Search
document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const search =
            this.value.toLowerCase();


        const filtered =
            allEvents.filter(event =>

                event.name
                    .toLowerCase()
                    .includes(search)

                ||

                event.college
                    .toLowerCase()
                    .includes(search)

                ||

                event.category
                    .toLowerCase()
                    .includes(search)

            );


        displayEvents(filtered);

    });


// Category filtering
document
    .querySelectorAll(".categories button")
    .forEach(button => {

        button.addEventListener("click", () => {

            const category =
                button.dataset.category;


            if (category === "ALL") {

                displayEvents(allEvents);

                return;
            }


            const filtered =
                allEvents.filter(
                    event =>
                        event.category === category
                );


            displayEvents(filtered);

        });

    });


// Check whether the visitor is logged in.
async function checkReviewLogin() {
    try {
        const response = await fetch("/api/auth/profile", {
            credentials: "same-origin"
        });

        return response.ok;
    } catch (error) {
        return false;
    }
}

// Show reviews only to logged-in users.
document.addEventListener("click", async function (event) {
    const button = event.target.closest(".view-reviews-btn");

    if (!button) return;

    const loggedIn = await checkReviewLogin();

    if (!loggedIn) {
        alert("Please log in or register to view reviews.");
        window.location.href = "login.html";
        return;
    }

    const eventId = button.dataset.eventId;
    const eventName = button.dataset.eventName;

    try {
        const response = await fetch(
            `/api/reviews/event/${eventId}`,
            { credentials: "same-origin" }
        );

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = "login.html";
                return;
            }

            throw new Error("Unable to load reviews.");
        }

        const reviews = await response.json();

        const safe = value => String(value ?? "").replace(
            /[&<>"']/g,
            character => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[character]
        );

        const reviewContent = reviews.length
            ? reviews.map(review => `
                <article class="public-review">
                    <strong>${safe(
                        review.studentName || review.username || "Student"
                    )}</strong>
                    <div class="review-stars">
                        ${"★".repeat(Number(review.rating) || 0)}
                        ${"☆".repeat(5 - (Number(review.rating) || 0))}
                    </div>
                    <p>${safe(review.review)}</p>
                </article>
            `).join("")
            : "<p>No reviews yet for this event.</p>";

        const oldModal = document.getElementById("publicReviewsModal");
        if (oldModal) oldModal.remove();

        const modal = document.createElement("div");
        modal.id = "publicReviewsModal";
        modal.className = "public-reviews-modal";

        modal.innerHTML = `
            <div class="public-reviews-dialog" role="dialog"
                 aria-modal="true" aria-label="Event reviews">
                <button type="button" class="close-reviews"
                        aria-label="Close reviews">&times;</button>
                <h2>${safe(eventName)} — Reviews</h2>
                <div class="public-reviews-list">${reviewContent}</div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector(".close-reviews").addEventListener(
            "click", () => modal.remove()
        );

        modal.addEventListener("click", e => {
            if (e.target === modal) modal.remove();
        });

    } catch (error) {
        alert(error.message || "Could not load reviews.");
    }
});
