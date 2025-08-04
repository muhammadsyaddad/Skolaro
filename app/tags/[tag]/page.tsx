// app/tags/[tag]/page.tsx

import { slug } from 'github-slugger'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import ListLayoutWithTags from '@/layouts/ListLayoutWithTags'
import { getAllTagsWithCounts, getBeasiswaByTag } from '@/lib/db/data'
import { coreContent } from 'pliny/utils/contentlayer'

// Props untuk halaman ini
interface TagPageProps {
  params: {
    tag: string
  }
}

// Fungsi untuk SEO
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = decodeURI(params.tag)
  return {
    title: `Beasiswa dengan tag: ${tag}`,
    description: `Daftar beasiswa yang tersedia dengan tag ${tag}`,
  }
}

// Komponen Halaman
export default async function TagPage({ params }: TagPageProps) {
  const tagSlug = decodeURI(params.tag)
  const allTags = await getAllTagsWithCounts()

  // Cari tag asli dari slug (mis: "s-1" -> "S1")
  const originalTag = Object.keys(allTags).find((t) => slug(t) === tagSlug)
  if (!originalTag) {
    return notFound()
  }

  // Ambil data beasiswa berdasarkan tag
  const { data: beasiswaList } = await getBeasiswaByTag(originalTag)

  // Transformasi data agar sesuai dengan layout
  const formattedBeasiswa = beasiswaList.map((item) => ({
    ...item,
    title: item.judul,
    date: item.deadline || new Date().toISOString(),
    summary: item.deskripsi.length > 0 ? `${item.deskripsi[0]}...` : 'Klik untuk detail.',
    slug: item.url,
    path: `/beasiswa/${encodeURIComponent(item.url)}`,
    tags: item.tags || [],
  }))

  const displayPosts = formattedBeasiswa.map((post) => coreContent(post as any))

  return (
    <ListLayoutWithTags
      posts={displayPosts as any}
      title={`Beasiswa dengan Tag: "${originalTag}"`}
      initialDisplayPosts={displayPosts as any}
      tags={allTags}
      // Pagination bisa ditambahkan di sini nanti jika diperlukan
    />
  )
}
