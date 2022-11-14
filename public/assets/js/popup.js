var btnAbrirPopup = document.getElementById("queryTbx"),
  overlay = document.getElementById("overlay"),
  popup = document.getElementById("popup"),
  btnCerrarPopup = document.getElementById("btn-cerrar-popup");

btnAbrirPopup.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    overlay.classList.add("active");
    popup.classList.add("active");
  }
});

btnCerrarPopup.addEventListener("click", function (e) {
  e.preventDefault();
  overlay.classList.remove("active");
  popup.classList.remove("active");
});

function submitted() {
  //aquí va el código para llamar a la base de datos y guardar en la base
}

function forgot() {
  var text = document.getElementById("response-forgot-email");
  text.innerHTML("<p>El correo ha sido enviado correctamente</p>");
}
function password_change() {
  var text = document.getElementById("response-password-change");
  text.innerHTML("<p>La contraseña ha sido cambiada correctamente</p>");
}
