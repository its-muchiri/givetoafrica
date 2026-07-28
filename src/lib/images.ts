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
} as const
