// Synchronise le CMS Google Sheet vers cms/*.csv.
// Chaque onglet du Sheet porte le nom d'un fichier (formations, reglages,
// faq, temoignages, livres, presse). Le Sheet doit être partagé en
// « Tous les utilisateurs disposant du lien : lecteur ».
// Sans SHEET_ID, rien ne change : les CSV commités font foi.
import { writeFileSync } from 'node:fs';

const id = process.env.SHEET_ID;
if (!id) {
  console.log('SHEET_ID absent : on garde les CSV du dépôt.');
  process.exit(0);
}

const onglets = ['formations', 'reglages', 'faq', 'temoignages', 'livres', 'presse'];
let erreurs = 0;
for (const onglet of onglets) {
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(onglet)}`;
  const reponse = await fetch(url);
  const texte = await reponse.text();
  // Google renvoie une page HTML quand le Sheet n'est pas partagé.
  if (!reponse.ok || texte.trimStart().startsWith('<')) {
    console.error(`Onglet « ${onglet} » illisible (${reponse.status}) : partage du Sheet à vérifier.`);
    erreurs++;
    continue;
  }
  writeFileSync(`cms/${onglet}.csv`, texte);
  console.log(`cms/${onglet}.csv mis à jour.`);
}
// Un onglet illisible ne casse pas la publication : le CSV précédent reste.
if (erreurs) console.error(`${erreurs} onglet(s) non synchronisé(s).`);
