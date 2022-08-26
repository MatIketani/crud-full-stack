const API_URL = "http://localhost:3000";

$(document).ready(() => {
  $("#signin-btn").click(() => {
    var username = $("#uname-input").val();
    var password = $("#pwd-input").val();

    return validate_fields(username, password, 1);
  });

  $("#signup-btn").click(() => {
    var username = $("#uname-input").val();
    var password = $("#pwd-input").val();

    return validate_fields(username, password, 2);
  });
});

function uname_border_red() {
  $("#uname-input").val("");
  $("#pwd-input").val("");
  $("#uname-input").css("border", "2px solid red");
}

function password_border_red() {
  $("#uname-input").val("");
  $("#pwd-input").val("");
  $("#pwd-input").css("border", "2px solid red");
}

function validate_fields(username, password, mode) {
  modes = [1, 2];

  if (!modes.includes(mode)) {
    throw new Error("mode not supported, use 1 for login and 2 for register");
  }

  if (username === "" && password != "") {
    uname_border_red();
    alert("You should fill the username field.");
  } else if (username != "" && password === "") {
    password_border_red();
    alert("You should fill the password field.");
  } else if (username === "" && password === "") {
    uname_border_red();
    password_border_red();
    alert("You should fill the username and password fields");
  } else {
    switch (mode) {
      case 1:
        return login(username, password);
      case 2:
        return register(username, password);
    }
  }
}

async function check_jwt_valid(token) {}

async function login(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  response.json().then((data) => {
    switch (data.message) {
      case "USER_NOT_FOUND":
        uname_border_red();
        password_border_red();
        return alert("The provided username or password are incorrect.");
      case "USER_OR_PASSWORD_INCORRECT":
        uname_border_red();
        password_border_red();
        return alert("The provided username or password are incorrect.");
      case "LOGIN_SUCCESSFUL":
        Cookies.set("jwt-token", data.jwt, {
          expires: 14400,
          path: "./",
        });
        alert("Login made successfully!");
        return window.location.replace("pages/dashboard.html");
      default:
        return alert("A unexpected error occurred in the server.");
    }
  });
}

async function register(username, password) {}
