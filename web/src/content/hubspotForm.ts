declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: {
          portalId: string
          formId: string
          target: string
          css?: string
          cssRequired?: string
        }) => void
      }
    }
  }
}

export function loadHubSpotFormsScript(): Promise<void> {
  if (window.hbspt?.forms?.create) return Promise.resolve()

  const existing = document.querySelector<HTMLScriptElement>('script[data-hsforms-embed]')
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('HubSpot forms failed to load')), {
        once: true,
      })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/embed/v2.js'
    script.async = true
    script.dataset.hsformsEmbed = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('HubSpot forms failed to load'))
    document.body.appendChild(script)
  })
}

export function createHubSpotForm(options: {
  portalId: string
  formId: string
  target: string
}): void {
  window.hbspt?.forms.create({
    ...options,
    css: '',
    cssRequired: '',
  })
}
