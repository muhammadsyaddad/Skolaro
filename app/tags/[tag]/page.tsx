// app/tags/[tag]/page.tsx

import { slug } from 'github-slugger'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import ListLayoutWithTags from '@/layouts/ListLayoutWithTags'
import { getAllTagsWithCounts, getBeasiswaByTag } from '@/lib/db/data'

import type { Beasiswa } from '@/lib/db/constant'

export const dynamic = 'force-dynamic'

// Props untuk halaman ini
interface TagPageProps {
  params: Promise<{
    tag: string
  }>
}

interface TransformedBeasiswa extends Beasiswa {
  title: string
  date: string
  summary: string
  path: string
}

// Fungsi untuk SEO
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const tagName = decodeURI(tag)
  return {
    title: `Beasiswa dengan tag: ${tagName}`,
    description: `Daftar beasiswa yang tersedia dengan tag ${tagName}`,
  }
}

// Komponen Halaman
export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const tagSlug = decodeURI(tag)
  const allTags = await getAllTagsWithCounts()

  // Cari tag asli dari slug (mis: "s-1" -> "S1")
  const originalTag = Object.keys(allTags).find((t) => slug(t) === tagSlug)
  if (!originalTag) {
    return notFound()
  }

  // Ambil data beasiswa berdasarkan tag
  const { data: beasiswaList } = await getBeasiswaByTag(originalTag)

  // Transformasi data agar sesuai dengan layout
  const formattedBeasiswa: TransformedBeasiswa[] = beasiswaList.map((item) => ({
    ...item,
    title: item.judul,
    date: item.deadline || new Date().toISOString(),
    summary: item.deskripsi.length > 0 ? `${item.deskripsi[0]}...` : 'Klik untuk detail.',
    slug: item.url,
    path: `/beasiswa/${encodeURIComponent(item.url)}`,
    tags: item.tags || [],
  }))

  const displayPosts = formattedBeasiswa

  return (
    <ListLayoutWithTags
      posts={displayPosts}
      title={`Beasiswa dengan Tag: "${originalTag}"`}
      initialDisplayPosts={displayPosts}
      tags={allTags}
      // Pagination bisa ditambahkan di sini nanti jika diperlukan
    />
  )
}
