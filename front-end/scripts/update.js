const API_URL = "http://localhost:3000";

$(document).ready(() => {
  const task_id = new URLSearchParams(location.search).get("id");

  if (!task_id) {
    window.location.replace("../pages/tasks.html");
  }

  const jwt_token = Cookies.get("jwt-token");

  if (!jwt_token) {
    window.location.replace("../index.html");
  }

  check_jwt_valid(jwt_token);
  check_if_task_exists(task_id, jwt_token);
  get_task(task_id, jwt_token);

  $("#save-btn").click(() => {
    const title_value = $("#title-input").val();
    const description_value = $("#description-input").val();
    const deadline_value = $("#deadline-input").val();

    execute_update(
      task_id,
      title_value,
      description_value,
      deadline_value,
      jwt_token,
    );
  });

  $("#back-btn").click(() => {
    return window.location.replace("../pages/tasks.html");
  });
});

async function check_jwt_valid(token) {
  let response = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  response = await response.json();
  if (response.message === "ACCESS_DENIED") {
    return window.location.replace("../pages/index.html");
  }
}

async function check_if_task_exists(task_id, token) {
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
}

async function get_task(task_id, token) {
  let response = await fetch(`${API_URL}/task/${task_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  response = await response.json();

  var date = new Date(response.deadlineTime);

  $("#title-input").val(response.title);
  $("#description-input").val(response.description);
  $("#deadline-input").val(
    date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
  );
}

async function execute_update(
  task_id,
  title_value,
  description_value,
  deadline_value,
  token,
) {
  if (title_value === "" && description_value === "" && deadline_value === "") {
    return $("#update-form").append(`
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>You must fill</strong> at least one field!
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `);
  }

  let response = await fetch(`${API_URL}/task/${task_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: title_value,
      description: description_value,
      deadlineTime: deadline_value,
    }),
  });
  response = await response.json();

  if (response.message === "TASK_UPDATED") {
    return $("#update-form").append(`
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      <strong>The task id ${task_id} was updated successfully!</strong> You can go back to the task page and see the alterations by clicking on the back button!
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `);
  } else {
    return $("#update-form").append(`
    <div class="alert alert-danger d-flex align-items-center" role="alert">
      <div>
        The server may be off-line, <strong>contact the web-master immediately<strong>!
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `);
  }
}
