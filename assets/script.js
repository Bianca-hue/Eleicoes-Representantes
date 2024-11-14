function togglePassword(fieldId, iconId) {
    const field = document.getElementById(fieldId);
    const icon = document.getElementById(iconId);

    if (field.type === "password") {
      field.type = "text";
      icon.textContent = "visibility"; // Ícone de olho aberto
    } else {
      field.type = "password";
      icon.textContent = "visibility_off"; // Ícone de olho fechado
    }
  }