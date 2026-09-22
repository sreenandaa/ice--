let currentUser = null;
let allEvents = [];


/* =========================
   LOAD USER PROFILE
========================= */

async function loadProfile() {

    try {

        const response =
            await fetch("/api/auth/profile");

        if (!response.ok) {

            window.location.href = "login.html";
            return;
        }

        currentUser = await response.json();

        if (currentUser.role !== "STUDENT") {

            window.location.href = "login.html";
            return;
        }

        document.getElementById("welcomeMessage").textContent =
            "Welcome, " + currentUser.name + "!";

        loadEvents();

    } catch (error) {

        console.error(error);

        window.location.href = "login.html";
    }
}


/* =========================
   LOAD EVENTS
========================= */

async function loadEvents() {

    try {

        const response =
            await fetch("/api/events");

        if (!response.ok) {

            throw new Error(
                "Could not load events"
            );
        }

        allEvents = await response.json();

        showRecommendations(allEvents);

    } catch (error) {

        console.error(error);

        document.getElementById("message").textContent =
            "Unable to load events.";
    }
}


/* =========================
   RECOMMENDATIONS
========================= */

function showRecommendations(events) {

    if (!currentUser) {
        return;
    }

    const interests =
        (currentUser.interests || [])
            .map(item => item.toLowerCase());

    const studentLocation =
        (currentUser.location || "")
            .toLowerCase();

    const recommended =
        events
            .map(event => {

                let score = 0;

                const category =
                    (event.category || "")
                        .toLowerCase();

                const city =
                    (event.city || "")
                        .toLowerCase();

                /*
                 * Interest match
                 */

                interests.forEach(interest => {

                    if (
                        category.includes(interest) ||
                        (event.name || "")
                            .toLowerCase()
                            .includes(interest) ||
                        (event.description || "")
                            .toLowerCase()
                            .includes(interest)
                    ) {

                        score += 3;
                    }

                });


                /*
                 * Location match
                 */

                if (
                    studentLocation &&
                    city &&
                    city.includes(studentLocation)
                ) {

                    score += 2;
                }


                return {
                    event: event,
                    score: score
                };

            })
            .sort((a, b) => b.score - a.score);


    displayEvents(recommended);
}


/* =========================
   DISPLAY EVENTS
========================= */

function displayEvents(results) {

    const container =
        document.getElementById(
            "recommendedEvents"
        );

    container.innerHTML = "";

    if (results.length === 0) {

        container.innerHTML =
            "<p>No matching events found.</p>";

        return;
    }


    results.forEach(result => {

        const event = result.event;

        const card =
            document.createElement("div");

        card.className = "event-card card";

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
                ${event.description || ""}
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


/* =========================
   FILTERS
========================= */

document
    .getElementById("filterButton")
    .addEventListener("click", function () {

        const category =
            document.getElementById(
                "categoryFilter"
            ).value.toLowerCase();

        const location =
            document.getElementById(
                "locationFilter"
            ).value.toLowerCase();


        const filtered =
            allEvents.filter(event => {

                const categoryMatches =
                    !category ||
                    (event.category || "")
                        .toLowerCase() === category;

                const locationMatches =
                    !location ||
                    (event.city || "")
                        .toLowerCase()
                        .includes(location);

                return (
                    categoryMatches &&
                    locationMatches
                );

            });


        showRecommendations(filtered);

    });


/* =========================
   LOGOUT
========================= */

document
    .getElementById("logoutButton")
    .addEventListener("click", async function () {

        try {

            const response =
                await fetch(
                    "/api/auth/logout",
                    {
                        method: "POST"
                    }
                );

            if (response.ok) {

                window.location.href =
                    "login.html";
            }

        } catch (error) {

            console.error(error);

        }

    });


/* Start */

loadProfile();