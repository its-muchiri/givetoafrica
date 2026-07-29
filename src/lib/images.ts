import heroGeneral1 from '@/img/images (1).jpg'
import heroGeneral2 from '@/img/images (2).jpg'
import heroGeneral3 from '@/img/images (3).jpg'
import heroGeneral4 from '@/img/images (4).jpg'
import heroGeneral from '@/img/images.jpg'
import aboutUs1 from '@/img/Save_the_Children_About_us_1.jpg'
import aboutUs2 from '@/img/Save_the_Children_About_us_2.jpg'
import somaliaChildren from '@/img/Save_the_Children_Ladan_and_Sahra_in_Somalia.jpg'
import educationHunger from '@/img/Education_and_Child_Hunger.jpg'
import ebolaCrisis from '@/img/_107910811_ebola_getty.jpg'
import ethiopiaDrought from '@/img/Ethiopia.Weather.story_.avif'
import kenyaFoodCrisis from '@/img/Cecilia (3) with nutritionist Anne - Phil Moore Kenya 2012 urban food crisis.jpg'
import zambiaCommunity from '@/img/Deli (1) - Photo by Gareth Bentley.Zambia.2014.jpg'
import hungerSouthAfrica from '@/img/8-Facts-About-Hunger-in-South-Africa.jpg'
import bwimeCommunity from '@/img/Bwime 2.jpg'
import newsWire from '@/img/afp_6a4298ae5b0e-1782749358.webp'
import fieldPhoto from '@/img/IMG_4487-1384x923.avif'
import webpPhoto from '@/img/3000.webp'
import genericNews from '@/img/0000-456999956.jpg'
import img5 from '@/img/images (5).jpg'
import img6 from '@/img/images (6).jpg'
import img7 from '@/img/images (7).jpg'
import img8 from '@/img/images (8).jpg'
import img9 from '@/img/images (9).jpg'
import img10 from '@/img/images (10).jpg'
import img11 from '@/img/images (11).jpg'
import img12 from '@/img/images (12).jpg'
import img13 from '@/img/images (13).jpg'
import img14 from '@/img/images (14).jpg'
import img15 from '@/img/images (15).jpg'
import img16 from '@/img/images (16).jpg'
import romanNguyen from '@/img/roman-nguyen-lPPkJ4NfQtQ-unsplash.jpg'
import premiumPhoto from '@/img/premium_photo-1734351686087-1468b990e4f3.avif'
import wordLitTrans from '@/img/Microsoft-Word-Lit-Trans-226-description-_rev_-1.jpg'
import disabilityProtocol from '@/img/disability-protocol.webp'
import b5458a3c from '@/img/b5458a3c6859e8bda50c5e130cf89d4e.webp'

export const causeImages: Record<string, string> = {
  'education-and-training': educationHunger,
  'health': kenyaFoodCrisis,
  'hospitals': kenyaFoodCrisis,
  'medical-research': ebolaCrisis,
  'medical-welfare': kenyaFoodCrisis,
  'overseas-aid': hungerSouthAfrica,
  'international': hungerSouthAfrica,
  'children-and-youth': somaliaChildren,
  'disabled': somaliaChildren,
  'human-rights': somaliaChildren,
  'community': zambiaCommunity,
  'family': bwimeCommunity,
  'housing': bwimeCommunity,
  'social-welfare': zambiaCommunity,
  'environment': ethiopiaDrought,
  'rescue-services': ebolaCrisis,
  'mental-health': kenyaFoodCrisis,
  'learning-disabilities-and-sen': somaliaChildren,
  'aged': bwimeCommunity,
  'animals': ethiopiaDrought,
  'armed-and-ex-services': zambiaCommunity,
  'culture-and-heritage': bwimeCommunity,
  'employment-trades-and-professions': zambiaCommunity,
  'hearing-impairments': somaliaChildren,
  'hospices': kenyaFoodCrisis,
  'religious': bwimeCommunity,
  'sport-and-recreation': zambiaCommunity,
  'visual-impairments': somaliaChildren,
}

export const causeGalleryImages: Record<string, string[]> = {
  'education-and-training': [educationHunger, img5, img6, img7],
  'health': [kenyaFoodCrisis, img8, img9, img10],
  'hospitals': [kenyaFoodCrisis, img11, img12, img13],
  'medical-research': [ebolaCrisis, img14, img15, img16],
  'medical-welfare': [kenyaFoodCrisis, img5, img6, img7],
  'overseas-aid': [hungerSouthAfrica, img8, img9, img10],
  'international': [hungerSouthAfrica, img11, img12, img13],
  'children-and-youth': [somaliaChildren, img14, img15, img16],
  'disabled': [somaliaChildren, img5, img6, img7],
  'human-rights': [somaliaChildren, img8, img9, img10],
  'community': [zambiaCommunity, img11, img12, img13],
  'family': [bwimeCommunity, img14, img15, img16],
  'housing': [bwimeCommunity, img5, img6, img7],
  'social-welfare': [zambiaCommunity, img8, img9, img10],
  'environment': [ethiopiaDrought, img11, img12, img13],
  'rescue-services': [ebolaCrisis, img14, img15, img16],
  'mental-health': [kenyaFoodCrisis, img5, img6, img7],
  'learning-disabilities-and-sen': [somaliaChildren, img8, img9, img10],
  'aged': [bwimeCommunity, img11, img12, img13],
  'animals': [ethiopiaDrought, img14, img15, img16],
  'armed-and-ex-services': [zambiaCommunity, img5, img6, img7],
  'culture-and-heritage': [bwimeCommunity, img8, img9, img10],
  'employment-trades-and-professions': [zambiaCommunity, img11, img12, img13],
  'hearing-impairments': [somaliaChildren, img14, img15, img16],
  'hospices': [kenyaFoodCrisis, img5, img6, img7],
  'religious': [bwimeCommunity, img8, img9, img10],
  'sport-and-recreation': [zambiaCommunity, img11, img12, img13],
  'visual-impairments': [somaliaChildren, img14, img15, img16],
}

export const images = {
  heroes: {
    home: heroGeneral1,
    causes: heroGeneral2,
    about: aboutUs1,
    news: heroGeneral3,
    impact: heroGeneral4,
    getInvolved: heroGeneral,
  },
  about: {
    team1: aboutUs1,
    team2: aboutUs2,
  },
  causes: {
    education: educationHunger,
    healthcare: kenyaFoodCrisis,
    foodSecurity: hungerSouthAfrica,
    disasterRelief: ebolaCrisis,
    childWelfare: somaliaChildren,
    community: zambiaCommunity,
  },
  news: {
    featured: educationHunger,
    cards: [
      ebolaCrisis,
      ethiopiaDrought,
      kenyaFoodCrisis,
      zambiaCommunity,
      bwimeCommunity,
      newsWire,
    ],
  },
  impact: {
    water: bwimeCommunity,
    education: educationHunger,
    health: kenyaFoodCrisis,
    community: zambiaCommunity,
  },
  misc: {
    fieldPhoto,
    webpPhoto,
    genericNews,
    somaliaChildren,
  },
  gallery: {
    img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16,
    romanNguyen, premiumPhoto, wordLitTrans, disabilityProtocol, b5458a3c,
  },
} as const
