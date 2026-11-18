// Lecture du CMS : les CSV de cms/ (copies des onglets du Google Sheet).
// Toute la donnée éditable du site passe par ici.
import { readFileSync } from 'node:fs';

function lireCsv(nom: string): Record<string, string>[] {
  const texte = readFileSync(new URL(`../../cms/${nom}.csv`, import.meta.url), 'utf-8').replace(/^﻿/, '');
  const lignes: string[][] = [];
  let champ = '';
  let ligne: string[] = [];
  let guillemets = false;
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (guillemets) {
      if (c === '"' && texte[i + 1] === '"') { champ += '"'; i++; }
      else if (c === '"') guillemets = false;
      else champ += c;
    } else if (c === '"') guillemets = true;
    else if (c === ',') { ligne.push(champ); champ = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texte[i + 1] === '\n') i++;
      ligne.push(champ); champ = '';
      if (ligne.some((v) => v.trim() !== '')) lignes.push(ligne);
      ligne = [];
    } else champ += c;
  }
  ligne.push(champ);
  if (ligne.some((v) => v.trim() !== '')) lignes.push(ligne);
  const [entetes, ...donnees] = lignes;
  return donnees.map((l) =>
    // Espace insécable avant : ; ! ? (typographie française, évite les orphelins).
    Object.fromEntries(entetes.map((e, i) => [e.trim(), (l[i] ?? '').trim().replace(/ ([:;!?»])/g, '\u00a0$1')]))
  );
}

const oui = (v: string) => /^(oui|true|1|x)$/i.test(v);
const parOrdre = (a: Record<string, string>, b: Record<string, string>) =>
  Number(a.ordre || 0) - Number(b.ordre || 0);

export interface Formation {
  slug: string;
  publie: boolean;
  titre: string;
  categorie: string;
  resume: string;
  prix: number | null;
  eleves: number | null;
  lecons: number | null;
  duree: string;
  image: string;
  lienAchat: string;
  texte: string;
  chapitres: string[];
}

export const FORMATIONS: Formation[] = lireCsv('formations')
  .sort(parOrdre)
  .map((f) => ({
    slug: f.slug,
    publie: oui(f.publie),
    titre: f.titre,
    categorie: f.categorie,
    resume: f.resume,
    prix: f.prix_eur ? Number(f.prix_eur) : null,
    eleves: f.eleves ? Number(f.eleves) : null,
    lecons: f.lecons ? Number(f.lecons) : null,
    duree: f.duree ?? '',
    image: f.image,
    lienAchat: f.lien_achat,
    texte: f.texte,
    chapitres: f.chapitres ? f.chapitres.split('|').map((c) => c.trim()).filter(Boolean) : [],
  }));

export const FORMATIONS_PUBLIEES = FORMATIONS.filter((f) => f.publie);

const reglages = Object.fromEntries(lireCsv('reglages').map((r) => [r.cle, r.valeur]));
export const R = (cle: string) => reglages[cle] ?? '';

export const FAQ = (page: string) =>
  lireCsv('faq').filter((q) => q.page === page && q.question && q.reponse);

export const TEMOIGNAGES = lireCsv('temoignages')
  .filter((t) => oui(t.publie) && t.texte && !t.texte.includes('[À FOURNIR'))
  .sort(parOrdre);

export const LIVRES = lireCsv('livres').sort(parOrdre);
export const PRESSE = lireCsv('presse').sort(parOrdre);

// Total des inscriptions aux formations en ligne (compteurs publics des
// pages de formation), arrondi à la centaine inférieure.
export const TOTAL_INSCRIPTIONS = Math.floor(
  FORMATIONS.reduce((s, f) => s + (f.eleves ?? 0), 0) / 100
) * 100;
