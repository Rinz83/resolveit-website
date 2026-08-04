# Analytics-events

Sinds augustus 2026 draait de meting weer via Google Tag Manager, container
`GTM-M7CSJFKX`, beheerd door de marketingpartner. Het containersnippet staat
bovenaan de `<head>` in `src/layouts/Layout.astro`, met de bijbehorende
noscript-iframe direct na `<body>`.

De site laadt zelf géén GA4, Google Ads of andere trackers meer: alle tags
(GA4 `G-N45J4VLRC2`, Ads `AW-16749801902`, Leadinfo, LinkedIn Insight, Hotjar,
Bullseye) leven in de container. Wat de site nog wél doet is dataLayer-events
pushen voor gebeurtenissen die de container niet zelf kan waarnemen.

## Consent Mode

De Consent Mode v2 defaults staan in de layout vóór het containersnippet: alle
opslag op `denied` tot de bezoeker de cookiebanner accepteert. De keuze staat in
`localStorage` onder `riy-consent` en wordt bij een volgend bezoek opnieuw
toegepast voordat de container laadt.

Let op voor de containerbeheerder: Consent Mode houdt alleen Google-tags
automatisch tegen. Custom HTML-tags (Leadinfo, LinkedIn, Hotjar, Bullseye)
hebben in GTM een eigen consent-instelling nodig ("additional consent checks"
of een trigger op de consent-update), anders vuren ze ook zonder toestemming.

## dataLayer-events die de site pusht

Deze events kan de container niet uit kliks of pageviews afleiden; de site
pusht ze zelf. In GTM zijn hiervoor custom-event-triggers nodig.

| Event | Vuurt op | Parameters |
| --- | --- | --- |
| `generate_lead` | bedankpagina na een formulierinzending (`ThankYou.astro` en de whitepaper-leespagina) | `method`, `form_source` |
| `form_start` | bezoeker klikt voor het eerst in een Pardot-formulier (postMessage uit het iframe) | `method` |
| `begin_appointment` | klik op een Calendly-link (intentie tot boeken) | `method` |
| `schedule_appointment` | afspraak daadwerkelijk geboekt in de Calendly-overlay (postMessage) | `method` |
| `view_contact` | bezoek aan `/contact` of `/en/contact` | |
| `billing_demo_open` | openen van het demo-formulier op de Billing-pagina (verving de oude `#demoBillingPopup`-trigger) | `click_url` |
| `L_Sollicitatie_start` | klik op een vacature-CTA met `data-track-apply` (verving de oude `.apply-button`-trigger) | `click_url` |

## Wat de container weer zelf triggert

Klik-gebaseerde events en timers zijn weer de verantwoordelijkheid van de
container, zoals vóór de herbouw: `tel:`- en `mailto:`-kliks, social- en
AppExchange-kliks, kliks naar contact, Calendly-linkkliks, de
30-secondentimer, Leadinfo-chatinteracties (Leadinfo pusht zelf naar de
dataLayer) en de Google Ads-conversies met hun labels. De conversion linker
zit ook weer in de container.

Aandachtspunt: sommige oude containertriggers verwijzen naar elementen van de
oude WordPress-site die niet meer bestaan (`#demoBillingPopup`,
`.apply-button`, de Gravity Forms-listener, de oude popup-iframes). Daarvoor
zijn de custom events hierboven in de plaats gekomen.

## Google Ads gclid in de formulieren

De Pardot-formulieren hebben een `gclid`-veld dat Pardot vult uit de query
string van het formulier zelf. Het iframe is cross-origin, dus de waarde moet in
de `src` staan.

Een bezoeker landt meestal op een advertentiepagina en converteert op een
andere, dus de gclid wordt onthouden in `localStorage` onder `riy-gclid`. Dat
opslaan gebeurt alleen na toestemming. Een gclid in de URL van de pagina die
iemand op dat moment bekijkt wordt altijd doorgegeven, met of zonder
toestemming: dat is de eigen navigatie van de bezoeker en het overleeft de
pagina niet.

Het werkt op elk formulier met de class `pardot-form`, inclusief formulieren in
modals. De `src` wordt alleen herschreven als de waarde nog niet klopt, zodat
een formulier nooit onnodig herlaadt.

## Tweetalige bedankpagina's

De Pardot-formulieren verwijzen naar één vaste bedankpagina, ongeacht de taal
van de pagina waar de bezoeker het formulier invulde. De layout schrijft daarom
op elke gewone pageview de paginataal naar `sessionStorage` (`riy-lang`); de
bedankpagina's lezen die marker en wisselen client-side naar Engels als de
bezoeker van een `/en/`-pagina kwam. De redirect komt uit het
go.resolveit.nl-iframe, dus de referrer is hiervoor onbruikbaar.

## Account Engagement (Pardot)

Account `981612`, campagne `28209`. Deze tracker zat nooit in Tag Manager (hij
kwam uit het oude WordPress-thema) en staat los in de layout.

Twee afwijkingen van de oude opzet, beide bewust:

- **Trackerdomein.** `pd.js` laadt van `go.resolveit.nl` in plaats van
  `pi.pardot.com`: dezelfde tracker, maar de bezoekerscookie is daarmee
  first-party, zodat Safari en Firefox hem niet weggooien.
- **Buiten de cookiebanner.** Deze tracker staat níet achter toestemming en
  meet dus elke bezoeker. Dat is een expliciete keuze van Rinse, geen
  vergissing. First-party bepaalt alleen of browsers de cookie bewaren, niet of
  toestemming vereist is: onder de AVG geldt die plicht ook voor first-party
  cookies.

Formulierinzendingen staan hier los van: die gaan via de Pardot-formulieren
zelf, niet via de paginatracker.
