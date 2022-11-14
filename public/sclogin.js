const API = "http://127.0.0.1:5000/map-api/user";

async function getUserData() {
  const response = await fetch(API);
  const data = await response.json();

  let user = data.user;
  let email = data.email;

  document.getElementById("user").innerHTML = user;
}
