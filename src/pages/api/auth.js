// Starts the GitHub OAuth flow for the CMS (/admin).
// Redirects the user to GitHub's authorize screen.
export const prerender = false;

export function GET({ request, redirect }) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('Missing OAUTH_GITHUB_CLIENT_ID env var', { status: 500 });
  }
  const origin = new URL(request.url).origin;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/callback`,
    scope: 'repo,user',
    allow_signup: 'false',
  });
  return redirect(`https://github.com/login/oauth/authorize?${params.toString()}`, 302);
}
