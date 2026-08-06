---
title: "Salesforce koppelen aan Exact Online: waar moet u op letten?"
description: "Een koppeling tussen Salesforce en Exact Online bespaart tijd en voorkomt fouten. We zetten de aandachtspunten op een rij."
pubDate: 2026-04-03
updatedDate: 2026-08-03
author: "Yatish Salihan"
category: "Integraties"
image: "/images/AdobeStock_-2-1024x683.jpg"
---

Een koppeling tussen Salesforce en Exact Online voorkomt dubbele invoer, verkleint de kans op fouten en geeft sales en finance realtime hetzelfde beeld van klanten, orders en facturen. Met een standaardconnector zoals de [Influx for Exact Online](/producten/exact-online) bent u doorgaans binnen 24 uur live, zonder developers. In dit artikel zetten we op een rij waar u op moet letten voordat u de koppeling inricht.

## Waarom zou u Salesforce koppelen aan Exact Online?

Sales en finance werken vaak in gescheiden systemen, met dubbele invoer, verouderde gegevens en frustratie aan beide kanten als gevolg. Een koppeling houdt klant- en factuurgegevens automatisch synchroon, zodat sales de betaalstatus ziet, finance de pipeline ziet en handmatig overtypen verleden tijd is.

De winst zit op meerdere vlakken tegelijk:

- **Geen dubbele invoer**: accounts, contacten en adressen blijven automatisch gelijk tussen beide systemen.
- **Realtime financieel inzicht**: sales ziet direct of een factuur is betaald, finance ziet welke omzet eraan komt.
- **Minder fouten**: geen overtypwerk betekent geen typefouten in bedragen, adressen of factuurregels.
- **Automatische facturatie**: offertes en facturen versturen direct vanuit Salesforce, zonder handwerk.
- **Voorraadinzicht**: ook webshop-voorraad kunt u synchroniseren met Exact Online.

Hoe goed die winst uitpakt, hangt af van de keuzes die u vooraf maakt. De belangrijkste behandelen we hieronder: welke data u synchroniseert, welk systeem leidend is, welke richting de synchronisatie op gaat en hoe u fouten en beveiliging regelt.

## Welke data kunt u synchroniseren tussen Salesforce en Exact Online?

Een volwaardige koppeling wisselt meer uit dan alleen klantgegevens. Met Influx for Exact Online synchroniseert u ruim tien objecttypen tussen Salesforce en Exact Online, in één of beide richtingen en per object instelbaar: van accounts en contacten tot facturen, betalingen en grootboekrekeningen.

Concreet gaat het om deze objecten:

- Accounts en contacten
- Adressen
- Artikelgroepen en producten
- Kostenplaatsen
- Orders
- Facturen en betalingen
- Grootboekrekeningen (GL)

U hoeft niet alles tegelijk te koppelen. Veel organisaties starten met accounts, contacten en facturen en breiden daarna uit naar betalingen en grootboek. Doordat de koppeling per object instelbaar is, bepaalt u zelf het tempo en houdt u de inrichting overzichtelijk.

## Hoe bepaalt u welk systeem leidend is?

Spreek per gegevenssoort af welk systeem de bron van waarheid is voordat u de koppeling activeert. Een gangbare verdeling: klant- en verkoopgegevens zijn leidend in Salesforce, financiële data zoals betaalstatussen en grootboek zijn leidend in Exact Online. Zonder die afspraak overschrijven systemen elkaars data en ontstaat wantrouwen.

Deze afspraak klinkt administratief, maar is in de praktijk het fundament van elke succesvolle koppeling. Wanneer beide systemen hetzelfde veld mogen aanpassen zonder duidelijke regels, weet niemand meer welke waarde klopt. Dat ondermijnt precies het vertrouwen dat de koppeling moest opbouwen.

De mapping legt u vervolgens vast in een visuele drag-and-drop interface: u sleept velden en objecten naar elkaar en ziet helder welke relaties er liggen. Daar is geen technische kennis voor nodig, en aanpassen kan altijd. Voor complexere wensen kunnen de consultants van [development en integratie](/diensten/development) bijspringen.

## Kiest u eenrichtings- of tweerichtingssynchronisatie?

Kies per object bewust tussen eenrichtings- en tweerichtingssynchronisatie. Eenrichtingsverkeer is eenvoudig en voorspelbaar: data stroomt van het leidende systeem naar het andere. Tweerichtingssynchronisatie is krachtiger, omdat beide teams in hun eigen systeem kunnen werken, maar vraagt om heldere conflictregels en een doordachte mapping.

Daarnaast bepaalt u per object het synchronisatiemoment. De connector ondersteunt zowel realtime als geplande synchronisatie: kritieke data zoals facturen wilt u wellicht direct bijwerken, terwijl een nachtelijk schema volstaat voor artikelgroepen of kostenplaatsen. Zo houdt u grip op performance en op de momenten waarop data wordt bijgewerkt.

