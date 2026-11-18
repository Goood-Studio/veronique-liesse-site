// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

// Deux cibles : la recette sur GitHub Pages (par défaut) et le domaine final.
// À la bascule DNS (après le 10/12 et la migration du paiement), on passe
// VL_PROD=1 dans les variables du dépôt et rien d'autre.
const prod = process.env.VL_PROD === '1';

// Les anciennes URLs WordPress sans équivalent sont servies en pages relais
// (noindex + redirection) et restent hors du sitemap.
const relais = Object.keys(
  JSON.parse(readFileSync(new URL('./src/data/redirections.json', import.meta.url), 'utf-8'))
);

export default defineConfig({
  site: prod ? 'https://www.veronique-liesse-nutrition.com' : 'https://goood-studio.github.io',
  base: prod ? '/' : '/veronique-liesse-site',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/merci-webinaire/') &&
        !relais.some((chemin) => page.endsWith(chemin)),
    }),
  ],
  build: { format: 'directory' },
});
