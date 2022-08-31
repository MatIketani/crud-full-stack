const API_URL = "http://localhost:3000";

$(document).ready(() => {
  const jwt_token = Cookies.get("jwt-token");

  if (jwt_token) {
    check_jwt(jwt_token);
  }

  $("#sign-in-btn").click(() => {
    const username = $("#username-input").val();
    const password = $("#password-input").val();

    if (username === "" || password === "") {
      return;
    }

    return signin(username, password);
  });

  $("#sign-up-btn").click(() => {
    const username = $("#username-input").val();
    const password = $("#password-input").val();

    if (username === "" || password === "") {
      return;
    }

    return signup(username, password);
  });
});

async function check_jwt(token) {
  let response = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if ((await response.json()).message != "ACCESS_DENIED") {
    window.location.replace("./pages/tasks.html");
  }
}

async function signin(username, password) {
  let response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  response = await response.json();

  switch (response.message) {
    case "USER_NOT_FOUND":
    case "USER_OR_PASSWORD_INCORRECT":
      return $("#login-form").append(
        `<div class="alert alert-danger d-flex align-items-center" role="alert" style="margin-top: 10px; width: fit-content;">
        <div>
          The provided <strong>username or password are incorrect</strong> or do not exists!
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`,
      );
    case "LOGIN_SUCCESSFUL":
      Cookies.set("jwt-token", response.jwt, {
        path: "../",
      });
      return window.location.replace("./pages/tasks.html");
    default:
      return $("#login-form").append(
        `<div class="alert alert-danger d-flex align-items-center" role="alert" style="margin-top: 10px; width: fit-content;">
        <div>
          The server may be off-line, <strong>contact the web-master immediately<strong>!
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`,
      );
  }
}

async function signup(username, password) {
  let response = await fetch(`${API_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  response = await response.json();

  switch (response.message) {
    case "USER_ALREADY_EXISTS":
      return $("#login-form").append(
        `<div class="alert alert-danger d-flex align-items-center" role="alert"">
        <div>
          The provided <strong>username</strong> already exists!
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`,
      );
    case "ACCOUNT_CREATED":
      return $("#login-form").append(`
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Your account was successfully created!</strong> Now you can log-in using your informations and the sign-in button!
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `);
    default:
      return $("#login-form").append(
        `<div class="alert alert-danger d-flex align-items-center" role="alert">
        <div>
          The server may be off-line, <strong>contact the web-master immediately<strong>!
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`,
      );
  }
}
