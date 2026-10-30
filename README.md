# Läsfart

Ett snabbläsningsspel för barn, utan reklam och utan köp. Se `CLAUDE.md` för hur spelet fungerar och hur innehållet är uppbyggt.

## Kom igång

1. Skapa ett nytt repo på GitHub, till exempel `lasfart`, och lägg in filerna härifrån.
2. Skapa en API-token i Cloudflare med mallen ”Edit Cloudflare Workers”.
3. Lägg in två secrets i repot under Settings → Secrets and variables → Actions:
   - `CLOUDFLARE_API_TOKEN`: tokenen från steg 2
   - `CLOUDFLARE_ACCOUNT_ID`: konto-id:t från Cloudflares översiktssida
4. Pusha till `main`. Spelet publiceras då på `lasfart.<ditt-konto>.workers.dev`.
5. Öppna repot i Claude Code. Ändringar som pushas till `main` publiceras automatiskt.

## Redigera texter och ord

Ändra direkt i `public/texter.md` och `public/ord.md`. Formaten beskrivs överst i filerna. Kontrollera ändringarna med:

```
node scripts/check-content.js
```
