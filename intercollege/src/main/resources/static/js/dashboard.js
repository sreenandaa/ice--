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
                🎫
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

                <a
                    href="event.html?id=${event.id}"
                    class="btn"
                >
                    View Event
                </a>

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