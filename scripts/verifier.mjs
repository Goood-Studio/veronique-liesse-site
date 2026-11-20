// Le détecteur : le build échoue si une page sort sans son SEO, sans appel
// vers le webinaire ou la formation, ou avec un tiret cadratin visible (règle
// d'écriture du studio). En production (VL_PROD=1), il bloque aussi tout
// lien d'achat qui pointerait encore vers l'ancien WordPress (boucle).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const prod = process.env.VL_PROD === '1';
const erreurs = [];

const pagesHtml = (d) => readdirSync(d).flatMap((n) => {
  const c = join(d, n);
  return statSync(c).isDirectory() ? pagesHtml(c) : n.endsWith('.html') ? [c] : [];
});
const pages = pagesHtml(DIST);
if (pages.length < 25) erreurs.push(`Seulement ${pages.length} pages HTML : build suspect.`);

let reelles = 0;
for (const chemin of pages) {
  const html = readFileSync(chemin, 'utf-8');
  const nom = chemin.replace(DIST + '/', '');
  if (html.includes('http-equiv="refresh"')) continue;
  reelles++;
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ');
  if (/>[^<]*undefined[^<]*</.test(visible)) erreurs.push(`${nom} : « undefined » visible.`);
  if (/>[^<]*NaN[^<]*</.test(visible)) erreurs.push(`${nom} : « NaN » visible.`);
  const tirets = visible.replace(/<[^>]+>/g, ' ').match(/.{0,30}[—–].{0,30}/g);
  if (tirets) erreurs.push(`${nom} : tiret cadratin ou demi-cadratin visible (« ${tirets[0].trim()} »).`);
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) erreurs.push(`${nom} : il faut exactement un <h1>.`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/);
  if (!desc || desc[1].length < 50) erreurs.push(`${nom} : meta description absente ou trop courte.`);
  if (desc && desc[1].length > 175) erreurs.push(`${nom} : meta description trop longue (${desc[1].length}).`);
  if (!html.includes('rel="canonical"')) erreurs.push(`${nom} : canonique absent.`);
  if (!html.includes('application/ld+json')) erreurs.push(`${nom} : aucun JSON-LD.`);
  if (!/webinaire-soja-menopause\/|formation-menopause\//.test(html)) erreurs.push(`${nom} : aucun lien vers le webinaire ou la formation ménopause.`);
  if (prod && /veronique-liesse-nutrition\.com\/formations\/[a-z]/.test(html))
    erreurs.push(`${nom} : lien d'achat vers l'ancien WordPress (boucle après la bascule). Mettre les liens LearnyBox dans le Sheet.`);
}

if (erreurs.length) {
  console.error(`\n✗ Détecteur : ${erreurs.length} problème(s)\n` + erreurs.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ Détecteur : ${reelles} pages vérifiées (${pages.length - reelles} relais).`);
