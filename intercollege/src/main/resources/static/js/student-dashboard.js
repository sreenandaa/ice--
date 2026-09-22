let currentUser = null;
let allEvents = [];


// ==============================
// GET CURRENT USER
// ==============================

async function loadUser() {

    const response =
        await fetch("/api/auth/profile");

    if (!response.ok) {

        window.location.href =
            "login.html";

        return null;
    }

    const user =
        await response.json();


    // Student page should only be
    // accessible by students.

    if (user.role !== "STUDENT") {

        window.location.href =
            "coordinator-dashboard.html";

        return null;
    }


    return user;
}


// ==============================
// GET EVENTS
// ==============================

async function loadEvents() {

    const response =
        await fetch("/api/events");


    if (!response.ok) {

        throw new Error(
            "Could not load events"
        );
    }


    return await response.json();
}


// ==============================
// CALCULATE RECOMMENDATION SCORE
// ==============================

function calculateScore(event, user) {

    let score = 0;


    // --------------------------
    // Location match
    // --------------------------

    if (
        user.location &&
        event.city &&
        user.location
            .toLowerCase()
            .trim()
            ===
        event.city
            .toLowerCase()
            .trim()
    ) {

        score += 5;
    }


    // --------------------------
    // College match
    // --------------------------

    if (
        user.college &&
        event.college &&
        user.college
            .toLowerCase()
            .trim()
            ===
        event.college
            .toLowerCase()
            .trim()
    ) {

        score += 3;
    }


    // --------------------------
    // Interest / category match
    // --------------------------

    if (
        Array.isArray(user.interests) &&
        event.category
    ) {

        const category =
            event.category
                .toLowerCase()
                .trim();


        user.interests.forEach(interest => {

            const interestText =
                interest
                    .toLowerCase()
                    .trim();


            if (
                category.includes(interestText) ||
                interestText.includes(category)
            ) {

                score += 10;
            }

        });

    }


    return score;
}


// ==============================
// DISPLAY EVENTS
// ==============================

function displayEvents(events) {

    const container =
        document.getElementById(
            "eventsContainer"
        );

    const noEvents =
        document.getElementById(
            "noEventsMessage"
        );


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
            document.createElement("div");


        card.className =
            "card";


        card.innerHTML = `

            <h3>
                ${event.name}
            </h3>

            <p>
                <strong>Category:</strong>
                ${event.category}
            </p>

            <p>
                <strong>College:</strong>
                ${event.college}
            </p>

            <p>
                <strong>Location:</strong>
                ${event.city}
            </p>

            <p>
                <strong>Date:</strong>
                ${event.date}
            </p>

            <p>
                <strong>Status:</strong>
                ${event.status}
            </p>

            <p>
                ${event.description}
            </p>

            <a
                href="event.html?id=${event.id}"
                class="btn"
            >
                View Event
            </a>

        `;


        container.appendChild(card);

    });

}


// ==============================
// SEARCH
// ==============================

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    searchInput.addEventListener(
        "input",
        function () {

            const search =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                allEvents.filter(event => {

                    return (

                        (event.name || "")
                            .toLowerCase()
                            .includes(search)

                        ||

                        (event.category || "")
                            .toLowerCase()
                            .includes(search)

                        ||

                        (event.college || "")
                            .toLowerCase()
                            .includes(search)

                        ||

                        (event.city || "")
                            .toLowerCase()
                            .includes(search)

                    );

                });


            displayEvents(filtered);

        }
    );

}


// ==============================
// INITIALIZE
// ==============================

async function initializeDashboard() {

    try {

        currentUser =
            await loadUser();


        if (!currentUser) {
            return;
        }


        document.getElementById(
            "studentWelcome"
        ).textContent =
            `Welcome, ${currentUser.name}!`;


        allEvents =
            await loadEvents();


        // Add recommendation score
        // to every event.

        const scoredEvents =
            allEvents.map(event => {

                return {

                    event: event,

                    score:
                        calculateScore(
                            event,
                            currentUser
                        )

                };

            });


        // Highest recommendation first

        scoredEvents.sort(
            (a, b) =>
                b.score - a.score
        );


        const recommendedEvents =
            scoredEvents.map(
                item => item.event
            );


        displayEvents(
            recommendedEvents
        );


        setupSearch();


    } catch (error) {

        console.error(error);

        document.getElementById(
            "eventsContainer"
        ).innerHTML =
            "<p>Unable to load events.</p>";

    }

}


document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);