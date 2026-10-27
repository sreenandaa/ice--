let currentUser = null;

let allEvents = [];

let reviewsByEvent = {};

let selectedRatings = {};


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


        // Only students can use this dashboard

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
// LOAD REVIEWS
// ========================================

async function loadReviewsForEvents(events) {

    reviewsByEvent = {};


    const completedEvents =
        events.filter(
            event =>
                event.status === "Completed"
        );


    await Promise.all(
        completedEvents.map(
            async event => {

                try {

                    const response =
                        await fetch(
                            `/api/reviews/event/${event.id}`
                        );


                    if (!response.ok) {
                        return;
                    }


                    const reviews =
                        await response.json();


                    reviewsByEvent[event.id] =
                        reviews;

                } catch (error) {

                    console.error(
                        `Could not load reviews for event ${event.id}:`,
                        error
                    );


                    reviewsByEvent[event.id] =
                        [];
                }
            }
        )
    );
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
// ESCAPE HTML
// ========================================

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(`${dateString}T00:00:00`);


    if (Number.isNaN(date.getTime())) {
        return dateString;
    }


    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}


// ========================================
// CREATE STARS
// ========================================

function createStars(rating) {

    let stars = "";

    for (let i = 1; i <= 5; i++) {

        stars +=
            i <= rating
                ? "★"
                : "☆";
    }

    return stars;
}


// ========================================
// CALCULATE AVERAGE RATING
// ========================================

function calculateAverageRating(reviews) {

    if (!reviews ||
        reviews.length === 0) {

        return null;
    }


    const total =
        reviews.reduce(
            (sum, review) =>
                sum + Number(review.rating || 0),
            0
        );


    return (
        total / reviews.length
    ).toFixed(1);
}


// ========================================
// CREATE REVIEW SECTION
// ========================================

function createReviewSection(event) {

    const reviews =
        reviewsByEvent[event.id] || [];


    const average =
        calculateAverageRating(reviews);


    const myReview =
        reviews.find(
            review =>
                review.username ===
                currentUser.username
        );


    let reviewsList = "";


    if (reviews.length > 0) {

        reviewsList =
            reviews.map(
                review => {

                    return `

                        <div class="review-item">

                            <div class="review-item-header">

                                <strong>
                                    ${escapeHtml(
                                        review.username
                                    )}
                                </strong>

                                <span class="review-stars">
                                    ${createStars(
                                        review.rating
                                    )}
                                </span>

                            </div>


                            <p>
                                ${escapeHtml(
                                    review.review
                                )}
                            </p>

                        </div>

                    `;
                }
            ).join("");

    } else {

        reviewsList = `
            <p class="no-reviews">
                No reviews yet. Be the first to review this event.
            </p>
        `;
    }


    // If the student has already reviewed it

    if (myReview) {

        return `

            <div class="review-section">

                <h4>Event Reviews</h4>


                ${
                    average
                        ? `
                            <p class="average-rating">
                                Average Rating:
                                <strong>
                                    ⭐ ${average}/5
                                </strong>
                                (${reviews.length}
                                ${
                                    reviews.length === 1
                                        ? "review"
                                        : "reviews"
                                })
                            </p>
                        `
                        : ""
                }


                <div class="review-list">

                    ${reviewsList}

                </div>


                <div class="your-review-message">

                    <strong>
                        You already reviewed this event.
                    </strong>

                    <p>
                        Your rating:
                        <span class="review-stars">
                            ${createStars(
                                myReview.rating
                            )}
                        </span>
                    </p>

                </div>

            </div>

        `;
    }


    return `

        <div class="review-section">

            <h4>Rate This Event</h4>


            ${
                average
                    ? `
                        <p class="average-rating">
                            Average Rating:
                            <strong>
                                ⭐ ${average}/5
                            </strong>
                            (${reviews.length}
                            ${
                                reviews.length === 1
                                    ? "review"
                                    : "reviews"
                            })
                        </p>
                    `
                    : ""
            }


            <form
                class="review-form"
                data-event-id="${event.id}"
            >

                <div class="rating-input">

                    <span>Your Rating:</span>


                    <div class="star-selector">

                        ${[1, 2, 3, 4, 5]
                            .map(
                                rating => `
                                    <button
                                        type="button"
                                        class="rating-star"
                                        data-rating="${rating}"
                                        aria-label="${rating} star"
                                    >
                                        ☆
                                    </button>
                                `
                            )
                            .join("")}

                    </div>

                </div>


                <textarea
                    class="review-text"
                    placeholder="Write your review about this event..."
                    rows="4"
                    maxlength="1000"
                    required
                ></textarea>


                <button
                    type="submit"
                    class="submit-review-btn"
                >
                    Submit Review
                </button>


                <p class="review-message"></p>

            </form>


            <div class="review-list">

                ${reviewsList}

            </div>

        </div>

    `;
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


        // Registration button

        let registerButton = "";


        if (
            event.registrationLink &&
            event.status !== "Completed"
        ) {

            registerButton = `

                <a
                    href="${escapeHtml(
                        event.registrationLink
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="event-btn register-btn"
                >
                    Register Now
                </a>

            `;
        }


        // Review section only for completed events

        let reviewSection = "";


        if (
            event.status === "Completed"
        ) {

            reviewSection =
                createReviewSection(
                    event
                );
        }


        card.innerHTML = `

            <div class="event-card-content">

                <span class="event-category">
                    ${escapeHtml(
                        event.category
                    )}
                </span>


                <h3>
                    ${escapeHtml(
                        event.name
                    )}
                </h3>


                <p>
                    <strong>College:</strong>
                    ${escapeHtml(
                        event.college
                    )}
                </p>


                <p>
                    <strong>Location:</strong>
                    ${escapeHtml(
                        event.city
                    )}
                </p>


                <p>
                    <strong>Date:</strong>
                    ${formatDate(
                        event.date
                    )}
                </p>


                <p>
                    <strong>Status:</strong>
                    ${escapeHtml(
                        event.status
                    )}
                </p>


                <p class="event-description">
                    ${escapeHtml(
                        event.description
                    )}
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


                ${reviewSection}

            </div>

        `;


        container.appendChild(card);

    });


    setupReviewForms();
}


