// Les constantes du site. Ce qui doit pouvoir changer sans développeur·se
// vit dans le Google Sheet (onglet « reglages ») ; ce fichier en dérive les
// valeurs prêtes à l'emploi.
import { R, TOTAL_INSCRIPTIONS } from './cms';

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

const dateWebinaire = new Date(R('webinaire_date') + 'T12:00:00');
const heure = R('webinaire_heure');

export const SITE = {
  nom: 'Véronique Liesse Nutrition',
  nomComplet: 'Véronique Liesse',
  metier: 'Diététicienne-nutritionniste et micronutritionniste',
  instagram: R('instagram'),
  linkedin: R('linkedin'),
  facebook: R('facebook'),
  youtube: R('youtube'),
  contactEndpoint: R('contact_endpoint'),
  contactEmail: R('contact_email'),
  inscriptions: TOTAL_INSCRIPTIONS,
  consultations: {
    lieu: R('consultations_lieu'),
    adresse: R('consultations_adresse'),
    tel: R('consultations_tel'),
    telLien: 'tel:' + R('consultations_tel').replace(/[^\d+]/g, ''),
  },
};

// « attente » : tout mène au webinaire ; « vente » : la page de vente est
// ouverte ; « fermee » : l'offre de lancement est terminée, prix plein.
export const PHASE = (R('phase') || 'attente') as 'attente' | 'vente' | 'fermee';

export const WEBINAIRE = {
  titre: R('webinaire_titre'),
  sousTitre: R('webinaire_sous_titre'),
  replayH: Number(R('webinaire_replay_h') || 48),
  date: R('webinaire_date'),
  heure,
  dureeMin: Number(R('webinaire_duree_min') || 50),
  dateLongue: `${JOURS[dateWebinaire.getDay()]} ${dateWebinaire.getDate()} ${MOIS[dateWebinaire.getMonth()]}`,
  dateCourte: `${String(dateWebinaire.getDate()).padStart(2, '0')}/${String(dateWebinaire.getMonth() + 1).padStart(2, '0')}`,
  heureTexte: heure ? heure.replace(':', 'h').replace(/h00$/, 'h') : '',
  endpoint: R('inscription_endpoint'),
  urlRepli: R('inscription_url'),
};

export const OFFRE = {
  prix: Number(R('formation_prix_ttc') || 249),
  prixLancement: Number(R('formation_prix_lancement_ttc') || 175),
  code: R('formation_code_lancement'),
  fin: R('formation_fin_offre'),
  lienAchat: R('formation_lien_achat'),
};

// Préfixe toutes les URLs internes avec la base de déploiement
// (recette GitHub Pages = /veronique-liesse-site/, domaine final = /).
export function u(chemin: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (chemin === '/') return base + '/';
  return base + chemin;
}

export const euros = (n: number | null) => (n == null ? '' : `${n} €`);
