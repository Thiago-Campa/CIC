// Previsualizar la foto
const fotoInput = document.getElementById('foto');
const preview = document.getElementById('preview');

fotoInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.innerHTML = `<img src="${e.target.result}" alt="Foto">`;
    }
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = "";
  }
});

// Capturar datos (simulación)
const formulario = document.getElementById('formulario');
formulario.addEventListener('submit', function(e) {
  e.preventDefault();
  const datos = {
    nombre: document.getElementById('nombre').value,
    apellido: document.getElementById('apellido').value,
    dni: document.getElementById('dni').value,
    email: document.getElementById('email').value,
    telefono: document.getElementById('telefono').value,
    nivel: document.getElementById('nivel').value,
    carrera: document.getElementById('carrera').value
  };
  console.log("Datos cargados:", datos);
  alert("Datos guardados localmente (se implementará BD más adelante).");
});
