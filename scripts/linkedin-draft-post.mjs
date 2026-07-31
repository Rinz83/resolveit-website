// Create a DRAFT LinkedIn post on the Resolve IT company page for a published
// blog article.
//
//   node scripts/linkedin-draft-post.mjs <slug> [--commentary "eigen tekst"]
//   node scripts/linkedin-draft-post.mjs <slug> --dry-run
//
// Deliberately a draft, never a live post: the page admin reviews and publishes
// it from LinkedIn itself. Nothing reaches the timeline unattended.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { main } from './run.mjs';
import { readEnv, requireEnv, getValidAccessToken, apiPost } from './linkedin.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://resolveit.nl';

/** Minimal frontmatter reader: enough for the fields our blog posts use. */
async function readArticle(articleSlug) {
  const path = join(ROOT, 'src', 'content', 'blog', `${articleSlug}.md`);
  let raw;
  try {
    raw = await readFile(path, 'utf8');
  } catch {
    throw new Error(`Artikel niet gevonden: src/content/blog/${articleSlug}.md`);
  }

  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`Geen frontmatter gevonden in ${articleSlug}.md`);

  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
  }
  return fm;
}

await main(async () => {
  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith('--'));
  const dryRun = args.includes('--dry-run');
  const commentaryIndex = args.indexOf('--commentary');
  const customCommentary = commentaryIndex !== -1 ? args[commentaryIndex + 1] : null;

  if (!slug) {
    throw new Error(
      'Gebruik: node scripts/linkedin-draft-post.mjs <slug> [--commentary "..."] [--dry-run]'
    );
  }

  const article = await readArticle(slug);
  if (!article.title) throw new Error(`Artikel ${slug} heeft geen title in de frontmatter.`);

  // A draft for an unpublished article would link to a 404, so refuse it.
  if (article.draft === 'true') {
    throw new Error(
      `Artikel ${slug} staat nog op draft: true. Publiceer het artikel eerst,\n` +
        'anders verwijst de LinkedIn-post naar een pagina die nog niet bestaat.'
    );
  }

  const url = `${SITE}/blog/${slug}`;
  const commentary =
    customCommentary ||
    [article.title, '', article.description, '', `Lees het volledige artikel: ${url}`]
      .filter((part) => part !== undefined)
      .join('\n');

  const env = await readEnv();
  // A dry run only prints the payload, so it should work before authorisation too.
  if (!dryRun) requireEnv(env, ['LINKEDIN_ORGANIZATION_URN']);

  const payload = {
    author: env.LINKEDIN_ORGANIZATION_URN || 'urn:li:organization:<nog-niet-ingesteld>',
    commentary,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    content: {
      article: {
        source: url,
        title: article.title,
        description: article.description || '',
      },
    },
    lifecycleState: 'DRAFT',
    isReshareDisabledByAuthor: false,
  };

  if (dryRun) {
    console.log('--dry-run: dit zou naar LinkedIn gestuurd worden:\n');
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const accessToken = await getValidAccessToken(env);
  const { id } = await apiPost('posts', accessToken, payload);

  console.log(`Concept aangemaakt op de bedrijfspagina: ${id || '(geen URN in respons)'}`);
  console.log('Nakijken en publiceren kan via LinkedIn > bedrijfspagina > Concepten.');
});
