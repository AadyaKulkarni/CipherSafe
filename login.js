
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = "";

    if (username === "" || password === "") {
        errorMessage.textContent = "Please enter username and password.";
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            errorMessage.textContent =
                typeof result.detail === "string"
                    ? result.detail
                    : "Login failed. Please check your details.";
            return;
        }

        localStorage.setItem("loggedInUser", result.username);

        alert("Login successful!");
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Login request failed:", error);

        errorMessage.textContent =
            "Cannot connect to the server. Make sure the CipherSafe backend is running.";
    }
});
