//SECCION DISCAPACIDAD--------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const tieneDis = document.getElementById("tieneDis");
  const extra = document.getElementById("discapacidadExtra");

  // Ocultar al inicio
  extra.style.display = "none";

  tieneDis.addEventListener("change", () => {
    if (tieneDis.value === "Si") {
      extra.style.display = "block";
    } else {
      extra.style.display = "none";
    }
  });
});