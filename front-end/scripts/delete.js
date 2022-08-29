const API_URL = "http://localhost:3000";

$(document).ready(() => {
  const task_id = new URLSearchParams(location.search).get("id");

  if (!task_id) {
    window.location.replace("../pages/dashboard.html");
  }

  const jwt_token = Cookies.get("jwt-token");

  if (!jwt_token || !check_jwt_valid(jwt_token)) {
    return window.location.replace("../index.html");
  }

  execute_delete(task_id, jwt_token);
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
    return false;
  }

  return true;
}

async function execute_delete(task_id, token) {
  let response = await fetch(`${API_URL}/task/${task_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  response = await response.json();

  switch (response.message) {
    case "NOT_FOUND":
      return window.location.replace("../pages/404.html");
    case "TASK_DELETED":
      alert("Task deleted successfully!");
      return window.location.replace("../pages/dashboard.html");
    default:
      return alert(
        "An internal error occurred, contact the web administrator quickly!",
      );
  }
}
