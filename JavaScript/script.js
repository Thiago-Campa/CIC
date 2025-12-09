// Previsualizar la foto
const fotoInput = document.getElementById('foto');
const preview = document.getElementById('preview');

if (fotoInput && preview) {
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
}

// Alerta de bienvenida (opcional)
window.onload = function() {
  if (!sessionStorage.getItem("bienvenidaMostrada")) {
    alert("¡Bienvenido al formulario del CIC!");
    sessionStorage.setItem("bienvenidaMostrada", "true");
  }
}