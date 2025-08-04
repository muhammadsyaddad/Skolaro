// app/beasiswa/page.tsx

import { BEASISWA_PER_HALAMAN, getAllTagsWithCounts, getBeasiswa } from '@/lib/db/data'
import ListLayoutWithTags from '@/layouts/ListLayoutWithTags'
import { coreContent } from 'pliny/utils/contentlayer'

const JUDUL_HALAMAN = 'Semua Beasiswa'

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

  // 3. Gunakan ListLayoutWithTags dan berikan semua data yang dibutuhkan
  return (
    <ListLayoutWithTags
      posts={displayPosts as any}
      title={JUDUL_HALAMAN}
      initialDisplayPosts={displayPosts as any}
      pagination={pagination}
      tags={tags}
    />
  )
}
