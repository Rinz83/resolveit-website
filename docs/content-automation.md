# SEO-contentautomatisering

Dit document beschrijft het proces dat de wekelijkse contentgeneratie volgt. Het wordt gebruikt door een geplande Claude Code sessie ("Routine") die dit bestand als handleiding leest.

## Bron van waarheid

`content-calendar.json` in de root van deze repo. Elk item heeft een `status`:

- `pending` — nog niet opgepakt
- `drafted` — concept-artikel(en) aangemaakt, wacht op review/PR-merge
- `published` — live (PR gemerged, `draft: false` gezet)

## Stappen per run

1. Open `content-calendar.json` en zoek het eerste item met `status: "pending"`.
2. Maak een nieuwe git branch: `content/<slug>`.
3. Schrijf **twee** bestanden:
   - `src/content/blog/<slug>.md` (Nederlands, root)
   - `src/content/blog/en/<slug>.md` (Engels, `/en/` sectie)
4. Frontmatter voor beide bestanden, conform `src/content/config.ts`:
   ```yaml
   title: "..."
   description: "..."
   pubDate: <datum van de week uit het kalender-item, bv. de maandag van die ISO-week>
   author: "Rick Koevoets"
   category: "<category uit het kalender-item>"
   draft: true
   ```
5. Schrijf het artikel zelf volgens deze regels (zie ook `_readme`/`styleRules` in `content-calendar.json`):
   - 450-650 woorden, Nederlandse versie leidend, Engelse versie is een vertaling in dezelfde toon (geen letterlijke machinevertaling, natuurlijk Engels).
   - Structuur: korte intro (het probleem/de zoekintentie), 2-4 `##` kopjes, waar relevant een bullet-lijst, een slotalinea met call-to-action.
   - **Vermijd em-dashes (—).** Gebruik een punt, komma, dubbele punt of haakjes in plaats daarvan.
   - Schrijf in de bestaande Resolve IT-toon: zakelijk, direct, "u/uw" in het Nederlands. Geen overdreven marketingtaal, geen opsommingen van vage buzzwords.
   - Neem minimaal één interne link op naar `productHref` uit het kalender-item (Engelse versie: zelfde pad met `/en/` ervoor).
   - Sluit af met een link naar `/contact` (NL) of `/en/contact` (EN).
   - Gebruik het `keyword` uit het kalender-item natuurlijk in titel en/of eerste alinea, niet geforceerd herhaald.
   - Volg de stijl van bestaande artikelen in `src/content/blog/` als referentie (toon, opbouw, linkgebruik).
6. Zet in `content-calendar.json` de `status` van dit item op `"drafted"`.
7. Commit alle wijzigingen (calendar + 2 markdown-bestanden) op de nieuwe branch.
8. Push de branch en open een pull request met `gh pr create`, titel: `Concept blog: <titleNl>`. PR-omschrijving: korte samenvatting, het gekoppelde keyword/funnel/segment, en een opmerking dat het artikel als `draft: true` staat en pas na goedkeuring gepubliceerd wordt.
9. Rapporteer aan het einde kort: welk item is opgepakt, branch-naam en PR-link.

## Publiceren

Publiceren gebeurt **niet automatisch**. Zodra Rinse de PR beoordeelt en goedkeurt:

- Bij merge: zet in beide bestanden `draft: false`.
- Zet de `status` van het kalender-item op `"published"`.

Dit gebeurt handmatig of in een losse review-stap; de wekelijkse Routine opent alleen de PR, merget nooit vanzelf.

## Wat deze automatisering niet doet

- Geen automatische publicatie zonder menselijke controle.
- Geen social media cross-posting (zie backlog: LinkedIn-koppeling vereist een aparte, nog niet opgezette integratie).
