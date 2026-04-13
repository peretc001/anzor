import { IGallery, IPortfolio, IProfile } from '@/shared/interfaces'

import { DESIGN_EXPERIENCE, DESIGN_STATUS, DESIGN_STYLES, DESIGN_TYPES } from '@/constants'

export const prepareProfile = (profile: IProfile, gallery: IGallery[], portfolio: IPortfolio[]) => {
  const name = [profile.last_name, profile.first_name, profile.middle_name].join(' ')

  return {
    ...profile,
    stylesLabel: DESIGN_STYLES.filter(x => profile.styles.includes(x.value)) || [],
    experienceLabel: DESIGN_EXPERIENCE.find(x => x.value === profile.experience)?.label,
    gallery: gallery,
    name: name,
    portfolio: portfolio,
    statusLabel: DESIGN_STATUS.find(x => x.value === profile.status)?.label,
    typesLabel: DESIGN_TYPES.filter(x => profile.types.includes(x.value)) || []
  }
}
