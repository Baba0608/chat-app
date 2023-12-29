// username , email , mobile , password , conform-password
const website = "http://localhost:4000";

const errorMsg = document.getElementById("error-msg");
const loginButton = document.getElementById("login-button");
const wrongPassword = document.getElementById("wrong-password");

loginButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email");
  const password = document.getElementById("password");

  const inputs = document.querySelectorAll(".input-details");

  // removing empty class
  inputs.forEach((input) => {
    input.classList.remove("empty");
  });

  password.classList.remove("wrong-password");
  wrongPassword.style.display = "none";

  if (email.value != "" && password.value != "") {
    errorMsg.style.display = "none";
    try {
      const result = await axios.post(`${website}/user/login`, {
        email: email.value,
        password: password.value,
      });

      alert("User Logged in successfully.");
      // console.log(result);
      localStorage.setItem("chat-app-token", result.data.token);

      email.value = "";
      password.value = "";
    } catch (err) {
      //   console.log(err);
      if (err.message === "Request failed with status code 404") {
        alert("User does not exists.");
      } else if (err.message === "Request failed with status code 401") {
        password.classList.add("wrong-password");
        wrongPassword.style.display = "block";
      } else {
        alert("Something went wrong.");
      }
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
