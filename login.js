const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const errorMessage =
        document.getElementById("errorMessage");


    // Clear previous error

    errorMessage.textContent = "";


    // Check empty fields

    if (username === "" || password === "") {

        errorMessage.textContent =
            "Please enter username and password.";

        return;
    }


    // Get registered user

    const savedUser =
        localStorage.getItem("cipherSafeUser");


    if (!savedUser) {

        errorMessage.textContent =
            "No account found. Please create an account first.";

        return;
    }


    // Convert saved data back to object

    const user = JSON.parse(savedUser);


    // Check login details

    if (
        username === user.username &&
        password === user.password
    ) {

        // Save currently logged-in user

        localStorage.setItem(
            "loggedInUser",
            user.username
        );


        alert("Login successful!");


        // Go to dashboard

        window.location.href = "dashboard.html";

    } else {

        errorMessage.textContent =
            "Incorrect username or password.";

    }

});