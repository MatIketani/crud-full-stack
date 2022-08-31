const API_URL = "http://localhost:3000";

$(document).ready(() => {
  const jwt_token = Cookies.get("jwt-token");

  if (!jwt_token) {
    return window.location.replace("../pages/index.html");
  }

  check_jwt(jwt_token);

  $("#log-out-btn").click(() => {
    Cookies.remove("jwt-token", {
      path: "/front-end",
    });
    return window.location.replace("../index.html");
  });
});

async function check_jwt(token) {
  let response = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if ((await response.json()).message == "ACCESS_DENIED") {
    return window.location.replace("../pages/index.html");
  }

  render_tasks(token);
}

async function render_tasks(token) {
  let response = await fetch(`${API_URL}/task`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  response = await response.json();

  response.forEach((task) => {
    $("#task-table-body").append(`
    <tr>
      <th scope="row">${task.id}</th>
      <td>${task.title}</td>
      <td>${task.description ? task.description : "Empty"}</td>
      <td>${
        task.deadlineTime
          ? new Date(task.deadlineTime).getTime() < Date.now()
            ? new Date(task.deadlineTime).toLocaleDateString() + " (late)"
            : new Date(task.deadlineTime).toLocaleDateString()
          : "Empty"
      }</td>
      <td>${new Date(task.createdAt).toLocaleDateString()}</td>
      <td>
        <a href="../pages/update.html?id=${task.id}">
          <button type="button" class="btn btn-success"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
        </svg></button>
        </a>
        <a href="../pages/delete.html?id=${task.id}">
          <button type="button" class="btn btn-danger"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
        </svg></button>
        </a>
      </td>
    </tr>
    `);
  });
}
