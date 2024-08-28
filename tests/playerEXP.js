let data = [];
for (let level = 1; level <= 100; level++) {
  let row = { Level: level };
  let total = 0;
  let previousRebirthValue = 0;

  for (let rebirths = 0; rebirths <= 9; rebirths++) {
    // Calculate BaseEXP based on level
    let BaseEXP = Math.round((2500 + (10 * level) ** 2) / 10);

    // Calculate need using a non-linear rebirth multiplier
    let need =
      rebirths !== 0
        ? Math.round(BaseEXP * Math.pow(1.2, rebirths) + BaseEXP)
        : BaseEXP;

    // Accumulate the values
    need += previousRebirthValue;
    previousRebirthValue = need;

    // Add the calculated value to the row
    row[`Rebirth ${rebirths}`] = need;

    // Accumulate the total
    total += need;
  }

  // Add the total to the row
  row["Total"] = total;

  // Add the row to the data array
  data.push(row);
}

// Print the table to the console
console.table(data);
