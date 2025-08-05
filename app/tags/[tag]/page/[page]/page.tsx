import { slug } from 'github-slugger'
import { notFound } from 'next/navigation'
import ListLayoutWithTags from '@/layouts/ListLayoutWithTags'
import { getAllTagsWithCounts, getBeasiswaByTag } from '@/lib/db/data'

import type { Beasiswa } from '@/lib/db/constant'

const BEASISWA_PER_HALAMAN = 5

interface TransformedBeasiswa extends Beasiswa {
  title: string
  date: string
  summary: string
  path: string
}

export default async function TagPage(props: { params: Promise<{ tag: string; page: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const pageNumber = parseInt(params.page, 10)

  const allTags = await getAllTagsWithCounts()

  // Cari tag asli dari slug (mis: "s-1" -> "S1")
  const originalTag = Object.keys(allTags).find((t) => slug(t) === tag)
  if (!originalTag) {
    return notFound()
  }

  // Ambil data beasiswa berdasarkan tag
  const { data: beasiswaList } = await getBeasiswaByTag(originalTag)

  const totalPages = Math.ceil(beasiswaList.length / BEASISWA_PER_HALAMAN)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }

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

  // Pagination
  const initialDisplayPosts = displayPosts.slice(
    BEASISWA_PER_HALAMAN * (pageNumber - 1),
    BEASISWA_PER_HALAMAN * pageNumber
  )

  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  const title = originalTag[0].toUpperCase() + originalTag.slice(1)

  return (
    <ListLayoutWithTags
      posts={displayPosts}
      title={`Beasiswa dengan Tag: "${title}"`}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      tags={allTags}
    />
  )
}
