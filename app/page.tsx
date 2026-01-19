import { redirect } from 'next/navigation'

/**
 * Root Route Handler
 * Redirects "/" to "/landing" to show the Landing Page
 */
export default function RootPage() {
  redirect('/landing')
}
