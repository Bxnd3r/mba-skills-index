import Link from 'next/link'
import Nav from '@/components/Nav'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f2ede4] flex flex-col">
      <Nav />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <p className="font-mono text-[#a09890] text-sm mb-4">404</p>
        <h1 className="font-display text-4xl font-bold text-[#1a1a18] mb-4">School not found</h1>
        <p className="text-[#6b6557] font-body text-sm mb-8">This school hasn't been scored yet or the URL is incorrect.</p>
        <Link href="/" className="px-6 py-3 border border-[#c8c0b0] text-[#6b6557] hover:border-[#1a1a18] hover:text-[#1a1a18] rounded text-sm font-body transition-colors">
          ← Back to search
        </Link>
      </div>
    </div>
  )
}
