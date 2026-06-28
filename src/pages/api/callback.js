// GitHub OAuth callback for the CMS. Exchanges the code for an access token
// and hands it back to the CMS window using the Decap/Sveltia postMessage
// handshake.
export const prerender = false;

export async function GET({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  const page = (status, payload) => `<!doctype html><html><head><meta charset="utf-8"/></head>
<body><p>Signing you in…</p>
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(
      'authorization:github:${status}:' + ${JSON.stringify(JSON.stringify(payload))},
      e.origin
    );
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener && window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`;

  const html = (status, payload) =>
    new Response(page(status, payload), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  if (!code) return html('error', { message: 'No code returned from GitHub' });
  if (!clientId || !clientSecret) return html('error', { message: 'OAuth env vars not configured' });

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await res.json();
    if (data.access_token) {
      return html('success', { token: data.access_token, provider: 'github' });
    }
    return html('error', { message: data.error_description || 'Token exchange failed' });
  } catch (err) {
    return html('error', { message: String(err) });
  }
}
