// One-time LinkedIn authorisation.
//
//   node scripts/linkedin-auth.mjs            -> print the authorisation URL
//   node scripts/linkedin-auth.mjs <code>     -> exchange the code for tokens
//
// The authorisation code is single-use and expires within minutes, so run the
// second command straight after copying it from /oauth/linkedin/callback.

import { main } from './run.mjs';
import {
  readEnv,
  requireEnv,
  exchangeCode,
  persistTokens,
  writeEnv,
  listAdministeredOrganizations,
} from './linkedin.mjs';

const SCOPES = ['r_organization_social', 'w_organization_social', 'rw_organization_admin'];

await main(async () => {
  const env = await readEnv();
  requireEnv(env, ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET', 'LINKEDIN_REDIRECT_URI']);

  const code = process.argv[2];

  if (!code) {
    const url = new URL('https://www.linkedin.com/oauth/v2/authorization');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', env.LINKEDIN_CLIENT_ID);
    url.searchParams.set('redirect_uri', env.LINKEDIN_REDIRECT_URI);
    url.searchParams.set('state', 'riy-linkedin');
    url.searchParams.set('scope', SCOPES.join(' '));

    console.log('\nOpen deze URL in een browser waarin je als beheerder van de');
    console.log('Resolve IT bedrijfspagina bent ingelogd:\n');
    console.log(url.toString());
    console.log('\nJe komt daarna uit op de callbackpagina met een code. Voer uit:');
    console.log('  node scripts/linkedin-auth.mjs <code>\n');
    return;
  }

  console.log('Code inwisselen voor tokens...');
  const tokens = await exchangeCode({
    code,
    clientId: env.LINKEDIN_CLIENT_ID,
    clientSecret: env.LINKEDIN_CLIENT_SECRET,
    redirectUri: env.LINKEDIN_REDIRECT_URI,
  });
  await persistTokens(tokens);

  const days = Math.round(Number(tokens.expires_in) / 86400);
  console.log(`Access token opgeslagen in .env (geldig ${days} dagen).`);
  console.log(
    tokens.refresh_token
      ? 'Refresh token opgeslagen: verlengen gaat vanaf nu automatisch.'
      : 'Let op: LinkedIn gaf geen refresh token. Autoriseren moet dan handmatig herhaald worden.'
  );

  console.log("\nBedrijfspagina's waarvan dit account beheerder is:");
  const orgs = await listAdministeredOrganizations(tokens.access_token);

  if (!orgs.length) {
    throw new Error(
      'Geen bedrijfspagina gevonden. Is dit account beheerder van de pagina,\n' +
        'en is de scope rw_organization_admin goedgekeurd voor de app?'
    );
  }

  for (const org of orgs) {
    console.log(`  ${org.name} -> ${org.urn}${org.vanityName ? ` (/company/${org.vanityName})` : ''}`);
  }

  // With a single page there is no ambiguity, so wire it up without asking.
  if (orgs.length === 1) {
    await writeEnv({ LINKEDIN_ORGANIZATION_URN: orgs[0].urn });
    console.log(`\nLINKEDIN_ORGANIZATION_URN vastgezet op ${orgs[0].name}.`);
  } else {
    console.log("\nMeerdere pagina's gevonden. Zet de juiste zelf in .env:");
    console.log('  LINKEDIN_ORGANIZATION_URN=urn:li:organization:...');
  }
});
