# Läsfart

Ett snabbläsningsspel för barn, utan reklam och utan köp. Se `CLAUDE.md` för hur spelet fungerar och hur innehållet är uppbyggt.

## Spela

https://dlundin-private.github.io/lashastighet/

Spelet publiceras med GitHub Pages från grenen `main`. Lokalt: kör `npx serve .` i roten och öppna adressen som visas.

## Redigera texter och ord

Ändra direkt i `texter.md` och `ord.md`. Formaten beskrivs överst i filerna. Kontrollera ändringarna med:

```
node scripts/check-content.js
```
