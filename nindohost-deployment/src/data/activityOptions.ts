export interface ActivityOption {
  id: string;
  label: string;
  category: string;
}

export const activityOptions: ActivityOption[] = [
  // Exportateurs
  { id: 'exportateurs-directs', label: 'Exportateurs directs (%exportations)', category: 'Exportateurs' },
  { id: 'exportateurs-indirects', label: 'Exportateurs indirects', category: 'Exportateurs' },
  { id: 'marche-local', label: 'Marche local', category: 'Exportateurs' },
  { id: 'marque-marocaine', label: 'Marque marocaine', category: 'Exportateurs' },

  // Production
  { id: 'produit-fini', label: 'Produit fini', category: 'Production' },
  { id: 'sous-traitance', label: 'Sous-traitance', category: 'Production' },
  { id: 'co-traitance', label: 'Co-traitance', category: 'Production' },

  // Textile
  { id: 'textile', label: 'Textile', category: 'Textile' },
  { id: 'chaine-et-trame', label: 'Chaîne et trame', category: 'Textile' },
  { id: 'maille', label: 'Maille', category: 'Textile' },
  { id: 'textile-technique', label: 'Textile technique', category: 'Textile' },
  { id: 'textile-de-maison', label: 'Textile de maison', category: 'Textile' },

  // Habillement
  { id: 'habillement', label: 'Habillement', category: 'Habillement' },
  { id: 'maille-fine', label: 'Maille fine', category: 'Habillement' },
  { id: 'grosse-maille', label: 'Grosse maille', category: 'Habillement' },
  { id: 'denim', label: 'Denim', category: 'Habillement' },
  { id: 'flou', label: 'Flou', category: 'Habillement' },
  { id: 'pieces-a-manches', label: 'Pièces à manches', category: 'Habillement' },

  // Finissage et teinture
  { id: 'finissage-et-teinture', label: 'Finissage et teinture', category: 'Finissage' },
  { id: 'teinture-tissus', label: 'Teinture tissus', category: 'Finissage' },
  { id: 'teinture-pieces', label: 'Teinture pièces', category: 'Finissage' },
  { id: 'delavage', label: 'Délavage', category: 'Finissage' },
  { id: 'finissage', label: 'Finissage', category: 'Finissage' },

  // Impression
  { id: 'impression-rotative', label: 'Impression rotative', category: 'Impression' },
  { id: 'impression-digitale', label: 'Impression digitale', category: 'Impression' },
  { id: 'personnalisation', label: 'Personnalisation', category: 'Impression' },
  { id: 'broderie', label: 'Broderie', category: 'Impression' },
  { id: 'serigraphie', label: 'Sérigraphie', category: 'Impression' },
  { id: 'sublimation', label: 'Sublimation', category: 'Impression' },
  { id: 'laser', label: 'Laser', category: 'Impression' },

  // Autres
  { id: 'autres', label: 'Autres', category: 'Autres' },
];

export const activityCategories = [
  'Exportateurs',
  'Production', 
  'Textile',
  'Habillement',
  'Finissage',
  'Impression',
  'Autres'
];