// ========================================
// REVIEW FORM EVENTS
// ========================================

function setupReviewForms() {

    const forms =
        document.querySelectorAll(
            ".review-form"
        );


    forms.forEach(form => {

        const eventId =
            form.dataset.eventId;


        selectedRatings[eventId] = 0;


        const stars =
            form.querySelectorAll(
                ".rating-star"
            );


        stars.forEach(star => {

            star.addEventListener(
                "click",
                function () {

                    const rating =
                        Number(
                            this.dataset.rating
                        );


                    selectedRatings[eventId] =
                        rating;


                    stars.forEach(
                        currentStar => {

                            const starRating =
                                Number(
                                    currentStar.dataset.rating
                                );


                            currentStar.textContent =
                                starRating <= rating
                                    ? "★"
                                    : "☆";

                            currentStar.classList.toggle(
                                "selected",
                                starRating <= rating
                            );

                        }
                    );

                }
            );

        });


        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const rating =
                    selectedRatings[eventId] || 0;


                const reviewText =
                    form.querySelector(
                        ".review-text"
                    ).value.trim();


                const message =
                    form.querySelector(
                        ".review-message"
                    );


                if (rating === 0) {

                    message.textContent =
                        "Please select a rating.";

                    message.className =
                        "review-message error";

                    return;
                }


                if (!reviewText) {

                    message.textContent =
                        "Please write a review.";

                    message.className =
                        "review-message error";

                    return;
                }


                try {

                    const response =
                        await fetch(
                            `/api/reviews/event/${eventId}`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    rating: rating,
                                    review: reviewText
                                })
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Could not submit review."
                        );
                    }


                    message.textContent =
                        "Review submitted successfully!";

                    message.className =
                        "review-message success";


                    // Reload reviews

                    const reviewsResponse =
                        await fetch(
                            `/api/reviews/event/${eventId}`
                        );


                    if (
                        reviewsResponse.ok
                    ) {

                        reviewsByEvent[eventId] =
                            await reviewsResponse.json();
                    }


                    // Refresh the displayed events

                    const searchInput =
                        document.getElementById(
                            "searchInput"
                        );


                    const search =
                        searchInput.value
                            .toLowerCase()
                            .trim();


                    const filteredEvents =
                        allEvents.filter(
                            event =>
                                event.name
                                    ?.toLowerCase()
                                    .includes(search) ||
                                event.category
                                    ?.toLowerCase()
                                    .includes(search) ||
                                event.college
                                    ?.toLowerCase()
                                    .includes(search) ||
                                event.city
                                    ?.toLowerCase()
                                    .includes(search) ||
                                event.description
                                    ?.toLowerCase()
                                    .includes(search)
                        );


                    displayEvents(
                        filteredEvents
                    );


                } catch (error) {

                    console.error(
                        "Review submission error:",
                        error
                    );


                    message.textContent =
                        error.message ||
                        "Could not submit review.";

                    message.className =
                        "review-message error";
                }

            }
        );

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


        // Make sure latest events stay first

        allEvents.sort(
            (a, b) => {

                const dateA =
                    new Date(
                        `${a.date || "1900-01-01"}T${
                            a.startTime || "00:00:00"
                        }`
                    );


                const dateB =
                    new Date(
                        `${b.date || "1900-01-01"}T${
                            b.startTime || "00:00:00"
                        }`
                    );


                return dateB - dateA;
            }
        );


        // Load reviews for completed events

        await loadReviewsForEvents(
            allEvents
        );


        // Display latest events

        displayEvents(
            allEvents
        );


        // Search

        setupSearch();


        // Logout

        setupLogout();

    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        document.getElementById(
            "eventsContainer"
        ).innerHTML = `

            <p class="error-message">

                Unable to load events.
                Please refresh the page.

            </p>

        `;
    }
}


// ========================================
// START
// ========================================

initializeDashboard();