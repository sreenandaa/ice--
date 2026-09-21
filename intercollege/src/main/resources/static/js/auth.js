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

        // Convert "AI, Web Development, Robotics"
        // into ["AI", "Web Development", "Robotics"]
        const interestsText =
            document.getElementById("interests").value;

        const interests = interestsText
            .split(",")
            .map(interest => interest.trim())
            .filter(interest => interest.length > 0);

        try {

            const response = await fetch("/api/auth/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    username: username,
                    password: password,
                    role: role,
                    college: college,
                    location: location,
                    interests: interests
                })

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed"
                );
            }

            document.getElementById("registerMessage").textContent =
                "Registration successful! Redirecting to login...";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } catch (error) {

            console.error(error);

            document.getElementById("registerMessage").textContent =
                error.message;
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

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        try {

            const response = await fetch("/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            document.getElementById("loginMessage").textContent =
                "Login successful! Redirecting...";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 500);

        } catch (error) {

            console.error(error);

            document.getElementById("loginMessage").textContent =
                error.message;
        }

    });
}