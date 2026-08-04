# Partner-leadsoverzicht

`https://www.resolveit.nl/partner/leads` toont de externe marketingpartner alle
leads uit Salesforce (inclusief geconverteerde), met Pardot-engagement (score,
grade, laatste activiteit), omschrijving en Account Engagement-notities, adres,
click-ids (gclid/msclkid) en de gekoppelde activiteiten (taken en afspraken).
Leads zijn uitklapbaar voor de details, de lijst is doorzoekbaar en sorteerbaar
(standaard nieuw naar oud) en er is een CSV-export. De pagina is afgeschermd
met een toegangscode en wordt dagelijks ververst.

Let op: `msclkid` blijft leeg tot er in Salesforce een custom veld voor bestaat
(bijv. `MSCLKID__c` op Lead) dat door het Pardot-formulierveld gevuld wordt;
daarna de veldnaam invullen in `scripts/partner-leads-transform.mjs` en de
SOQL-query van de geplande taak. De site geeft msclkid al wel door aan de
Pardot-iframes (zie docs/analytics-events.md).

## Waarom versleuteld

Deze repo is **publiek**, dus leadgegevens (namen, e-mailadressen) mogen nooit
leesbaar gecommit worden. De data staat daarom als AES-256-GCM-versleuteld
bestand in de repo (`src/data/partner-leads.enc.json`); alleen de serverless
API-route kan het ontsleutelen, met een sleutel die uitsluitend in `.env`
(lokaal, gitignored) en in de Vercel-omgevingsvariabelen leeft.

## Onderdelen

- `src/pages/partner/leads.astro`: de pagina. Statisch geprerenderde schil met
  een code-invoer; de data komt pas na een geldige code uit de API. `noindex`,
  staat niet in de sitemap en bewust ook niet in robots.txt (een
  disallow-regel zou de URL juist verraden).
- `src/pages/api/partner-leads.js`: serverless route. Controleert de code
  (timing-safe, met vertraging bij een foute poging) en ontsleutelt de data.
  Stuurt `X-Robots-Tag: noindex` en `Cache-Control: no-store`.
- `scripts/partner-leads-transform.mjs`: zet een ruw SOQL-resultaat om naar
  `secrets/partner-leads.json` (gitignored).
- `scripts/partner-leads-encrypt.mjs`: versleutelt dat bestand naar
  `src/data/partner-leads.enc.json` (wel gecommit).
- Geplande taak `resolveit-partner-leads-refresh` (dagelijks 07:00, lokaal):
  Salesforce-query via MCP → transform → encrypt → commit van alléén het
  enc-bestand op main → push → Vercel-deploy. Slaat de run over als Salesforce
  niet bereikbaar is.

## Omgevingsvariabelen

| Variabele | Waar | Doel |
| --- | --- | --- |
| `PARTNER_LEADS_KEY` | `.env` én Vercel | 64-tekens hex AES-sleutel; moet op beide plekken identiek zijn |
| `PARTNER_LEADS_CODE` | `.env` én Vercel | de toegangscode voor de pagina |

Code wijzigen: pas de waarde aan in Vercel (en `.env`) en redeploy; er hoeft
niets in de code te veranderen. Sleutel roteren: nieuwe hex-sleutel op beide
plekken zetten, `node scripts/partner-leads-encrypt.mjs` draaien en het
enc-bestand committen.

## Beveiligingsafwegingen

- De codecontrole en ontsleuteling gebeuren volledig server-side; zonder
  geldige code verlaat de data de server nooit.
- De toegangscode is kort en de pagina is publiek bereikbaar. Dit is een
  bewuste keuze van Rinse voor laagdrempelige toegang; een langere code is
  veiliger en kost alleen een env-var-wijziging.
- Leadgegevens zijn persoonsgegevens. Deel de code alleen met de
  marketingpartner en leg de verwerking zo nodig vast in de
  verwerkersovereenkomst met die partner.
