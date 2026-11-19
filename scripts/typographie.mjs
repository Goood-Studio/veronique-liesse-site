// Typographie française après le build : espace insécable avant : ; ! ? »
// et après «, entre un nombre et son unité (€, %, h, min). Évite qu'un
// deux-points, un « € » ou un « ? » se retrouve seul en début de ligne sur
// mobile. Ne touche que le texte visible (jamais les balises, scripts, styles).
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const NBSP = ' ';
const NNBSP = ' ';
const fichiers = (d) => readdirSync(d).flatMap((n) => {
  const c = join(d, n);
  return statSync(c).isDirectory() ? fichiers(c) : n.endsWith('.html') ? [c] : [];
});

const corriger = (texte) => texte
  .replace(/ ([:;!?»])/g, NNBSP + '$1')
  .replace(/« /g, '«' + NNBSP)
  .replace(/(\d) (€|%|h\b|min\b|heures\b|minutes\b|ans\b)/g, '$1' + NBSP + '$2')
  .replace(/(\d) (\d{3})\b/g, '$1' + NNBSP + '$2');

let total = 0;
for (const f of fichiers('dist')) {
  const html = readFileSync(f, 'utf-8');
  // On découpe en balises / texte, en sautant le contenu des <script> et <style>.
  const morceaux = html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)/);
  const sortie = morceaux.map((m) => (m.startsWith('<') ? m : corriger(m))).join('');
  if (sortie !== html) { writeFileSync(f, sortie); total++; }
}
console.log(`✓ Typographie : ${total} pages corrigées.`);
