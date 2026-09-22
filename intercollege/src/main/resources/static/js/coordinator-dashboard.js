let currentUser = null;


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


        // Only coordinators can use this page

        if (user.role !== "COORDINATOR") {

            window.location.href =
                "student-dashboard.html";

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
// CREATE EVENT
// ========================================

async function createEvent(event) {

    event.preventDefault();


    const eventData = {

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


    const message =
        document.getElementById(
            "eventMessage"
        );


    message.textContent = "";


    try {

        const response =
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


        if (!response.ok) {

            if (response.status === 403) {

                throw new Error(
                    "You are not allowed to create events."
                );
            }


            throw new Error(
                "Could not create event."
            );
        }


        message.textContent =
            "Event created successfully!";


        document.getElementById(
            "eventForm"
        ).reset();


        await loadEvents();


    } catch (error) {

        console.error(
            "Create event error:",
            error
        );


        message.textContent =
            error.message ||
            "Failed to create event.";

    }

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

                </div>

            `;


            container.appendChild(
                card
            );

        });


    } catch (error) {

        console.error(
            "Load events error:",
            error
        );


        container.innerHTML = `

            <div class="error-message">

                Unable to load events.

                Please refresh the page.

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
        createEvent
    );


    setupLogout();


    await loadEvents();

}


// ========================================
// START
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    initialize
);