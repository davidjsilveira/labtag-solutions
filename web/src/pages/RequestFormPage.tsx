import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { createHubSpotForm, loadHubSpotFormsScript } from '@/content/hubspotForm'
import { CONTACT_PATH } from '@/content/labtagLinks'

const FORMS: Record<
  string,
  {
    title: string
    intro: string
    solutionSlug: string
    solutionTitle: string
    portalId: string
    formId: string
  }
> = {
  'cryogenic-clinical-requisition-forms': {
    title: 'Request Cryogenic Clinical Requisition Forms',
    intro:
      'Tell us about your clinical or CRO requisition workflow and one of our experts will help specify cryogenic laser-printable forms and labels for your specimens.',
    solutionSlug: 'cryogenic-clinical-requisition-forms',
    solutionTitle: 'Cryogenic Clinical Requisition Forms',
    portalId: '4079112',
    formId: 'b1d5f69e-0ce4-46ff-bdd7-6e2d0a04ccaf',
  },
  'clinical-trial-labels': {
    title: 'Request Clinical Trial Labels',
    intro:
      'Tell us about your protocol, containers, languages, and data requirements and one of our experts will help specify custom clinical trial labels for your study.',
    solutionSlug: 'clinical-trial-labels',
    solutionTitle: 'Clinical trial labels',
    portalId: '4079112',
    formId: 'b1d5f69e-0ce4-46ff-bdd7-6e2d0a04ccaf',
  },
}

export function RequestFormPage() {
  const { formSlug = '' } = useParams()
  const config = FORMS[formSlug]
  const targetId = `hs-form-${formSlug}`
  const mounted = useRef(true)
  const [formState, setFormState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    mounted.current = true
    if (!config) return

    const targetSelector = `#${targetId}`
    let cancelled = false
    setFormState('loading')

    loadHubSpotFormsScript()
      .then(() => {
        if (cancelled || !mounted.current || !window.hbspt?.forms?.create) {
          if (!cancelled) setFormState('error')
          return
        }
        const target = document.querySelector(targetSelector)
        if (target) target.innerHTML = ''
        createHubSpotForm({
          portalId: config.portalId,
          formId: config.formId,
          target: targetSelector,
        })
        if (!cancelled) setFormState('ready')
      })
      .catch(() => {
        if (!cancelled) setFormState('error')
      })

    return () => {
      cancelled = true
      mounted.current = false
    }
  }, [config, targetId])

  if (!config) {
    return (
      <div className="missing">
        <h1>Form not found</h1>
        <p>No request form matches “{formSlug}”.</p>
        <Link to="/">Back to all solutions</Link>
      </div>
    )
  }

  return (
    <article className="request-form-page">
      <header className="request-form-header">
        <h1>{config.title}</h1>
        <p>{config.intro}</p>
      </header>

      <div className="request-form-card">
        <div id={targetId} className="request-form-embed" />
        {formState === 'error' ? (
          <p className="request-form-fallback">
            The form did not load.{' '}
            <Link to={CONTACT_PATH}>Contact us</Link> and we will help with this request.
          </p>
        ) : null}
      </div>
    </article>
  )
}
