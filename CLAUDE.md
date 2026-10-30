# Läsfart

Ett webbspel som tränar barn att läsa snabbare, med bibehållen förståelse. Hobbyprojekt. Spelet är på svenska och riktar sig till barn mellan 6 och 13 år.

## Principer som inte ska ändras utan att fråga

- Ingen reklam, inga köp och ingen pay-to-win. Belöningarna (stjärnor, djurstegen, dagar i rad) får bara bygga på hur barnet faktiskt läser.
- Inga konton och ingen server. Framsteg sparas i webbläsarens localStorage under nyckeln `lasfart-v1`.
- Ingen byggprocess. Det som ligger i `public/` är exakt det som publiceras.
- Förståelsen styr farten. I Läsbanan får nästa text högre fart bara när barnet svarar rätt på frågorna.

## Struktur

```
public/
  index.html   spelet: HTML, CSS och JS i en fil
  content.js   parsrar för texter.md och ord.md (delas med kontrollskriptet)
  texter.md    alla texter och frågor till Läsbanan
  ord.md       orden till Blixtordet och deras snarlika ord
scripts/
  check-content.js   kontrollerar innehållsfilerna, körs före varje deploy
wrangler.jsonc       Cloudflare Workers, publicerar public/ som statiska filer
.github/workflows/deploy.yml   deploy vid push till main
```

## Spellägen

**Läsbanan.** En text visas ett ord i taget (två ord i taget på nivå Stor) i en vald fart i ord per minut. Därefter kommer tre flervalsfrågor. Med alla rätt höjs farten med 12 % till nästa gång, med ett fel står den still och med fler fel sänks den med 10 %. Rekord räknas när barnet har högst ett fel. Texterna väljs slumpvis bland dem spelaren inte har läst, och lästa texter sparas per nivå med sin rubrik i `seen`. En text räknas som läst när den har visats färdigt. När alla är lästa börjar banken om, men den senast lästa texten kommer aldrig två gånger i rad.

**Blixtordet.** Ett ord visas mycket kort mellan ett fixeringskors och en mask. Barnet väljer sedan rätt ord bland fyra. Visningstiden blir 15 % kortare efter rätt svar och 25 % längre efter fel. Felalternativen är i första hand snarlika riktiga ord från `ord.md`. Ungefär var tredje gång byts ett av dem mot en automatiskt genererad felstavning av rätt ord.

**Djurstegen.** Rekordet i ord per minut avgör vilket djur barnet är, från snigel (0) via sköldpadda (40), kanin (70), räv (110), häst (160) och gepard (220) till pilgrimsfalk (300).

## Innehållsfilerna

Formaten beskrivs överst i varje fil. Viktigast är att i `texter.md` kommer det rätta svaret alltid först bland alternativen, och att rubrikerna måste vara unika inom en nivå eftersom lästa texter sparas med rubrik.

Krav på nytt innehåll:
- Korrekt svensk stavning och grammatik. Läs igenom allt efter stavfel innan du committar, eftersom spelet lär barn läsa.
- Fakta ska stämma. Hellre ”ungefär” och ”omkring” än exakta siffror som är osäkra.
- Ungefär hälften fakta och hälften berättelser, med något som gör texten intressant eller lite spännande.
- Ungefärlig längd: Liten 30–45 ord, Mellan 60–90 ord, Stor 90–130 ord.
- Frågorna ska gå att svara på utifrån texten, och felalternativen ska vara rimliga men tydligt fel.
- I `ord.md` ska de snarlika orden vara riktiga ord som barn känner igen. Inga svordomar eller olämpliga ord.
- Svenska citattecken (” ”) och tankstreck (–) i text som barnen läser.

Kör `node scripts/check-content.js` efter varje ändring i innehållet.

## Köra lokalt

```
npx wrangler dev
```

eller, utan Cloudflare:

```
cd public && python3 -m http.server 8000
```

Sidan måste köras via en server, eftersom den hämtar `texter.md` och `ord.md` med fetch. Att öppna `index.html` direkt som fil fungerar inte.

## Deploy

Varje push till `main` kör kontrollskriptet och publicerar sedan på Cloudflare Workers via GitHub Actions. Det kräver två secrets i GitHub-repot: `CLOUDFLARE_API_TOKEN` och `CLOUDFLARE_ACCOUNT_ID`.
