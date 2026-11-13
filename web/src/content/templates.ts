import { TEMPLATE_A48, TEMPLATE_A48_PATH } from '@/content/templateA48'
import { TEMPLATE_DY4084, TEMPLATE_DY4084_PATH } from '@/content/templateDy4084'
import { TEMPLATE_SR28, TEMPLATE_SR28_PATH } from '@/content/templateSr28'

export const TEMPLATE_PAGES = {
  [TEMPLATE_SR28.slug]: TEMPLATE_SR28,
  [TEMPLATE_A48.slug]: TEMPLATE_A48,
  [TEMPLATE_DY4084.slug]: TEMPLATE_DY4084,
} as const

export const TEMPLATE_PATHS = [TEMPLATE_SR28_PATH, TEMPLATE_A48_PATH, TEMPLATE_DY4084_PATH] as const

export type TemplateSlug = keyof typeof TEMPLATE_PAGES
export type TemplateRecord = (typeof TEMPLATE_PAGES)[TemplateSlug]
