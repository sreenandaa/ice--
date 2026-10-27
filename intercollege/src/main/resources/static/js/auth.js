
// ==============================
// REGISTER
// ==============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;
        const college = document.getElementById("college").value.trim();
        const location = document.getElementById("location").value.trim();

        const interests = document.getElementById("interests").value
            .split(",")
            .map(item => item.trim())
            .filter(item => item.length > 0);

        const message = document.getElementById("registerMessage");

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    name,
                    username,
                    password,
                    role,
                    college,
                    location,
                    interests
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || data.error ||
                    "Registration failed. Please try again.");
            }

            message.textContent =
                "Registration successful! Opening your dashboard...";

            // Registration also logs the user in.
            if (data.role === "COORDINATOR") {
                window.location.replace("coordinator-dashboard.html");
            } else if (data.role === "STUDENT") {
                window.location.replace("student-dashboard.html");
            } else {
                throw new Error("Invalid user role returned by server.");
            }

        } catch (error) {
            console.error(error);
            message.textContent = error.message;
        }
    });
}


// ==============================
// LOGIN
// ==============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("loginMessage");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "same-origin",
                body: JSON.stringify({ username, password })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || data.error ||
                    "Invalid username or password.");
            }

            // The server returns the logged-in user's role.
            if (data.role === "COORDINATOR") {
                window.location.replace("coordinator-dashboard.html");
            } else if (data.role === "STUDENT") {
                window.location.replace("student-dashboard.html");
            } else {
                throw new Error("Could not identify your account role.");
            }

        } catch (error) {
            console.error(error);
            message.textContent = error.message;
        }
    });
}
