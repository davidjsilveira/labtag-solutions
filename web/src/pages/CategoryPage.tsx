import { Link } from 'react-router-dom'
import { SolutionCarousel } from '@/components/SolutionCarousel'
import { getCategory, type SolutionCategoryId } from '@/content/categories'
import { LABTAG_SAMPLE_URL, LABTAG_SHOP_URL } from '@/content/labtagLinks'

type Props = {
  categoryId: string
}

export function CategoryPage({ categoryId }: Props) {
  const category = getCategory(categoryId)

  if (!category) {
    return (
      <div className="missing">
        <h1>Category not found</h1>
        <Link to="/">Back to all solutions</Link>
      </div>
    )
  }

  return (
    <div className="category-page">
      <p className="crumb">
        <Link to="/">Solutions</Link>
        <span aria-hidden="true"> / </span>
        <span>{category.label}</span>
      </p>

      <header className="category-hero">
        <h1>{category.label}</h1>
        <p className="lede">{category.description}</p>
        <div className="lander-hero-actions">
          <a className="btn btn-primary" href={LABTAG_SAMPLE_URL} target="_blank" rel="noreferrer">
            Request a free sample
          </a>
          <a className="btn btn-secondary" href={LABTAG_SHOP_URL} target="_blank" rel="noreferrer">
            Browse the shop
          </a>
        </div>
      </header>

      <SolutionCarousel categoryId={category.id as SolutionCategoryId} />
    </div>
  )
}