Een praktische vuistregel: begin met eenrichtingsverkeer waar het kan en zet tweerichtingssynchronisatie alleen in waar beide teams het object daadwerkelijk bewerken. Elke richting die u toevoegt, voegt ook regels toe die u moet beheren.

## Hoe veilig is de koppeling en wat gebeurt er bij fouten?

Een goede koppeling gebruikt versleutelde API-verbindingen met OAuth-authenticatie, slaat geen wachtwoorden op en laat u volledige controle houden over de autorisaties. Even belangrijk is foutafhandeling: elke synchronisatie hoort te worden gelogd, met duidelijke foutmeldingen zodat u snel ziet wat er misging en gericht kunt bijsturen.

Beveiliging is bij een koppeling tussen uw CRM en uw boekhouding geen bijzaak. U wisselt immers klantgegevens en financiële data uit. Bij Influx for Exact Online autoriseert u beide systemen via OAuth, reist alle data via beveiligde API-koppelingen en kunt u autorisaties op elk moment intrekken.

Vraag bij elke oplossing die u overweegt door op het foutscenario. Wat gebeurt er als Exact Online tijdelijk onbereikbaar is? Wordt een mislukte synchronisatie automatisch gemeld? Kunt u in een logboek precies terugzien welke records wel en niet zijn verwerkt? Volledige logging met foutrapportage maakt het verschil tussen een koppeling die u vertrouwt en een koppeling die u dagelijks moet controleren.

## Wat kost een koppeling tussen Salesforce en Exact Online?

Met een standaardconnector betaalt u een vast maandbedrag in plaats van een maatwerktraject. Influx for Exact Online is er vanaf 73 euro per maand voor de Standaard Connector; de Premium Connector van 95 euro per maand voegt daar AI-guided onboarding met Claude aan toe, inclusief automatische veldmapping.

De Standaard Connector omvat onbeperkt objecten koppelen, realtime en geplande synchronisatie, de visuele mapping-interface, logging met foutrapportage en OAuth-beveiliging. Dat dekt voor de meeste organisaties de volledige behoefte.

De Premium-variant maakt de implementatie vrijwel hands-off. U geeft aan welke objecten u wilt uitwisselen, waarna Claude uw persoonlijke object- en veldschema analyseert, dit naast de API-documentatie van Exact Online legt en de juiste mapping automatisch aanmaakt in Salesforce. Vergelijk beide varianten met wat een maatwerkintegratie aan development- en beheerkosten met zich meebrengt, en de rekensom is meestal snel gemaakt.

## Hoe snel bent u live en wat heeft u nodig?

Met Influx for Exact Online bent u doorgaans binnen 24 uur live. U heeft daarvoor drie dingen nodig: een actief Salesforce-account, een actief Exact Online-account en API-toegang tot beide systemen. Developers zijn niet nodig; u configureert de koppeling zelf of samen met ons.

De inrichting verloopt in vier stappen:

1. **Verbinden**: autoriseer Salesforce en Exact Online via OAuth.
2. **Mappen**: sleep velden en objecten naar elkaar in de visuele mapping-interface.
3. **Plannen**: stel realtime of geplande synchronisatie in, per object en per richting.
4. **Monitoren**: volg elke synchronisatie via het logboek en ontvang directe foutmeldingen.

Wilt u begeleiding bij de bredere inrichting van Salesforce zelf, bijvoorbeeld omdat de koppeling onderdeel is van een groter traject? Bekijk dan onze aanpak voor [implementatie en onboarding](/diensten/implementatie).

## Waar moet u op letten bij complexere situaties?

Ook met meerdere administraties, e-facturatie of automatische facturatie hoeft u niet naar maatwerk. De connector ondersteunt meerdere Exact-administraties vanuit één Salesforce-omgeving, Peppol-conforme e-facturatie volgens de EN 16931-standaard en combinaties met aanvullende modules zoals automatische facturatie vanuit Salesforce.

Enkele voorbeelden uit de praktijk. [MarketResponse](/cases/marketresponse) koppelde vier aparte Exact-administraties, verspreid over verschillende entiteiten, aan één centrale Salesforce-omgeving. En wie factureert aan Belgische B2B-klanten, kan met de Peppol-ondersteuning direct e-facturen versturen volgens de EN 16931-standaard, zoals [Zyfer](/cases/zyfer) doet voor verkoop- en inkoopfacturen.

Veel klanten combineren de koppeling bovendien met de [Billing Module](/producten/billing-module) om facturen automatisch vanuit Salesforce te genereren en door te zetten naar de boekhouding. Zo groeit de koppeling mee met uw administratie in plaats van andersom.

## Klaar om Salesforce en Exact Online te koppelen?

Wilt u weten hoe de koppeling er voor uw administratie uitziet, of heeft u een specifieke situatie die u wilt voorleggen? [Neem contact op](/contact) voor een demo of een vrijblijvend gesprek.
