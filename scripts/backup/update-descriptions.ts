export interface CategoryTitles {
  [category: string]: {
    [folder: string]: {
      title: string;
      images: Record<string, string>;
    };
  };
}

const S3_BASE_URL = 'https://plaumondpicture.s3.eu-west-3.amazonaws.com';

export const categoryTitles: CategoryTitles = {
  transcriptions: {
    '01': {
      title: "L'Œuvre De Damoclès Et L'Energie Quantique De La Pensée",
      images: {
        '01': "Vue frontale de l'œuvre montrant la composition principale et ses éléments quantiques",
        '02': "Détail de la partie supérieure illustrant l'énergie quantique en mouvement",
        '03': "Gros plan sur les éléments centraux de la composition et leurs interactions",
        '04': "Vue d'ensemble mettant en évidence les interactions entre les différentes dimensions",
        '05': "Détail des motifs et textures représentant la pensée en transformation"
      }
    },
    '02': {
      title: "L'Ascension Potentielle",
      images: {
        '01': "Vue générale de l'œuvre montrant le mouvement ascendant et sa dynamique",
        '02': "Détail des éléments symbolisant l'élévation et la transcendance",
        '03': "Gros plan sur la dynamique verticale et ses ramifications",
        '04': "Perspective mettant en valeur la progression et l'évolution"
      }
    },
    '03': {
      title: "Les Cinq Points Cardinaux - Quinta Essentia",
      images: {
        '01': "Vue d'ensemble des cinq points cardinaux et leur interconnexion",
        '02': "Détail du point central et de son rayonnement",
        '03': "Perspective sur les axes de force et leur équilibre",
        '04': "Gros plan sur la quintessence et ses manifestations",
        '05': "Vue détaillée des transitions entre les points"
      }
    },
    '04': {
      title: "L'Interdépendance Universelle",
      images: {
        '01': "Vue générale illustrant le concept d'interdépendance",
        '02': "Détail des connexions et des liens universels",
        '03': "Gros plan sur les nœuds d'interaction",
        '04': "Perspective sur la trame universelle"
      }
    },
    '05': {
      title: "La Puissance De La Résistance",
      images: {
        '01': "Vue d'ensemble de la force de résistance",
        '02': "Détail des points de tension et d'opposition",
        '03': "Gros plan sur la dynamique de résistance",
        '04': "Perspective sur l'équilibre des forces",
        '05': "Vue détaillée des zones de transformation"
      }
    },
    '06': {
      title: "Le Grand Saut",
      images: {
        '01': "Vue générale du moment de transition",
        '02': "Détail de la phase de transformation",
        '03': "Gros plan sur le point de basculement",
        '04': "Perspective sur l'élan et le mouvement"
      }
    },
    '07': {
      title: "L'Aube Du Soulèvement De L'Invisible",
      images: {
        '01': "Vue d'ensemble du processus d'émergence",
        '02': "Détail des manifestations de l'invisible",
        '03': "Gros plan sur les transitions dimensionnelles",
        '04': "Perspective sur le soulèvement",
        '05': "Vue détaillée des formes émergentes"
      }
    },
    '08': {
      title: "L'Energie Du Vide",
      images: {
        '01': "Vue générale de l'espace et de son énergie",
        '02': "Détail des fluctuations quantiques",
        '03': "Gros plan sur les manifestations énergétiques",
        '04': "Perspective sur le vide créateur"
      }
    },
    '09': {
      title: "Le Mythe De Pandore",
      images: {
        '01': "Vue d'ensemble de la révélation",
        '02': "Détail des éléments libérés",
        '03': "Gros plan sur le point d'ouverture",
        '04': "Perspective sur les conséquences",
        '05': "Vue détaillée des transformations"
      }
    },
    '10': {
      title: "Le Détachement De Soi",
      images: {
        '01': "Vue générale du processus de détachement",
        '02': "Détail des liens en dissolution",
        '03': "Gros plan sur la libération",
        '04': "Perspective sur la transformation"
      }
    },
    '11': {
      title: "Hors Du Dedans",
      images: {
        '01': "Vue d'ensemble de la transition intérieur-extérieur",
        '02': "Détail des passages dimensionnels",
        '03': "Gros plan sur les frontières",
        '04': "Perspective sur les espaces intermédiaires",
        '05': "Vue détaillée des transformations spatiales"
      }
    },
    '12': {
      title: "L'Inextricable Enchevêtrement Du Réel",
      images: {
        '01': "Vue générale de la complexité du réel",
        '02': "Détail des interconnexions multiples",
        '03': "Gros plan sur les nœuds de réalité",
        '04': "Perspective sur l'enchevêtrement"
      }
    },
    '13': {
      title: "Le Tout",
      images: {
        '01': "Vue d'ensemble de l'unité universelle",
        '02': "Détail des connexions holistiques",
        '03': "Gros plan sur les points d'unification",
        '04': "Perspective sur l'harmonie globale",
        '05': "Vue détaillée des relations systémiques"
      }
    },
    '14': {
      title: "L'Effet H.Casimir",
      images: {
        '01': "Vue générale des forces quantiques",
        '02': "Détail des interactions à l'échelle microscopique",
        '03': "Gros plan sur les champs de force",
        '04': "Perspective sur les effets quantiques"
      }
    },
    '15': {
      title: "L'Intrication Quantique",
      images: {
        '01': "Vue d'ensemble des particules intriquées",
        '02': "Détail des connexions non-locales",
        '03': "Gros plan sur les états quantiques",
        '04': "Perspective sur les corrélations",
        '05': "Vue détaillée des interactions quantiques"
      }
    },
    '16': {
      title: "Aléa Du Mi-Clos",
      images: {
        '01': "Vue générale de l'état intermédiaire",
        '02': "Détail des zones de transition",
        '03': "Gros plan sur les points d'incertitude",
        '04': "Perspective sur les possibilités"
      }
    },
    '17': {
      title: "Le Corps De L'Esprit De L'Âme",
      images: {
        '01': "Vue d'ensemble de la trinité corps-esprit-âme",
        '02': "Détail des interactions entre les dimensions",
        '03': "Gros plan sur les points de connexion",
        '04': "Perspective sur l'unité transcendante",
        '05': "Vue détaillée des manifestations spirituelles"
      }
    }
  },
  archetype: {
    '02': {
      title: "Vice-Versa",
      images: {
        '01': "Vue d'ensemble de la dualité représentée dans l'œuvre",
        '02': "Détail des éléments opposés et leur interaction",
        '03': "Gros plan sur les transitions et transformations",
        '04': "Perspective sur les relations duales"
      }
    },
    '03': {
      title: "Equilibrium",
      images: {
        '01': "Vue générale de l'équilibre des forces",
        '02': "Détail des points d'harmonie",
        '03': "Gros plan sur les zones de stabilité",
        '04': "Perspective sur la balance cosmique",
        '05': "Vue détaillée des interactions équilibrées"
      }
    },
    '04': {
      title: "Double Pression - Effet De Mouvement De Rotation Central",
      images: {
        '01': "Vue d'ensemble du mouvement rotatif",
        '02': "Détail du point de rotation central",
        '03': "Gros plan sur les forces de pression",
        '04': "Perspective sur la dynamique circulaire"
      }
    },
    '05': {
      title: "L'Infini",
      images: {
        '01': "Vue générale du concept d'infini",
        '02': "Détail des boucles sans fin",
        '03': "Gros plan sur les cycles éternels",
        '04': "Perspective sur l'expansion continue",
        '05': "Vue détaillée des motifs récursifs"
      }
    },
    '06': {
      title: "Retrait - Collection Privée",
      images: {
        '01': "Vue d'ensemble du mouvement de retrait",
        '02': "Détail des zones de transition",
        '03': "Gros plan sur l'essence du retrait",
        '04': "Perspective sur l'espace créé"
      }
    },
    '07': {
      title: "Mutation De La Pensée Globale",
      images: {
        '01': "Vue générale du processus de mutation",
        '02': "Détail des transformations cognitives",
        '03': "Gros plan sur les points de changement",
        '04': "Perspective sur l'évolution mentale",
        '05': "Vue détaillée des nouvelles connexions"
      }
    },
    '08': {
      title: "Brisure De Symétrie",
      images: {
        '01': "Vue d'ensemble du point de rupture",
        '02': "Détail des asymétries créées",
        '03': "Gros plan sur la transformation",
        '04': "Perspective sur le nouvel ordre"
      }
    },
    '09': {
      title: "Outreconscience",
      images: {
        '01': "Vue générale de l'expansion de la conscience",
        '02': "Détail des niveaux de perception",
        '03': "Gros plan sur les frontières mentales",
        '04': "Perspective sur les dimensions supérieures",
        '05': "Vue détaillée des états de conscience"
      }
    }
  },
  deploiement: {
    '00': {
      title: "Concordance Universelle - 2022",
      images: {
        '01': "Vue générale de l'installation monumentale",
        '02': "Détail de la structure centrale et ses ramifications",
        '03': "Perspective sur les éléments concordants et leur harmonie",
        '04': "Gros plan sur les interconnexions spatiales",
        '05': "Vue d'ensemble de l'harmonie créée dans l'espace"
      }
    },
    '01': {
      title: "L'Extension De La Pensée, L.28P - Saint Anastase - Paris",
      images: {
        '01': "Vue générale de l'installation in situ",
        '02': "Détail des extensions spatiales",
        '03': "Gros plan sur les points d'ancrage",
        '04': "Perspective sur l'intégration architecturale"
      }
    },
    '02': {
      title: "Le Portant \"524C\" - Espace Commines - Paris",
      images: {
        '01': "Vue d'ensemble de l'installation",
        '02': "Détail de la structure portante",
        '03': "Gros plan sur les éléments suspendus",
        '04': "Perspective sur l'espace créé",
        '05': "Vue détaillée des interactions spatiales"
      }
    },
    '03': {
      title: "Mutation De La Pensée Globale Et La Projection De La Protection - PYO Gallery LA - Los Angeles",
      images: {
        '01': "Vue générale de l'exposition",
        '02': "Détail des projections",
        '03': "Gros plan sur les mutations",
        '04': "Perspective sur l'ensemble installé"
      }
    },
    '04': {
      title: "L'Equilibre Du Présent - Collection Privée",
      images: {
        '01': "Vue d'ensemble de l'œuvre installée",
        '02': "Détail des points d'équilibre",
        '03': "Gros plan sur les tensions",
        '04': "Perspective sur l'harmonie spatiale",
        '05': "Vue détaillée des interactions temporelles"
      }
    },
    '05': {
      title: "Intéraction Quantique - Galerie Du Théatre De La Ville - Brive",
      images: {
        '01': "Vue générale de l'installation",
        '02': "Détail des interactions",
        '03': "Gros plan sur les phénomènes quantiques",
        '04': "Perspective sur l'espace d'exposition"
      }
    }
  },
  drawing: {
    '01': {
      title: "Etudes Préparatoires",
      images: {
        '01': "Première étude conceptuelle du projet",
        '02': "Développement des formes principales et leur articulation",
        '03': "Exploration des dynamiques spatiales",
        '04': "Détails techniques et annotations",
        '05': "Synthèse finale et notes de réalisation"
      }
    },
    '02': {
      title: "Etude Préparatoire Sur L'Instantanéité",
      images: {
        '01': "Recherches sur la capture du moment",
        '02': "Développement des expressions temporelles",
        '03': "Exploration des transitions instantanées",
        '04': "Détails sur la perception du temps"
      }
    },
    '03': {
      title: "Etudes Préparatoires",
      images: {
        '01': "Esquisse initiale du concept",
        '02': "Développement des éléments structurels",
        '03': "Étude des relations spatiales",
        '04': "Notes techniques détaillées",
        '05': "Synthèse des recherches"
      }
    },
    '04': {
      title: "Etude Préparatoire Sur La Perception Des Interactions De L'infiniment Grand Et De L'Infiniment Petit",
      images: {
        '01': "Recherches sur les échelles cosmiques",
        '02': "Études des relations micro-macro",
        '03': "Exploration des connexions dimensionnelles",
        '04': "Détails sur les interactions multi-échelles"
      }
    },
    '05': {
      title: "Etude Préparatoire De La Genèse De Pensée Du MétaHisme - Interaction Des Etats Superposés",
      images: {
        '01': "Concept initial du MétaHisme",
        '02': "Développement des principes fondamentaux",
        '03': "Étude des états superposés",
        '04': "Annotations sur les interactions",
        '05': "Synthèse de la pensée MétaHiste"
      }
    }
  }
}; 