const API_URL = "http://localhost:3000";

$(document).ready(() => {
  const jwt_token = Cookies.get("jwt-token");

  if (!jwt_token) {
    window.location.replace("../index.html");
  }

  check_jwt_valid(jwt_token);

  $("#create-btn").click(() => {
    const title_value = $("#title-input").val();
    const description_value = $("#description-input").val();
    const deadline_value = $("#deadline-input").val();

    return execute_creation(
      title_value,
      description_value,
      deadline_value,
      jwt_token,
    );
  });

  $("back-btn").click(() => {
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

async function execute_creation(
  title_value,
  description_value,
  deadline_value,
  token,
) {
  let response = await fetch(`${API_URL}/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: title_value,
      description: description_value,
      deadlineTime: new Date(deadline_value).toISOString(),
    }),
  });
  response = await response.json();

  if (response.message === "TASK_CREATED") {
    return $("#create-form").append(`
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      <strong>The task id ${response.id} was created successfully!</strong> You can go back to the task page and see the new task by clicking on the back button!
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `);
  } else {
    return $("#create-form").append(`
    <div class="alert alert-danger d-flex align-items-center" role="alert">
      <div>
        The server may be off-line, <strong>contact the web-master immediately<strong>!
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `);
  }
}
