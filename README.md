# veronique-liesse-nutrition.com

Site de Véronique Liesse (Astro statique + GitHub Pages), même système que annecharlotte.be.

- **Recette** : https://goood-studio.github.io/veronique-liesse-site/
- **CMS** : un Google Sheet, un onglet par fichier de `cms/` (formations, reglages, faq, temoignages, livres, presse). Le workflow le synchronise à chaque push et chaque nuit (4h30) quand la variable de dépôt `SHEET_ID` est réglée. Sans elle, les CSV du dépôt font foi.
- **Phase de lancement** : onglet `reglages`, clé `phase` = `attente` (tout mène au webinaire du 10/12), `vente` (page de vente ouverte, offre 48 h), `fermee` (prix plein).
- **Inscriptions webinaire** : `inscription_endpoint` (webhook n8n → ActiveCampaign + Zoom, remplace Zapier) ou, en repli, `inscription_url` (Zoom).
- **Détecteur** (`scripts/verifier.mjs`) : bloque le build si une page n'a pas son SEO, son lien vers le webinaire ou la formation, ou un tiret cadratin visible. En production, il bloque tout lien d'achat encore pointé vers l'ancien WordPress.
- **Bascule** (après le 10/12, une fois les formations et l'espace élève sur LearnyBox) : liens d'achat LearnyBox dans le Sheet, variable `VL_PROD=1`, CNAME + DNS du domaine (ne toucher qu'aux enregistrements web, jamais aux MX).
