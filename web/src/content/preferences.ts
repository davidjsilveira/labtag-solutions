import { LABTAG_EN_URL, LABTAG_FR_URL } from '@/content/labtagLinks'

export const LANGUAGE_OPTIONS = [
  { label: 'English', href: LABTAG_EN_URL },
  { label: 'Français', href: LABTAG_FR_URL },
] as const

export const UNIT_OPTIONS = [
  { id: 'metric', label: 'Millimeters' },
  { id: 'imperial', label: 'Inches' },
] as const

export type UnitId = (typeof UNIT_OPTIONS)[number]['id']

const UNIT_KEY = 'labtag-unit'
export const UNIT_EVENT = 'labtag-unit'

export function readUnit(): UnitId {
  if (typeof window === 'undefined') return 'metric'
  const value = window.localStorage.getItem(UNIT_KEY)
  return UNIT_OPTIONS.some((item) => item.id === value) ? (value as UnitId) : 'metric'
}

export function writeUnit(id: UnitId) {
  window.localStorage.setItem(UNIT_KEY, id)
  window.dispatchEvent(new CustomEvent(UNIT_EVENT, { detail: id }))
}
