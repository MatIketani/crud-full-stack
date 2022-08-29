const API_URL = "http://localhost:3000";

$(document).ready(() => {
  const jwt_token = Cookies.get("jwt-token");

  /*
  
  TODO: Fazer o botão de sair funcionar.

  */
  $("#logout-link").click(() => {
    Cookies.remove("jwt-token", { path: "../" });
    return window.location.replace("../index.html");
  });

  return !jwt_token
    ? window.location.replace("../index.html")
    : render_account_info(jwt_token);
});

async function render_account_info(token) {
  let response = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  response = await response.json();

  $("#logged-in-as").text(`Logado como ${response.username}`);
  response.tasks.map((task) => {
    $("#task-list").append(`<div class="task">
      <a class="task-title" href="../pages/read.html?id=${task.id}">${task.title}</a>
      </div>`);
  });
}
