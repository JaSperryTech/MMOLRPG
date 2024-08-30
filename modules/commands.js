// Assuming you have a global or imported player object
import player from "./player.js"; // Use the correct import path

// Global booleans
window.setPlayerLevelFlag = false;
window.setPlayerExperienceFlag = false;

// Variables to hold the values
window.newPlayerLevel = null;
window.newPlayerExperience = null;

// Password for command activation
const COMMAND_PASSWORD = "yourPassword"; // Set your password here

// Function to save player data to localStorage
function savePlayerData() {
  localStorage.setItem("playerLevel", player.level);
  localStorage.setItem("playerExperience", player.experience);
}

// Function to check the entered password
function checkPassword() {
  const enteredPassword = prompt("Enter the password:");
  return enteredPassword === COMMAND_PASSWORD;
}

// Command to set player level
export function setPlayerLevel(level) {
  if (typeof level === "number" && level > 0) {
    player.level = level;
    savePlayerData(); // Save to localStorage
    console.log(`Player level set to ${level}`);
  } else {
    console.log("Invalid level value. It must be a positive number.");
  }
}

// Command to set player experience
export function setPlayerExperience(exp) {
  if (typeof exp === "number" && exp >= 0) {
    player.experience = exp;
    savePlayerData(); // Save to localStorage
    console.log(`Player experience set to ${exp}`);
  } else {
    console.log("Invalid experience value. It must be a non-negative number.");
  }
}

// Function to check the flags and execute commands
export function checkCommands() {
  if (window.setPlayerLevelFlag) {
    if (checkPassword()) {
      setPlayerLevel(window.newPlayerLevel);
    } else {
      console.log("Incorrect password. Command not executed.");
    }
    window.setPlayerLevelFlag = false; // Reset the flag
  }
  if (window.setPlayerExperienceFlag) {
    if (checkPassword()) {
      setPlayerExperience(window.newPlayerExperience);
    } else {
      console.log("Incorrect password. Command not executed.");
    }
    window.setPlayerExperienceFlag = false; // Reset the flag
  }
}
