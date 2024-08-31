// Assuming you have a global or imported player object
import player from "./player.js"; // Use the correct import path

// Global booleans
window.setPlayerLevelFlag = false;
window.setPlayerExperienceFlag = false;
window.setPlayerDamageFlag = false; // New flag for damage

// Variables to hold the values
window.newPlayerLevel = null;
window.newPlayerExperience = null;
window.newPlayerDamage = null; // New variable for damage

// Password for command activation
const COMMAND_PASSWORD = "1234"; // Set your password here

// Function to save player data to localStorage
function savePlayerData() {
  localStorage.setItem("playerLevel", player.level);
  localStorage.setItem("playerExperience", player.experience);
  localStorage.setItem("playerDamage", player.damage); // Save damage
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
    setPlayerExperience(0); // Optionally reset experience to 0
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

// Command to set player damage
export function setPlayerDamage(damage) {
  if (typeof damage === "number" && damage >= 0) {
    player.damage = damage;
    savePlayerData(); // Save to localStorage
    console.log(`Player damage set to ${damage}`);
  } else {
    console.log("Invalid damage value. It must be a non-negative number.");
  }
}

// Function to check the flags and execute commands
export function checkCommands() {
  if (window.setPlayerLevelFlag) {
    if (checkPassword()) {
      if (typeof window.newPlayerLevel === "number") {
        setPlayerLevel(window.newPlayerLevel);
      } else {
        console.log("Invalid level value. It must be a number.");
      }
    } else {
      console.log("Incorrect password. Command not executed.");
    }
    window.setPlayerLevelFlag = false; // Reset the flag
  }
  if (window.setPlayerExperienceFlag) {
    if (checkPassword()) {
      if (typeof window.newPlayerExperience === "number") {
        setPlayerExperience(window.newPlayerExperience);
      } else {
        console.log("Invalid experience value. It must be a number.");
      }
    } else {
      console.log("Incorrect password. Command not executed.");
    }
    window.setPlayerExperienceFlag = false; // Reset the flag
  }
  if (window.setPlayerDamageFlag) {
    if (checkPassword()) {
      if (typeof window.newPlayerDamage === "number") {
        setPlayerDamage(window.newPlayerDamage);
      } else {
        console.log("Invalid damage value. It must be a number.");
      }
    } else {
      console.log("Incorrect password. Command not executed.");
    }
    window.setPlayerDamageFlag = false; // Reset the flag
  }
}
