# LinkedIn-integratie

Doel: bij elk gepubliceerd blogartikel automatisch een **concept**-post klaarzetten
op de Resolve IT bedrijfspagina. De post gaat nooit ongezien de deur uit; een
beheerder kijkt hem na en publiceert hem vanuit LinkedIn zelf.

Dit vult de contentautomatisering aan die in
[content-automation.md](./content-automation.md) staat beschreven.

## Benodigdheden

- Een LinkedIn-app met toegang tot de **Community Management API** (goedgekeurd).
- Een account dat **beheerder** is van de bedrijfspagina.
- De volgende redirect-URL geregistreerd in de LinkedIn-app, onder
  Auth > Authorized redirect URLs:

  ```
  https://resolveit.nl/oauth/linkedin/callback
  ```

  Deze moet exact overeenkomen met `LINKEDIN_REDIRECT_URI` in `.env`, inclusief
  protocol en zonder afsluitende slash.

## Eenmalig autoriseren

Client ID en secret staan in `.env` (gitignored, staat nooit in de repo).

1. Vraag de autorisatie-URL op:

   ```bash
   node scripts/linkedin-auth.mjs
   ```

2. Open die URL in een browser waarin je als paginabeheerder bent ingelogd en
   geef toestemming. Je komt uit op `/oauth/linkedin/callback`, die niets anders
   doet dan de code op het scherm zetten.

3. Wissel de code in. Doe dit direct: de code is eenmalig en verloopt binnen
   enkele minuten.

   ```bash
   node scripts/linkedin-auth.mjs <code>
   ```

Het script slaat het access token, het refresh token en de vervaldatum op in
`.env`, en zet `LINKEDIN_ORGANIZATION_URN` op de bedrijfspagina zodra er precies
één gevonden wordt. Zijn er meerdere, dan print het de keuzes en zet je de juiste
zelf in `.env`.

## Concept-post aanmaken

```bash
node scripts/linkedin-draft-post.mjs <slug>
```

De slug is de bestandsnaam zonder extensie uit `src/content/blog/`. Het script
haalt titel en omschrijving uit de frontmatter en bouwt daar de tekst mee op,
met een link naar `https://resolveit.nl/blog/<slug>`.

Handig tijdens het opzetten:

```bash
node scripts/linkedin-draft-post.mjs <slug> --dry-run
```

Dat print de payload zonder iets naar LinkedIn te sturen.

Een eigen tekst meegeven in plaats van de gegenereerde:

```bash
node scripts/linkedin-draft-post.mjs <slug> --commentary "Eigen tekst met link erin"
```

## Bewuste beperkingen

- **Alleen concepten.** `lifecycleState` staat vast op `DRAFT`. Publiceren is
  een menselijke handeling.
- **Alleen gepubliceerde artikelen.** Staat het artikel nog op `draft: true`,
  dan stopt het script. Anders zou de post naar een 404 linken.
- **Geen automatische herhaling.** Er wordt niets opnieuw gepost of bijgewerkt;
  elke aanroep maakt precies één concept.

## Tokens verlopen

Het access token is ongeveer 60 dagen geldig en wordt automatisch verlengd met
het refresh token, een dag voor de vervaldatum. Gaf LinkedIn geen refresh token
uit, of is ook dat verlopen, dan meldt het script dat en doorloop je de
autorisatiestappen hierboven opnieuw.
