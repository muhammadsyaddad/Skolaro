// app/beasiswa/page/[page]/page.tsx

import ListLayoutWithTags from '@/layouts/ListLayoutWithTags'
import { getBeasiswa, BEASISWA_PER_HALAMAN, getAllTagsWithCounts } from '@/lib/db/data' // <-- Tambahkan getAllTagsWithCounts
import type { Beasiswa } from '@/lib/db/constant'

const JUDUL_HALAMAN = 'Semua Beasiswa'

interface PageProps {
  params: Promise<{
    page: string
  }>
}

interface TransformedBeasiswa extends Beasiswa {
  title: string
  date: string
  summary: string
  path: string
}

export default async function BeasiswaPageNumber({ params }: PageProps) {
  const { page } = await params
  const pageNumber = parseInt(page, 10)

  // ✅ Ambil data beasiswa DAN data tags secara bersamaan
  const tags = await getAllTagsWithCounts()
  const { data: beasiswaList, count } = await getBeasiswa(pageNumber)
  const totalPages = Math.ceil(count / BEASISWA_PER_HALAMAN)

  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  // Transformasi data (tidak berubah)
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
      title={JUDUL_HALAMAN}
      initialDisplayPosts={displayPosts}
      pagination={pagination}
      tags={tags} // ✅ Pastikan 'tags' diteruskan ke layout
    />
  )
}
