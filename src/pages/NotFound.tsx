import { Link } from 'react-router-dom'
import { MaskText } from '../components/Reveal'

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <MaskText as="h1" text="404" className="font-display text-[30vw] leading-none font-medium md:text-[18vw]" />
      <p className="mt-4 text-muted">Такой страницы нет — возможно, вещь уже раскупили.</p>
      <Link to="/catalog" className="btn-dark mt-8">
        В каталог
      </Link>
    </div>
  )
}
