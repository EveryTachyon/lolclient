document.getElementById("launch-btn").addEventListener("click", async () => {
  const launched = await window.bridge.launchGame();
  if (launched) {
    const button = document.getElementById("launch-btn");
    button.textContent = "Launching...";
    button.disabled = true;
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  window.location.href = "index.html";
});
