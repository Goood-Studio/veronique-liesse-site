import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const racine = (site?.toString() ?? '').replace(/\/$/, '') + base;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${racine}/sitemap-index.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
