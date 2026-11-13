// =====================================
// REGISTER FORM
// =====================================

document
    .getElementById("registerForm")
    .addEventListener("submit", function (event) {

        // Prevent page refresh
        event.preventDefault();


        // =====================================
        // GET FORM VALUES
        // =====================================

        const name =
            document
                .getElementById("userName")
                .value
                .trim();


        const email =
            document
                .getElementById("userEmail")
                .value
                .trim();


        const phone =
            document
                .getElementById("userPhone")
                .value
                .trim();


        const address =
            document
                .getElementById("userAddress")
                .value
                .trim();


        const password =
            document
                .getElementById("userPassword")
                .value;

        if (!name) {
            alert("Please enter your name.");
            return;
        }

        if (!address) {
            alert("Please enter your address.");
            return;
        }


        // =====================================
        // CHECK ADMIN EMAIL
        // =====================================

        if (email === "stalin@gmail.com") {

            alert(
                "This email is reserved for the Admin account."
            );

            return;
        }


        // =====================================
        // CREATE USER OBJECT
        // =====================================

        const registeredUser = {

            name: name,

            email: email,

            phone: phone,

            address: address,

            password: password,

            role: "User"

        };


        // =====================================
        // SAVE USER
        // =====================================

        localStorage.setItem(
            "registeredUser",
            JSON.stringify(registeredUser)
        );


        // =====================================
        // SUCCESS MESSAGE
        // =====================================

        alert(
            "Registration successful! Please login."
        );


        // =====================================
        // CLEAR FORM
        // =====================================

        document
            .getElementById("registerForm")
            .reset();


        // =====================================
        // GO TO LOGIN PAGE
        // =====================================

        window.location.href = "../LOGIN/login.html";

    });


// =====================================
// BACK TO HOME
// =====================================

document
    .getElementById("backHomeBtn")
    .addEventListener("click", function () {

        window.location.href = "../index.html";

    });