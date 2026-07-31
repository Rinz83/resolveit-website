# Analytics-events

De site stuurt zijn events rechtstreeks met `gtag` naar GA4 (`G-N45J4VLRC2`).
Er is geen Tag Manager meer. Alles staat in het scriptblok onderaan
`src/layouts/Layout.astro`, dus op elke pagina.

## Overgenomen uit Tag Manager

Deze namen komen uit de oude container `GTM-M7CSJFKX`. Ze zijn bewust
onveranderd gebleven: bestaande GA4-rapporten, doelgroepen en Google
Ads-conversies zijn op deze exacte strings gebaseerd, dus hernoemen zou de
historische lijn stilletjes breken. De parameter `click_url` is dezelfde die de
oude tags meestuurden.

| Event | Vuurt op |
| --- | --- |
| `L_Telefoon_klik` | klik op een `tel:`-link |
| `L_Mail_klik` | klik op een `mailto:`-link |
| `L_Socials_klik` | klik op een link naar linkedin.com of wa.me |
| `L_App_Exchange_klik` | klik op een link naar appexchange.salesforce.com |
| `L_Klik_naar_contact` | klik op een link met "contact" in de href, behalve tel:/mailto: |
| `L_Sollicitatie_start` | klik op een vacature-CTA met `data-track-apply` |
| `BL_Calendly_klik` | klik op een Calendly-link |
| `BL_Calendly_page_visit` | pagina met "afspraak" in het pad of de anchor |
| `BL_Leadinfo_klik` | bezoeker opent de Leadinfo-chat |
| `L_Kwalitatieve_websitebezoeker_30_seconden` | 30 seconden op dezelfde pagina, eenmalig |

Eén verschil met de oude opzet: de container had losse events voor de
demo-popups (`L_Sharepoint_demo_klik`, `L_Billing_module_demo_klik`,
`L_Exact_module_demo_klik`, `L_Sharepoint_proefperiode_aanvraag_klik`). Die
popups bestaan niet meer. Formulierinzendingen worden nu afgevangen op de
`thank-you-*`-pagina's, die `generate_lead` sturen met een eigen bron. Ook
`L_Contactformulier` en `L_Sollicitatie_afgerond` zijn daarin opgegaan, omdat de
formulieren nu Pardot-iframes zijn en een submit binnen een iframe niet van
buitenaf te meten is.

## Eigen events van de nieuwe site

| Event | Vuurt op |
| --- | --- |
| `generate_lead` | bedankpagina na een formulierinzending, met `form_source` |
| `form_start` | bezoeker klikt voor het eerst in een Pardot-formulier |
| `begin_appointment` | klik op een Calendly-link (GA4-standaardnaam, naast `BL_Calendly_klik`) |
| `schedule_appointment` | afspraak daadwerkelijk geboekt in de Calendly-overlay |

## Cookie-consent

`gtag` staat op Consent Mode v2 met alle opslag op `denied` tot de bezoeker de
banner accepteert. De keuze staat in `localStorage` onder `riy-consent`.

Twee dingen hangen daaraan:

- **Leadinfo** laadt niet voordat er toestemming is, want het plaatst cookies en
  identificeert bezoekers. Bij accepteren laadt het direct, zonder herladen.
- **De gclid** wordt alleen onthouden na toestemming (zie hieronder).

## Google Ads gclid in de formulieren

De Pardot-formulieren hebben een `gclid`-veld dat Pardot vult uit de query
string van het formulier zelf. Het iframe is cross-origin, dus de waarde moet in
de `src` staan; er valt niets in te scripten.

Een bezoeker landt meestal op een advertentiepagina en converteert op een
andere, dus de gclid wordt onthouden in `localStorage` onder `riy-gclid`. Dat
opslaan gebeurt alleen na toestemming, net zoals `gtag` `ad_storage` tot dat
moment tegenhoudt. Een gclid in de URL van de pagina die iemand op dat moment
bekijkt wordt altijd doorgegeven, met of zonder toestemming: dat is de eigen
navigatie van de bezoeker en het overleeft de pagina niet.

Het werkt op elk formulier met de class `pardot-form`, inclusief de formulieren
in modals, die later in de pagina verschijnen. De `src` wordt alleen herschreven
als de waarde nog niet klopt, zodat een formulier nooit onnodig herlaadt.

## Google Ads-conversies

Account `AW-16749801902`. De conversielabels komen uit dezelfde container. Ze
hangen aan de GA4-events hierboven in plaats van hun eigen triggers te hebben,
zodat een trigger maar op één plek onderhouden hoeft te worden. De
conversion linker die de container apart aanzette doet `gtag` zelf.

| Label | Hangt aan |
| --- | --- |
| `YM6TCKCW_owaEK7j9rI-` | `L_Kwalitatieve_websitebezoeker_30_seconden` |
| `VtNjCPOD3McbEK7j9rI-` | `L_Telefoon_klik` |
| `iDvICIPL5N0bEK7j9rI-` | `L_Mail_klik` |
| `85w-CKzujt0bEK7j9rI-` | `BL_Leadinfo_klik` |
| `oQ45CM3e8d0bEK7j9rI-` | `schedule_appointment` |
| `E58OCOXY2t0bEK7j9rI-` | bezoek aan `/contact` of `/en/contact` |
| `c-P2CMWbg40aEK7j9rI-` | bedankpagina met bron `billing` |
| `nBW4CMubg40aEK7j9rI-` | bedankpagina met bron `sharepoint` |
| `u3UUCKOW_owaEK7j9rI-` | openen van het demo-formulier op de Billing-pagina |

Vier labels uit de container hebben geen plek meer, omdat het element dat ze
mat niet meer bestaat. Ze staan hier zodat duidelijk is dat ze bewust
ontbreken en niet vergeten zijn:

- `cLIoCKmW_owaEK7j9rI-` en `QZA3CKaW_owaEK7j9rI-`: klikken op de SharePoint
  demo- en proefperiode-popup. Die popups bestaan niet meer.
- `_CqCCPu_nKccEK7j9rI-`: klik op de Exact demo-popup, idem.
- `fIMbCMibg40aEK7j9rI-`: inzending van het formulier "Proefperiode Sharepoint".
  Demo en proefperiode landen nu op dezelfde bedankpagina, dus die twee zijn niet
  meer van elkaar te onderscheiden. Alleen het demo-label vuurt.

Wil je die vier terug, dan is daar eerst een onderscheidend element of een eigen
bedankpagina voor nodig.

## Overige trackers

Ook uit de container overgenomen, en allemaal pas ná toestemming geladen:

| Tracker | Id |
| --- | --- |
| Leadinfo | `LI-68482C03CF266` |
| LinkedIn Insight Tag | partner `8312826` |
| Hotjar | site `6724552` |
| Bullseye | `136e696c-eb2e-436f-a9f1-8989e5ecdc3b` |

Hotjar was in de container al aan toestemming gekoppeld. De andere drie vuurden
daar op elke pageview, maar ze plaatsen cookies en identificeren bezoekers, dus
ze volgen nu dezelfde regel.

## Niet overgenomen

Drie custom HTML-tags uit de container zijn vervallen:

- Een jQuery-listener op `gform_confirmation_loaded`, voor Gravity Forms. Dat is
  WordPress; die formulieren bestaan hier niet.
- Een postMessage-listener die inzendingen in de oude popup-iframes opving. Die
  rol is overgenomen door de `thank-you-*`-pagina's.
- Een Calendly postMessage-listener. Die zit nu native in de layout en stuurt
  `schedule_appointment`.
