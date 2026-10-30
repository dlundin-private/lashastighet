// Kontrollerar texter.md och ord.md innan deploy: node scripts/check-content.js
const fs = require("fs");
const path = require("path");
const { parseTexter, parseOrd } = require("../public/content.js");

const dir = path.join(__dirname, "..", "public");
const LEVELS = ["liten", "mellan", "stor"];
const errors = [];

const texts = parseTexter(fs.readFileSync(path.join(dir, "texter.md"), "utf8"));
for (const lv of LEVELS) {
  const list = texts[lv] || [];
  if (list.length < 5) errors.push(`texter.md: nivå ${lv} har bara ${list.length} texter`);
  const seen = new Set();
  for (const t of list) {
    if (seen.has(t.t)) errors.push(`texter.md: rubriken ”${t.t}” finns två gånger på nivå ${lv}`);
    seen.add(t.t);
    if (t.q.length !== 3) errors.push(`texter.md: ”${t.t}” har ${t.q.length} frågor (ska vara 3)`);
    for (const q of t.q) {
      if (q.length !== 5) errors.push(`texter.md: ”${t.t}”, frågan ”${q[0]}” har ${q.length - 1} alternativ (ska vara 4)`);
      if (new Set(q.slice(1)).size !== q.length - 1) errors.push(`texter.md: ”${t.t}”, frågan ”${q[0]}” har dubbla alternativ`);
    }
  }
}

const ord = parseOrd(fs.readFileSync(path.join(dir, "ord.md"), "utf8"));
for (const lv of LEVELS) {
  const list = ord.words[lv] || [];
  if (list.length < 10) errors.push(`ord.md: nivå ${lv} har bara ${list.length} ord (minst 10 behövs per runda)`);
  for (const w of list) {
    const alts = ord.lookalike[w] || [];
    if (new Set(alts).size < 3) errors.push(`ord.md: ”${w}” behöver minst 3 olika snarlika ord`);
  }
}

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`OK: ${LEVELS.map(l => `${l} ${texts[l].length} texter/${ord.words[l].length} ord`).join(", ")}`);
