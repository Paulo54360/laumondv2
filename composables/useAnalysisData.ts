import { useRuntimeConfig } from 'nuxt/app';
import { useI18n } from 'vue-i18n';

export interface IParagraph {
  text: string;
  type?: 'normal' | 'quote' | 'citation' | 'emphasis' | 'poeticLine';
  class?: string;
}

export interface IAuthorSignature {
  name: string;
  title?: string;
  date?: string;
}

export interface IFootnote {
  number: string;
  text: string;
}

export interface ITab {
  id: string;
  title: string;
  images: string[];
  translations: { fr: string; en: string };
  author: string;
  analysisTitle: string;
  paragraphs: IParagraph[];
  authorSignature: IAuthorSignature;
  footnotes?: IFootnote[];
  location?: string;
  copyright: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useAnalysisData = () => {
  const runtimeConfig = useRuntimeConfig();
  const S3_BASE_URL = runtimeConfig.public.apiUrl;
  const { t } = useI18n();

  const authorAvatars: Record<string, string> = {
    'Marion Zilio': `${S3_BASE_URL}/authors/marion-zilio.jpg`,
    'Isabelle de Maison Rouge': `${S3_BASE_URL}/authors/isabelle-de-maison-rouge.png`,
    'Edith Herlemont-Lassiat': `${S3_BASE_URL}/authors/default-avatar.jpg`,
    default: `${S3_BASE_URL}/authors/default-avatar.jpg`,
  };

  const tabs: ITab[] = [
    {
      id: 'portant',
      title: "Laumond à l'espace Commines",
      images: [`${S3_BASE_URL}/Deployments/00/10.jpg`, `${S3_BASE_URL}/Deployments/00/11.jpg`],
      translations: {
        fr: '',
        en: '',
      },
      author: 'Edith Herlemont-Lassiat',
      analysisTitle: 'Le portant (524C)',
      location: 'Espace Commines, Paris',
      copyright: '© Philibert Tapissier',
      paragraphs: [
        { text: t('LAEC.Texte1LAEC'), type: 'normal' },
        { text: t('LAEC.Texte2LAEC'), type: 'normal' },
        { text: t('LAEC.Texte3LAEC'), type: 'normal' },
        { text: t('LAEC.Texte4LAEC'), type: 'normal' },
        { text: t('LAEC.Texte5LAEC'), type: 'normal' },
        { text: t('LAEC.Texte6LAEC'), type: 'normal' },
        { text: t('LAEC.Texte10LAEC'), type: 'normal' },
        { text: t('LAEC.Texte12LAEC'), type: 'normal' },
        { text: t('LAEC.Texte13LAEC'), type: 'normal' },
        { text: t('LAEC.Texte14LAEC'), type: 'normal' },
        { text: t('LAEC.Texte15LAEC'), type: 'normal' },
        { text: t('LAEC.Texte16LAEC'), type: 'normal' },
        { text: t('LAEC.Texte17LAEC'), type: 'normal' },
        { text: t('LAEC.Texte18LAEC'), type: 'normal' },
        { text: t('LAEC.Texte19LAEC'), type: 'normal' },
      ],
      authorSignature: {
        name: t('LAEC.AuteurLAEC'),
        title: '',
        date: '',
      },
      footnotes: [],
    },
    {
      id: 'concordance',
      title: "MétaHisme, une tentative d'élargissement des possibles",
      images: [
        `${S3_BASE_URL}/Deployments/00/02.jpg`,
        `${S3_BASE_URL}/Deployments/00/03.jpg`,
        `${S3_BASE_URL}/Deployments/00/04.jpg`,
      ],
      translations: {
        fr: '',
        en: '',
      },
      author: 'Marion Zilio',
      analysisTitle: 'Concordance universelle',
      location: 'Biennale de Venise 2022 — Centre Culturel Européen d’Italie, Palazzo Bembo.',
      copyright: '© Matteo Losurdo',
      paragraphs: [{ text: t('CU.TexteCU'), type: 'normal' }],
      authorSignature: {
        name: t('CU.AuteurCU'),
        title: '',
        date: '',
      },
      footnotes: [],
    },
    {
      id: 'aimants',
      title: 'Comme deux aimants',
      images: [`${S3_BASE_URL}/Deployments/00/06.jpg`],
      translations: {
        fr: '',
        en: '',
      },
      author: 'Marion Zilio',
      analysisTitle: "Le Mobile d'ouverture des univers parallèles",
      location: 'Espace Labasse — Saint-Viance, 2023',
      copyright: '© Philibert Tapissier',
      paragraphs: [
        { text: t('CDA.Texte1CDA'), type: 'normal' },
        { text: t('CDA.Texte2CDA'), type: 'normal' },
        { text: t('CDA.Texte3CDA'), type: 'normal' },
      ],
      authorSignature: {
        name: t('CDA.AuteurCDA'),
        title: '',
        date: '',
      },
      footnotes: [],
    },
    {
      id: 'advienne',
      title: "Afin qu'un jouradvienne",
      images: [`${S3_BASE_URL}/Archetypes/02/09.jpg`, `${S3_BASE_URL}/Archetypes/02/10.jpg`],
      translations: {
        fr: '',
        en: '',
      },
      author: 'Isabelle de Maison Rouge',
      analysisTitle: 'Le grand Mikado de la pensée humaine',
      copyright: '© Philibert Tapissier',
      paragraphs: [
        { text: t('AQJA.Texte1AQJA'), type: 'normal' },
        { text: t('AQJA.Texte2AQJA'), type: 'normal' },
        { text: t('AQJA.Texte3AQJA'), type: 'normal' },
        { text: t('AQJA.Texte4AQJA'), type: 'normal' },
        { text: t('AQJA.Texte5AQJA'), type: 'normal' },
        { text: t('AQJA.Texte6AQJA'), type: 'normal' },
        { text: t('AQJA.Texte7AQJA'), type: 'normal' },
        { text: t('AQJA.Texte8AQJA'), type: 'citation' },
        { text: t('AQJA.Texte9AQJA'), type: 'citation' },
        { text: t('AQJA.Texte10AQJA'), type: 'normal' },
        { text: t('AQJA.Texte11AQJA'), type: 'normal' },
        { text: t('AQJA.Texte12AQJA'), type: 'normal' },
        { text: t('AQJA.Texte13AQJA'), type: 'normal' },
        { text: t('AQJA.Texte14AQJA'), type: 'normal' },
        { text: t('AQJA.Texte15AQJA'), type: 'normal' },
        { text: t('AQJA.Texte16AQJA'), type: 'normal' },
        { text: t('AQJA.Texte17AQJA'), type: 'normal' },
        { text: t('AQJA.Texte18AQJA'), type: 'emphasis' },
        { text: t('AQJA.Texte19AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte20AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte21AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte22AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte23AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte24AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte25AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte26AQJA'), type: 'poeticLine' },
        { text: t('AQJA.Texte27AQJA'), type: 'normal' },
        { text: t('AQJA.Texte28AQJA'), type: 'citation' },
        { text: t('AQJA.Texte29AQJA'), type: 'citation' },
        { text: t('AQJA.Texte30AQJA'), type: 'citation' },
        { text: t('AQJA.Texte31AQJA'), type: 'normal' },
      ],
      authorSignature: {
        name: t('AQJA.Texte32AQJA'),
        title: t('AQJA.Texte33AQJA'),
        date: t('AQJA.Texte34AQJA'),
      },
      footnotes: [
        { number: '¹', text: t('AQJA.Legende1AQJA') },
        { number: '²', text: t('AQJA.Legende2AQJA') },
      ],
    },
  ];

  const getAuthor = (tab: ITab): string => {
    return tab.author || t('analyses.unknown_author');
  };

  const getAuthorAvatar = (tab: ITab): string => {
    if (!tab || !tab.author) return authorAvatars.default;
    if (tab.author === 'Edith Herlemont-Lassiat') {
      return authorAvatars.default;
    }
    return authorAvatars[tab.author as string] || authorAvatars.default;
  };

  const getAuthorTitle = (tab: ITab): string => {
    if (!tab || !tab.author) return t('analyses.author_title');
    if (tab.author === 'Edith Herlemont-Lassiat') {
      return `${t('analyses.author_title')} - Exporevue`;
    }
    if (tab.author === 'Marion Zilio') {
      return `${t('analyses.author_title')} - AICA France`;
    }
    return t('analyses.author_title');
  };

  return {
    tabs,
    getAuthor,
    getAuthorAvatar,
    getAuthorTitle,
  };
};
