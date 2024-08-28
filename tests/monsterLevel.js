const ROUND = 6; // Placeholder value;
const AREA = 1; // Placeholder value;
const WORLD = 1; // Placeholder value;
const playerPower = 1; // Placeholder value;

let data = [];
let levelCounts = {}; // Object to keep track of level occurrences

function getMonsterLevel() {
  const minBaseLevel = ROUND > 0 ? Math.floor(ROUND) : 1;
  const maxBaseLevel = ROUND > 0 ? Math.floor(ROUND * 2) : 1;

  const randomValue = Math.random();
  const dynamicSkew = Math.max(5, 15 - Math.log1p(ROUND));
  const weightedRandom = Math.pow(randomValue, dynamicSkew);

  const BaseLevel =
    Math.floor(weightedRandom * (maxBaseLevel - minBaseLevel + 1)) +
    minBaseLevel;

  const minAreaBonus = AREA > 1 ? Math.floor((AREA - 1) * 10) : 0;
  const maxAreaBonus = AREA > 1 ? minAreaBonus + 10 : 0;
  const areaBonus =
    AREA > 1
      ? Math.floor(
          Math.pow(Math.random(), dynamicSkew) *
            (maxAreaBonus - minAreaBonus + 1)
        ) + minAreaBonus
      : 0;

  const minWorldBonus = WORLD > 1 ? Math.floor((WORLD - 1) * 100) : 0;
  const maxWorldBonus = WORLD > 1 ? minWorldBonus + 100 : 0;
  const worldBonus =
    WORLD > 1
      ? Math.floor(
          Math.pow(Math.random(), dynamicSkew) *
            (maxWorldBonus - minWorldBonus + 1)
        ) + minWorldBonus
      : 0;

  const difficultyModifier = Math.log1p(playerPower) / 10;

  // Calculate the final level and round it to the nearest whole number
  const level = Math.round(
    Math.min(
      BaseLevel + areaBonus + worldBonus + difficultyModifier,
      maxBaseLevel +
        (AREA > 1 ? maxAreaBonus : 0) +
        (WORLD > 1 ? maxWorldBonus : 0)
    )
  );

  // Track level occurrences
  if (!levelCounts[level]) {
    levelCounts[level] = 0;
  }
  levelCounts[level]++;

  return level;
}

// Generate 100 monster levels and track counts
for (let x = 0; x < 100; x++) {
  data.push(getMonsterLevel());
}

// Print the results
console.table(data);

// Print the counts of each level
console.log("Level Counts:");
for (const [level, count] of Object.entries(levelCounts)) {
  console.log(`Level ${level}: ${count}`);
}
