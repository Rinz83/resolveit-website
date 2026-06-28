---
title: "Looking up a Peppol identification number from within Salesforce"
description: "Without the correct Peppol ID, your e-invoice won't arrive. Discover how to look up Peppol IDs directly from within Salesforce and make your data e-invoicing-proof."
pubDate: 2025-12-19
author: "Imre Hamelink"
category: "E-invoicing"
---

To send e-invoices via Peppol, you need your customer's Peppol identification number. With Datasolver, you look it up directly from within Salesforce — no switching between systems.

## What is a Peppol ID?

Peppol is a network and framework for securely and in a standardised way exchanging electronic documents, such as invoices. A Peppol ID consists of a type code (for example a Chamber of Commerce number or VAT number) plus the identification number itself. Without the correct Peppol ID, your invoice risks rejection or non-delivery across the network.

## Manual lookups are error-prone

Traditionally, staff have to switch between systems, retype data and verify company matches — at scale, that's time-consuming and error-prone.

## Directly from within Salesforce

By connecting Salesforce to the Peppol Directory API, you look up the ID without leaving the CRM environment. Existing fields — company name, VAT number, Chamber of Commerce number, address, country — populate the search automatically. Found Peppol IDs are written back to dedicated fields on the account record.

## Process automation

With Peppol data stored, invoicing systems can include the ID automatically, and workflows can flag missing identifiers.

## Be ready in time

Belgium already mandates e-invoicing, France follows in September 2026, and across the EU it will become the norm towards 2030. Those who set up fields, reports and automatic lookups now will avoid rejected invoices and last-minute scrambling later. [Discover Datasolver](/en/producten/kvk-integratie).
