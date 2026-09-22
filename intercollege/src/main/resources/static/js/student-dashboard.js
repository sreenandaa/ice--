let currentUser = null;
let allEvents = [];


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


        // Only students should use this dashboard

        if (user.role !== "STUDENT") {

            window.location.href =
                "coordinator-dashboard.html";

            return null;
        }


        return user;

    } catch (error) {

        console.error(
            "Could not load user:",
            error
        );

        window.location.href =
            "login.html";

        return null;
    }
}


// ========================================
// LOAD EVENTS
// ========================================

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


// ========================================
// CALCULATE RECOMMENDATION SCORE
// ========================================

function calculateScore(event, user) {

    let score = 0;


    // Location match

    if (
        user.location &&
        event.city &&
        user.location
            .toLowerCase()
            .trim() ===
        event.city
            .toLowerCase()
            .trim()
    ) {

        score += 5;
    }


    // College match

    if (
        user.college &&
        event.college &&
        user.college
            .toLowerCase()
            .trim() ===
        event.college
            .toLowerCase()
            .trim()
    ) {

        score += 3;
    }


    // Interest/category match

    if (
        Array.isArray(user.interests) &&
        event.category
    ) {

        const category =
            event.category
                .toLowerCase()
                .trim();


        user.interests.forEach(
            interest => {

                if (!interest) {
                    return;
                }


                const interestText =
                    interest
                        .toLowerCase()
                        .trim();


                if (
                    category.includes(
                        interestText
                    ) ||
                    interestText.includes(
                        category
                    )
                ) {

                    score += 10;
                }

            }
        );
    }


    return score;
}


// ========================================
// DISPLAY EVENTS
// ========================================

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
            document.createElement(
                "div"
            );


        card.className =
            "event-card";


        // Register button only appears
        // if the event has a registration link

        let registerButton = "";


        if (event.registrationLink) {

            registerButton = `

                <a
                    href="${event.registrationLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="event-btn register-btn"
                >
                    Register Now
                </a>

            `;
        }


        card.innerHTML = `

            <div class="event-card-content">

                <span class="event-category">
                    ${event.category}
                </span>


                <h3>
                    ${event.name}
                </h3>


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


                <p class="event-description">
                    ${event.description}
                </p>


                <div class="event-actions">

                    <a
                        href="event.html?id=${event.id}"
                        class="event-btn"
                    >
                        View Event
                    </a>

                    ${registerButton}

                </div>

            </div>

        `;


        container.appendChild(card);

    });
}


// ========================================
// SEARCH EVENTS
// ========================================

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


            const filteredEvents =
                allEvents.filter(
                    event => {

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

                            ||

                            (event.description || "")
                                .toLowerCase()
                                .includes(search)

                        );

                    }
                );


            displayEvents(
                filteredEvents
            );

        }
    );
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

                console.error(
                    "Logout error:",
                    error
                );

                alert(
                    "Logout failed. Please try again."
                );
            }

        }
    );
}


// ========================================
// INITIALIZE DASHBOARD
// ========================================

async function initializeDashboard() {

    try {

        // Load current user

        currentUser =
            await loadUser();


        if (!currentUser) {
            return;
        }


        // Welcome message

        document.getElementById(
            "studentWelcome"
        ).textContent =
            `Welcome, ${currentUser.name}!`;


        // Load events

        allEvents =
            await loadEvents();


        // Calculate recommendation scores

        const scoredEvents =
            allEvents.map(
                event => ({

                    event: event,

                    score:
                        calculateScore(
                            event,
                            currentUser
                        )

                })
            );


        // Highest recommendation first

        scoredEvents.sort(
            (a, b) =>
                b.score - a.score
        );


        const recommendedEvents =
            scoredEvents.map(
                item =>
                    item.event
            );


        displayEvents(
            recommendedEvents
        );


        setupSearch();

        setupLogout();


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        document.getElementById(
            "eventsContainer"
        ).innerHTML = `

            <div class="error-message">

                Unable to load events.

                Please refresh the page.

            </div>

        `;
    }
}


// ========================================
// START
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);