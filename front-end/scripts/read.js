const API_URL = "http://localhost:3000";

$(document).ready(() => {
  const task_id = new URLSearchParams(location.search).get("id");

  if (!task_id) {
    window.location.replace("../pages/dashboard.html");
  }

  const jwt_token = Cookies.get("jwt-token");

  if (!jwt_token) {
    return window.location.replace("../index.html");
  }

  render_task(jwt_token, task_id);

  $("#send-to-edit-btn").click(() => {
    return window.location.replace(`../pages/update.html?id=${task_id}`);
  });

  $("#send-to-delete-btn").click(() => {
    return window.location.replace(`../pages/delete.html?id=${task_id}`);
  });
});

async function check_jwt_valid(token) {
  const response = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  response.json().then((data) => {
    if (data.message === "ACCESS_DENIED") {
      window.location.replace("../pages/index.html");
    }
  });
}

async function render_task(token, task_id) {
  let response = await fetch(`${API_URL}/task/${task_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  response = await response.json();

  if (response.message === "NOT_FOUND") {
    return window.location.replace("../pages/404.html");
  }

  $("#task").append(`
  <tr>
  <th>Title:</th>
  <td>${response.title}</td>
  </tr>
  `);

  if (response.description) {
    $("#task").append(`
    <tr>
    <th>Description:</th>
    <td>${response.description}</td>
    </tr>
    `);
  }

  if (response.deadlineTime) {
    const deadlineDateTime = new Date(response.deadlineTime);
    $("#task").append(`
    <tr>
    <th>Deadline Date:</th>
    <td>${deadlineDateTime.toLocaleDateString()}</td>
    </tr>
    `);
  }

  const createdAtDate = new Date(response.createdAt);
  $("#task").append(`
    <tr>
    <th>Created at:</th>
    <td>${createdAtDate.toLocaleDateString()}</td>
    </tr>
  `);
}
