const { app, BrowserWindow, ipcMain } = require("electron");
const dbQueries = require("./db/queries");
const { ping } = require("./db/connection");

let dbAvailable = false;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    resizable: false,
    frame: false,
    backgroundColor: "#0b1218",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("index.html");
}

ipcMain.handle("db:get-client-data", async () => {
  if (!dbAvailable) {
    return null;
  }
  return dbQueries.loadClientData();
});

ipcMain.handle("db:status", async () => ({
  connected: dbAvailable
}));

app.whenReady().then(async () => {
  try {
    await ping();
    dbAvailable = true;
    console.log("MySQL connected.");
  } catch (error) {
    dbAvailable = false;
    console.warn("MySQL unavailable, using fallback data:", error.message);
  }

  createWindow();
});
