// Assuming you have a global or imported player object
import player from "./player.js"; // Use the correct import path

// Global booleans
window.setPlayerLevelFlag = false;
window.setPlayerExperienceFlag = false;
window.setPlayerDamageFlag = false; // New flag for damage
window.setPlayerRebirthFlag = false; // New flag for rebirth

// Variables to hold the values
window.newPlayerLevel = null;
window.newPlayerExperience = null;
window.newPlayerDamage = null; // New variable for damage
window.newPlayerRebirth = null; // New variable for rebirth

// Password for command activation
const COMMAND_PASSWORD = "1234"; // Set your password here

// Function to check the entered password
function checkPassword() {
  const enteredPassword = prompt("Enter the password:");
  return enteredPassword === COMMAND_PASSWORD;
}

// Command to set player level
export function setPlayerLevel(level) {
  if (typeof level === "number" && level > 0) {
    player.level = level;
    localStorage.setItem("playerLevel", player.level || 1);
    console.log(`Player level set to ${level}`);
  } else {
    console.log("Invalid level value. It must be a positive number.");
  }
}

// Command to set player experience
export function setPlayerExperience(exp) {
  if (typeof exp === "number" && exp >= 0) {
    player.experience = exp;
    localStorage.setItem("playerExperience", player.experience || 0);
    console.log(`Player experience set to ${exp}`);
  } else {
    console.log("Invalid experience value. It must be a non-negative number.");
  }
}

// Command to set player damage
export function setPlayerDamage(damage) {
  if (typeof damage === "number" && damage >= 0) {
    player.damage = damage;
    localStorage.setItem("playerDamage", player.damage || 1); // Save damage
    console.log(`Player damage set to ${damage}`);
  } else {
    console.log("Invalid damage value. It must be a non-negative number.");
  }
}

// Command to set player rebirth
export function setPlayerRebirth(rebirth) {
  if (typeof rebirth === "number" && rebirth >= 0) {
    player.rebirth = rebirth;
    localStorage.setItem("playerRebirths", player.rebirth || 0); // Save rebirth
    console.log(`Player rebirth set to ${rebirth}`);
  } else {
    console.log("Invalid rebirth value. It must be a non-negative number.");
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
  if (window.setPlayerRebirthFlag) {
    if (checkPassword()) {
      if (typeof window.newPlayerRebirth === "number") {
        setPlayerRebirth(window.newPlayerRebirth);
      } else {
        console.log("Invalid rebirth value. It must be a number.");
      }
    } else {
      console.log("Incorrect password. Command not executed.");
    }
    window.setPlayerRebirthFlag = false; // Reset the flag
  }
}
