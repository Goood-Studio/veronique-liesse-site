import type { APIRoute } from 'astro';
import { FORMATIONS_PUBLIEES } from '../data/cms';
import { SITE, WEBINAIRE, OFFRE } from '../data/site';
export const GET: APIRoute = ({ site }) => {
  const r = (site?.toString() ?? '').replace(/\/$/, '') + import.meta.env.BASE_URL.replace(/\/$/, '');
  const lignes = [
    `# ${SITE.nom}`, '',
    `> ${SITE.nomComplet}, ${SITE.metier.toLowerCase()} à Monaco. Formations en ligne en nutrition et micronutrition pour professionnel·les de santé (plus de ${SITE.inscriptions} inscriptions), ateliers QVCT en entreprise, consultations, livres.`, '',
    '## Formation ménopause',
    `- [Formation ménopause](${r}/formation-menopause/) : ${OFFRE.prix} € TTC, ouverture le ${WEBINAIRE.date}.`,
    `- [Webinaire gratuit](${r}/webinaire-soja-menopause/) : ${WEBINAIRE.titre}, le ${WEBINAIRE.date}.`, '',
    '## Formations en ligne',
    ...FORMATIONS_PUBLIEES.map((f) => `- [${f.titre}](${r}/formations/${f.slug}/) : ${f.resume}${f.prix != null ? ` (${f.prix} €)` : ''}`), '',
    '## À propos',
    `- [Véronique Liesse](${r}/veronique-liesse/)`, `- [Entreprises](${r}/qvt-en-entreprise-renforcer-qualite-de-vie/)`, `- [Consultations](${r}/consultation-nutritionniste/)`, `- [Contact](${r}/contact/)`,
  ];
  return new Response(lignes.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
