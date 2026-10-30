/*
  Läsfart – parsrar för innehållsfilerna.
  Används av spelet (index.html) och av scripts/check-content.js, så formatet tolkas likadant på båda ställena.
*/

// texter.md → { liten: [{ t, body, q: [[fråga, rätt, fel, fel, fel], …] }], mellan: […], stor: […] }
function parseTexter(md) {
  const out = {}; let lv = null, cur = null;
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith(">")) continue;
    if (line.startsWith("## ")) { cur = { t: line.slice(3).trim(), body: "", q: [] }; if (lv) lv.push(cur); }
    else if (line.startsWith("# ")) { const key = line.slice(2).split(/\s/)[0].toLowerCase(); lv = out[key] = []; cur = null; }
    else if (line.startsWith("- ") && cur) { const q = line.slice(2).split("|").map(s => s.trim()).filter(Boolean); if (q.length >= 3) cur.q.push(q); }
    else if (cur) cur.body += (cur.body ? " " : "") + line;
  }
  for (const k of Object.keys(out)) out[k] = out[k].filter(t => t.body && t.q.length);
  return out;
}

// ord.md → { words: { liten: [ord, …], … }, lookalike: { ord: [snarlikt, …], … } }
function parseOrd(md) {
  const words = {}, lookalike = {}; let lv = null;
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith(">")) continue;
    if (line.startsWith("# ")) { lv = line.slice(2).split(/\s/)[0].toLowerCase(); words[lv] = []; continue; }
    const m = line.match(/^([^:]+):(.*)$/);
    if (!m || !lv) continue;
    const w = m[1].trim();
    words[lv].push(w);
    lookalike[w] = m[2].split(",").map(s => s.trim()).filter(s => s && s !== w);
  }
  return { words, lookalike };
}

if (typeof module !== "undefined") module.exports = { parseTexter, parseOrd };
