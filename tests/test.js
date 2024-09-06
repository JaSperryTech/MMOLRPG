// Initialize player stats
let playerLevel = 1;
let playerEXP = 0;
let playerDamage = 10; // Initial damage value
let rebirths = 0;
let round = 1;
let area = 1;
let world = 1;

// Constants for experience calculations
const MONSTER_EXP = 10;

// Initialize level tracking object
let levelCounts = {};
let killsPerLevel = []; // Array to store the number of kills per level
let roundsPerLevel = []; // Array to store the number of rounds per level
let killsSinceLastLevel = 0;
let roundsSinceLastLevel = 0;
let totalKillCount = 0; // Track the total number of kills

function getMonsterLevel() {
  // Calculate base level based on round
  const minBaseLevel = round > 0 ? Math.floor(round) : 1;
  const maxBaseLevel = round > 0 ? Math.floor(round * 2) : 1;

  // Generate a skewed random value to favor lower levels
  const randomValue = Math.random();
  const skewFactor = 2; // Adjust this factor to control skew strength
  const skewedRandomValue = Math.pow(randomValue, skewFactor);

  // Calculate the base level using the skewed random value
  const baseLevel =
    Math.floor(skewedRandomValue * (maxBaseLevel - minBaseLevel + 1)) +
    minBaseLevel;

  // Calculate area and world bonuses
  const areaBonus =
    area > 1 ? Math.floor((area - 1) * 10 + Math.random() * 10) : 0;
  const worldBonus =
    world > 1 ? Math.floor((world - 1) * 100 + Math.random() * 100) : 0;

  // Calculate final level
  const level = Math.round(baseLevel + areaBonus + worldBonus);

  // Track level occurrences
  if (!levelCounts[level]) {
    levelCounts[level] = 0;
  }
  levelCounts[level]++;

  return level;
}

function calculateMonsterEXPDrop(monsterLevel) {
  // Monster EXP Drop Equation: 3 * (monster level)^2 + 5 * monster level + 20
  return 3 * monsterLevel ** 2 + 5 * monsterLevel + 20;
}

function calculatePlayerEXPNeeded(playerLevel) {
  // Player EXP Needed Equation: 5 * (player level)^2 + 10 * player level + 100
  return 5 * playerLevel ** 2 + 10 * playerLevel + 100;
}

function rebirth() {
  playerLevel = 1;
  playerEXP = 1;
  playerDamage = 1;
  round = 1;
  area = 1;
  world = 1;
  rebirths++;
}

function applyRebirthBonuses() {
  let damageMultiplier = 1 + 0.01 * rebirths;
  playerDamage = Math.floor(playerDamage * damageMultiplier);

  let additiveBonus = 5 * rebirths;
  playerDamage += additiveBonus;
}

function simulateBattle() {
  // Generate monster level
  const monsterLevel = getMonsterLevel();

  // Calculate experience drop based on monster level using the monster EXP drop equation
  const monsterEXPDrop = calculateMonsterEXPDrop(monsterLevel);

  // Player kills the monster and gains EXP
  playerEXP += monsterEXPDrop;
  killsSinceLastLevel++; // Increment kills count
  totalKillCount++; // Increment total kill count

  // Calculate experience needed for the next level using the player EXP needed equation
  const expNeededForNextLevel = calculatePlayerEXPNeeded(playerLevel);

  // Check if player can level up
  while (playerEXP >= expNeededForNextLevel) {
    playerLevel++;
    playerDamage += 1; // Increase player damage by 1 on level up
    playerEXP -= expNeededForNextLevel; // Subtract required EXP

    console.log("Player leveled up!");
    console.log(`New Player Level: ${playerLevel}`);
    console.log(`New Player Damage: ${playerDamage}`);
    console.log("---------------------------------");

    // Store kills and rounds required for the last level up
    killsPerLevel.push(killsSinceLastLevel);
    roundsPerLevel.push(roundsSinceLastLevel);

    // Reset counters for the next level
    killsSinceLastLevel = 0;
    roundsSinceLastLevel = 0;
  }

  console.log(`Round: ${round}`);
  console.log(`Monster Level: ${monsterLevel}`);
  console.log(`Monster EXP Drop: ${monsterEXPDrop}`);
  console.log(`Player EXP: ${playerEXP}/${expNeededForNextLevel}`);
  console.log(`Player Level: ${playerLevel}`);
  console.log(`Player Damage: ${playerDamage}`);
  console.log(`Total Kills: ${totalKillCount}`);
  console.log("---------------------------------");

  // Increment round
  round++;
  roundsSinceLastLevel++; // Increment rounds count

  if (round == 11) {
    round = 1;
    area++;
  } else if (area == 101) {
    round = 1;
    area = 1;
    world++;
  }
}

// Simulate multiple battles
for (rebirths = 0; rebirths < 10; ) {
  simulateBattle();

  if (playerLevel >= 100) {
    console.log("Rebirthing...");
    rebirth();
    applyRebirthBonuses(); // Apply the bonuses after rebirth
    console.log(`Rebirths: ${rebirths}`);
    console.log(`Player Damage after rebirth: ${playerDamage}`);
    console.log("---------------------------------");
  }
}

console.table(levelCounts, ["level", "count"]);
console.table(killsPerLevel, ["Kills per Level"]);
console.table(roundsPerLevel, ["Rounds per Level"]);
console.log("Total Kill Count:", totalKillCount); // Display total kill count
