# Montrose hemsida på mobilen

`app.montrose.io` visar bara sin vanliga datorlayout när skärmen är minst
1024 pixlar bred, vilket ungefär motsvarar en datorskärm. Är skärmen smalare
visas i stället en skärm som säger att du ska ladda ner appen.

Det här projektet lurar webbplatsen att tro att skärmen är 1024 pixlar bred. Då
ritas datorlayouten ut och skalas ner så att den får plats, ungefär som
webbläsarens "Begär datorwebbplats". Sidans egna filer och texter ändras inte,
så det brukar fortsätta fungera när Montrose uppdaterar appen.

## Firefox på Android

Firefox kan köra små tillägg, och det är det enklaste sättet på Android.

1. Öppna Firefox, tryck på menyn och välj **Tillägg**.
2. Sök efter **ViolentMonkey** (eller TamperMonkey) och installera det.
3. Öppna [montrose-small-screen.user.js](https://raw.githubusercontent.com/thomasa88/montrose-userscripts/refs/heads/main/montrose-small-screen.user.js) och
   välj **Installera**.

Skriptet startar av sig självt när du går in på https://app.montrose.io .

## Chrome på Android

Chrome kan inte köra tillägg, så där får du använda ett bokmärke i stället.

Skapa först ett bokmärke på valfri sida och redigera det sedan:

1. Töm fältet för adressen.
2. Skriv `javascript:` för hand, eftersom Chrome tar bort det om du klistrar in
   hela koden.
3. Klistra in resten av koden från avsnittet **Bokmärkeskoden** efter
   `javascript:`.
4. Spara och öppna bokmärket igen för att kontrollera att det fortfarande börjar
   med `javascript:`.

Så här använder du det: öppna https://app.montrose.io, tryck på adressfältet
och skriv bokmärkets namn. Välj det bland förslagen. Att gå via menyn för bokmärken fungerar inte.

## Safari på iOS

På iPhone och iPad finns två sätt.

**Userscripts** från App Store är ett tillägg till Safari som kan köra
skriptet. Installera appen, slå på tillägget under **Inställningar → Safari →
Tillägg** och öppna sedan
[montrose-small-screen.user.js](./montrose-small-screen.user.js).

**Bokmärke** fungerar också: skapa ett bokmärke, redigera adressen och klistra in
koden från avsnittet **Bokmärkeskoden**. Öppna sedan Montrose och välj bokmärket.

## Bokmärkeskoden

Se [montrose-small-screen.bookmarklet.txt](./montrose-small-screen.bookmarklet.txt).

## Bra att veta

- Sidan ser utzoomad ut, precis som i datorläge. Nyp för att zooma.
- Om webbläsaren inte byter layout när sidan redan är öppen döljs
  blockeringsskärmen som reserv, så innehållet går att nå ändå.

## Licens

CC-BY-SA 4.0
