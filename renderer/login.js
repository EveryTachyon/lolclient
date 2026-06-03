const form = document.getElementById("login-form");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  msg.textContent = "Checking...";
  const result = await window.bridge.login({ username, password });

  if (result.success) {
    window.location.href = "launcher.html";
  } else {
    msg.textContent = "Invalid username or password.";
    msg.classList.add("error");
  }
});
