const API_URL = "http://localhost:3000";

$(document).ready(() => {
  const task_id = new URLSearchParams(location.search).get("id");

  if (!task_id) {
    window.location.replace("../pages/dashboard.html");
  }

  const jwt_token = Cookies.get("jwt-token");

  if (!jwt_token || check_jwt_valid(jwt_token)) {
    return window.location.replace("../index.html");
  }

  if (!check_if_task_exists(task_id, jwt_token)) {
    return window.location.replace("../pages/404.html");
  }

  $("#edit-btn").click(() => {
    const title_value = $("#title-input").val();
    const description_value = $("#description-input").val();
    let deadline_value = $("#deadline-input").val();

    console.log(deadline_value);

    if (deadline_value) {
      deadline_value = new Date(deadline_value).toISOString();
    }

    execute_update(
      task_id,
      title_value,
      description_value,
      deadline_value,
      jwt_token,
    );
  });
});

function check_jwt_valid(token) {
  let response = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  response = await response.json();

  if(response.message === "ACCESS_DENIED"){
    return false
  }

  return true
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
    return false;
  }

  return true;
}

async function execute_update(
  task_id,
  title_value,
  description_value,
  deadline_value,
  token,
) {
  if (title_value === "" && description_value === "" && deadline_value === "") {
    return alert("You need to fill at least one field!");
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

  alert("Task updated successfully!");
  window.location.replace(`../pages/read.html?id=${task_id}`);
}
