let data = [];

const MONSTER_EXP = 10;

for (let level = 1; level <= 100; level++) {
  let row = { Level: level };

  // Calculate BaseEXP based on level
  let BaseEXP = Math.round(10 + (MONSTER_EXP * level) ** 2 / 10);

  // Example combo multiplier based on player's combo count
  let comboMultiplier = 1 + Math.random() * 0.05; // Placeholder value; replace with actual player combo count
  let finalEXP = Math.round(BaseEXP * comboMultiplier);

  // Add the calculated value to the row
  row["EXP"] = finalEXP;

  // Add the row to the data array
  data.push(row);
}

// Print the table to the console
console.table(data);
