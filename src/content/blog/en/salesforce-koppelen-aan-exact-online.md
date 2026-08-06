---
title: "Linking Salesforce to Exact Online: what should you watch out for?"
description: "A connection between Salesforce and Exact Online saves time and prevents errors. We list the points to keep in mind."
pubDate: 2026-04-03
updatedDate: 2026-08-03
author: "Yatish Salihan"
category: "Integrations"
image: "/images/AdobeStock_-2-1024x683.jpg"
---

A connection between Salesforce and Exact Online prevents duplicate data entry, reduces the risk of errors and gives sales and finance the same real-time view of customers, orders and invoices. With a standard connector such as the [Influx for Exact Online](/en/producten/exact-online), you are typically live within 24 hours, without developers. In this article we list the points to consider before you set up the connection.

## Why would you connect Salesforce to Exact Online?

Sales and finance often work in separate systems, resulting in duplicate data entry, outdated information and frustration on both sides. A connection keeps customer and invoice data automatically in sync, so sales sees the payment status, finance sees the pipeline and manual retyping is a thing of the past.

The gains come on several fronts at once:

- **No duplicate data entry**: accounts, contacts and addresses stay automatically aligned between both systems.
- **Real-time financial insight**: sales sees immediately whether an invoice has been paid, finance sees which revenue is coming.
- **Fewer errors**: no retyping means no typing mistakes in amounts, addresses or invoice lines.
- **Automated invoicing**: send quotes and invoices directly from Salesforce, without manual work.
- **Stock visibility**: you can also synchronise webshop stock with Exact Online.

How well those gains materialise depends on the choices you make beforehand. We cover the most important ones below: which data you synchronise, which system is leading, which direction the synchronisation flows and how you arrange error handling and security.

## Which data can you synchronise between Salesforce and Exact Online?

A fully fledged connection exchanges more than customer data alone. With Influx for Exact Online you synchronise more than ten object types between Salesforce and Exact Online, in one or both directions and configurable per object: from accounts and contacts to invoices, payments and general ledger accounts.

In concrete terms, these objects are covered:

- Accounts and contacts
- Addresses
- Item groups and products
- Cost centres
- Orders
- Invoices and payments
- General ledger accounts (GL)

You do not have to connect everything at once. Many organisations start with accounts, contacts and invoices and later expand to payments and the general ledger. Because the connection is configurable per object, you set the pace yourself and keep the setup manageable.

## How do you determine which system is leading?

Agree per data type which system is the source of truth before you activate the connection. A common division: customer and sales data are leading in Salesforce, financial data such as payment statuses and the general ledger are leading in Exact Online. Without that agreement, systems overwrite each other's data and distrust sets in.

This agreement sounds administrative, but in practice it is the foundation of every successful connection. When both systems are allowed to modify the same field without clear rules, nobody knows any longer which value is correct. That undermines exactly the trust the connection was meant to build.

You then record the mapping in a visual drag-and-drop interface: you drag fields and objects onto each other and see clearly which relationships exist. No technical knowledge is required, and adjustments are always possible. For more complex requirements, the consultants of [development and integration](/en/diensten/development) can step in.

## Do you choose one-way or two-way synchronisation?

Make a deliberate choice per object between one-way and two-way synchronisation. One-way traffic is simple and predictable: data flows from the leading system to the other. Two-way synchronisation is more powerful, because both teams can work in their own system, but it calls for clear conflict rules and a well-considered mapping.

You also determine the synchronisation moment per object. The connector supports both real-time and scheduled synchronisation: you may want critical data such as invoices updated immediately, while a nightly schedule is sufficient for item groups or cost centres. That way you keep a grip on performance and on the moments when data is updated.

A practical rule of thumb: start with one-way traffic where you can and only deploy two-way synchronisation where both teams actually edit the object. Every direction you add also adds rules you have to manage.

## How secure is the connection and what happens when something fails?

A good connection uses encrypted API connections with OAuth authentication, stores no passwords and leaves you in full control of the authorisations. Error handling is just as important: every synchronisation should be logged, with clear error messages so you can quickly see what went wrong and take targeted action.

Security is no side issue when connecting your CRM to your accounting system. After all, you are exchanging customer data and financial data. With Influx for Exact Online you authorise both systems via OAuth, all data travels over secured API connections and you can revoke authorisations at any time.

For every solution you consider, probe the failure scenario. What happens if Exact Online is temporarily unreachable? Is a failed synchronisation reported automatically? Can you see precisely in a log which records were and were not processed? Full logging with error reporting makes the difference between a connection you trust and a connection you have to check every day.

## What does a connection between Salesforce and Exact Online cost?

With a standard connector you pay a fixed monthly fee instead of funding a custom development project. Influx for Exact Online starts at 73 euros per month for the Standard Connector; the Premium Connector at 95 euros per month adds AI-guided onboarding with Claude, including automatic field mapping.

The Standard Connector includes unlimited object connections, real-time and scheduled synchronisation, the visual mapping interface, logging with error reporting and OAuth security. For most organisations, that covers the full requirement.

The Premium variant makes the implementation virtually hands-off. You indicate which objects you want to exchange, after which Claude analyses your personal object and field schema, compares it with the Exact Online API documentation and automatically creates the correct mapping in Salesforce. Compare both variants with the development and maintenance costs of a custom integration, and the sums usually add up quickly.

## How quickly are you live and what do you need?

With Influx for Exact Online you are typically live within 24 hours. You need three things: an active Salesforce account, an active Exact Online account and API access to both systems. Developers are not required; you configure the connection yourself or together with us.

The setup runs in four steps:

1. **Connect**: authorise Salesforce and Exact Online via OAuth.
2. **Map**: drag fields and objects onto each other in the visual mapping interface.
3. **Schedule**: set up real-time or scheduled synchronisation, per object and per direction.
4. **Monitor**: follow every synchronisation via the log and receive immediate error notifications.

Would you like guidance on the broader setup of Salesforce itself, for example because the connection is part of a larger project? Then take a look at our approach to [implementation and onboarding](/en/diensten/implementatie).

## What should you watch out for in more complex situations?

Even with multiple administrations, e-invoicing or automated invoicing, you do not need custom development. The connector supports multiple Exact administrations from a single Salesforce environment, Peppol-compliant e-invoicing according to the EN 16931 standard and combinations with additional modules such as automated invoicing from Salesforce.

A few examples from practice. [MarketResponse](/en/cases/marketresponse) connected four separate Exact administrations, spread across different entities, to one central Salesforce environment. And anyone invoicing Belgian B2B customers can use the Peppol support to send e-invoices directly according to the EN 16931 standard, as [Zyfer](/en/cases/zyfer) does for its sales and purchase invoices.

Many customers also combine the connection with the [Billing Module](/en/producten/billing-module) to generate invoices automatically from Salesforce and pass them on to the accounts. That way the connection grows with your administration instead of the other way round.

## Ready to connect Salesforce and Exact Online?

Would you like to know what the connection would look like for your administration, or do you have a specific situation you would like to discuss? [Get in touch](/en/contact) for a demo or a no-obligation conversation.
