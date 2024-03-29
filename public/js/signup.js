const errorMsg = document.getElementById("error-msg");
const signupButton = document.getElementById("signup-button");
const wrongPassword = document.getElementById("wrong-password");

signupButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const mobile = document.getElementById("mobile");
  const password = document.getElementById("password");
  const conformPassword = document.getElementById("conform-password");

  const inputs = document.querySelectorAll(".input-details");

  // removing empty class
  inputs.forEach((input) => {
    input.classList.remove("empty");
  });

  conformPassword.classList.remove("wrong-password");
  wrongPassword.style.display = "none";

  if (
    username.value != "" &&
    email.value != "" &&
    mobile.value != "" &&
    password.value != "" &&
    conformPassword.value != ""
  ) {
    errorMsg.style.display = "none";

    if (password.value != conformPassword.value) {
      conformPassword.classList.add("wrong-password");
      wrongPassword.style.display = "block";
    } else {
      // now everything is fine.
      // call backend api to post the user signup data.

      // console.log("Sending data to backend...");

      try {
        const result = await axios.post(`user/signup`, {
          userName: username.value,
          email: email.value,
          mobileNumber: mobile.value,
          password: password.value,
        });

        // console.log(result);
        alert("User signed up successfully.");
        window.location.assign("./login.html");
      } catch (err) {
        // console.log(err);
        if (err.message === "Request failed with status code 404") {
          alert("User Already Exists.");
        } else {
          alert("Something went wrong.");
        }
      }

      username.value = "";
      email.value = "";
      password.value = "";
      mobile.value = "";
      conformPassword.value = "";
    }
  } else {
    errorMsg.style.display = "block";

    const inputs = document.querySelectorAll(".input-details");

    // adding empty class to all the empty fields when clicked on signup button.
    inputs.forEach((input) => {
      if (input.value === "") {
        input.classList.add("empty");
      }
    });
  }
});
