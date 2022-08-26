const API_URL = "http://localhost:3000";

$(document).ready(() => {
  const jwt_token = Cookies.get("jwt-token");

  return !jwt_token
    ? window.location.replace("index.html")
    : render_account_info(jwt_token);
});

async function render_account_info(token) {
  const response = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  response.json().then((data) => {
    $("#logged-in-as").text(`Logado como ${data.username}`);
    data.tasks.map((task) => {
      $("#task-list").append(`<div>
      <p>${task.title}</p>
      </div>`);
    });
  });
}
