// app/beasiswa/page.tsx

import ListLayoutWithTags from '@/layouts/ListLayoutWithTags'
import { getBeasiswa, getAllTagsWithCounts, BEASISWA_PER_HALAMAN } from '@/lib/db/data'
import type { Beasiswa } from '@/lib/db/constant'

const JUDUL_HALAMAN = 'Semua Beasiswa'

interface TransformedBeasiswa extends Beasiswa {
  title: string
  date: string
  summary: string
  path: string
}

export default async function BeasiswaPage() {
  // 1. Ambil data tags dan data beasiswa halaman pertama secara bersamaan
  const tags = await getAllTagsWithCounts()
  const { data: beasiswaList, count } = await getBeasiswa(1)
  const totalPages = Math.ceil(count / BEASISWA_PER_HALAMAN)

  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  // 2. Transformasi data beasiswa (seperti sebelumnya)
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

  // 3. Gunakan ListLayoutWithTags dan berikan semua data yang dibutuhkan
  return (
    <ListLayoutWithTags
      posts={displayPosts}
      title={JUDUL_HALAMAN}
      initialDisplayPosts={displayPosts}
      pagination={pagination}
      tags={tags}
    />
  )
}
