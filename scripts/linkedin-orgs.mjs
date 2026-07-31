// List the company pages this account administers and record the URN in .env.
//
//   node scripts/linkedin-orgs.mjs
//
// Separate from linkedin-auth.mjs because authorisation codes are single-use:
// once tokens are stored, the lookup has to be repeatable on its own.

import { main } from './run.mjs';
import { readEnv, writeEnv, getValidAccessToken, listAdministeredOrganizations } from './linkedin.mjs';

await main(async () => {
  const env = await readEnv();
  const accessToken = await getValidAccessToken(env);

  const orgs = await listAdministeredOrganizations(accessToken);
  if (!orgs.length) {
    throw new Error(
      'Geen bedrijfspagina gevonden. Is dit account beheerder van de pagina,\n' +
        'en is de scope rw_organization_admin goedgekeurd voor de app?'
    );
  }

  console.log("Bedrijfspagina's waarvan dit account beheerder is:");
  for (const org of orgs) {
    console.log(`  ${org.name} -> ${org.urn}${org.vanityName ? ` (/company/${org.vanityName})` : ''}`);
  }

  if (orgs.length === 1) {
    await writeEnv({ LINKEDIN_ORGANIZATION_URN: orgs[0].urn });
    console.log(`\nLINKEDIN_ORGANIZATION_URN vastgezet op ${orgs[0].name}.`);
  } else {
    console.log("\nMeerdere pagina's gevonden. Zet de juiste zelf in .env:");
    console.log('  LINKEDIN_ORGANIZATION_URN=urn:li:organization:...');
  }
});
