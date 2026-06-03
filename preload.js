const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("bridge", {
  login: (credentials) => ipcRenderer.invoke("login", credentials),
  launchGame: () => ipcRenderer.invoke("launch-game")
});
