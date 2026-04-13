// amplitude.ts
'use client'

import * as amplitude from '@amplitude/unified'

function initAmplitude() {
  if (process.env.NODE_ENV === 'development') return

  const key = process.env.NEXT_PUBLIC_AMP_KEY ?? ''

  if (typeof window !== 'undefined') {
    amplitude.initAll(key, {
      analytics: { autocapture: false },
      serverZone: 'EU',
      sessionReplay: { sampleRate: 0.5 }
    })
  }
}

initAmplitude()

export const Amplitude = () => null
export default amplitude

export const $amplitude = (eventName: string, eventParams?: any) =>
  amplitude.track(eventName, eventParams)
