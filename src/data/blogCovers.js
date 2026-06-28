// Generated cover styles per blog category — a topical photo behind an on-brand
// gradient overlay + icon, so covers feel fresh and relevant without icon-only looks.
const COVERS = {
  'Billing Platform':   { grad: 'linear-gradient(135deg,rgba(29,35,39,.82),rgba(58,90,46,.72))', icon: '💶', img: '/images/cases/case-3.jpg' },
  'Exact Online':       { grad: 'linear-gradient(135deg,rgba(15,46,42,.82),rgba(46,77,68,.72))', icon: '📒', img: '/images/AdobeStock_564034397_v2-1024x684.jpg' },
  'Datasolver':         { grad: 'linear-gradient(135deg,rgba(36,26,51,.82),rgba(58,43,82,.72))', icon: '🏢', img: '/images/cases/case-1.jpg' },
  'SharePoint':         { grad: 'linear-gradient(135deg,rgba(22,38,58,.82),rgba(39,72,103,.72))', icon: '📁', img: '/images/AdobeStock_-2-1024x683.jpg' },
  'Integraties':        { grad: 'linear-gradient(135deg,rgba(19,48,42,.82),rgba(58,90,46,.72))', icon: '🔗', img: '/images/AdobeStock_-4-1024x683.jpg' },
  'Implementatie':      { grad: 'linear-gradient(135deg,rgba(29,35,39,.82),rgba(74,122,50,.7))', icon: '🚀', img: '/images/AdobeStock_-1-1024x683.jpg' },
  'Consultancy':        { grad: 'linear-gradient(135deg,rgba(36,26,51,.82),rgba(87,55,120,.7))', icon: '🔍', img: '/images/AdobeStock_-6-1024x683.jpg' },
  'AI & Innovatie':     { grad: 'linear-gradient(135deg,rgba(42,24,56,.8),rgba(108,68,148,.7))', icon: '🤖', img: '/images/cases/case-6.jpg' },
  'CRM Strategie':      { grad: 'linear-gradient(135deg,rgba(29,35,39,.82),rgba(90,158,70,.7))', icon: '📈', img: '/images/AdobeStock_320848339_v2-1024x683.jpg' },
  'E-facturatie':       { grad: 'linear-gradient(135deg,rgba(15,46,42,.82),rgba(58,90,46,.72))', icon: '🧾', img: '/images/cases/case-2.jpg' },
};
const DEFAULT = { grad: 'linear-gradient(135deg,rgba(29,35,39,.82),rgba(58,90,46,.72))', icon: '✦', img: '/images/AdobeStock_-3-1024x683.jpg' };

export function cover(category) {
  return COVERS[category] || DEFAULT;
}

// Pool of our own licensed photos, rotated deterministically per post so
// consecutive articles differ and the set feels varied.
const PHOTO_POOL = [
  '/images/cases/case-1.jpg', '/images/cases/case-2.jpg', '/images/cases/case-3.jpg',
  '/images/cases/case-4.jpg', '/images/cases/case-5.jpg', '/images/cases/case-6.jpg',
  '/images/AdobeStock_-1-1024x683.jpg', '/images/AdobeStock_-2-1024x683.jpg',
  '/images/AdobeStock_-4-1024x683.jpg', '/images/AdobeStock_-5-1024x683.jpg',
  '/images/AdobeStock_-6-1024x683.jpg', '/images/AdobeStock_320848339_v2-1024x683.jpg',
  '/images/AdobeStock_564034397_v2-1024x684.jpg', '/images/AdobeStock_443620610-768x768.jpg',
];

export function photo(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return PHOTO_POOL[h % PHOTO_POOL.length];
}
