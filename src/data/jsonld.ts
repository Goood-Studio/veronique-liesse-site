export const faqJsonLd = (questions: Record<string, string>[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions.map((q) => ({
    '@type': 'Question',
    name: q.question,
    acceptedAnswer: { '@type': 'Answer', text: q.reponse },
  })),
});

export const filAriane = (racine: string, etapes: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: etapes.map(([nom, chemin], i) => ({
    '@type': 'ListItem', position: i + 1, name: nom, item: racine + chemin,
  })),
});
