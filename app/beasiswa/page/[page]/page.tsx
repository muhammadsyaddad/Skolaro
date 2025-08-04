// app/beasiswa/page/[page]/page.tsx

import ListLayoutWithTags from '@/layouts/ListLayoutWithTags'
import { getBeasiswa, BEASISWA_PER_HALAMAN, getAllTagsWithCounts } from '@/lib/db/data' // <-- Tambahkan getAllTagsWithCounts
import { coreContent } from 'pliny/utils/contentlayer'

const JUDUL_HALAMAN = 'Semua Beasiswa'

interface PageProps {
  params: {
    page: string
  }
}

export default async function BeasiswaPageNumber({ params }: PageProps) {
  const pageNumber = parseInt(params.page, 10)

  // ✅ Ambil data beasiswa DAN data tags secara bersamaan
  const tags = await getAllTagsWithCounts()
  const { data: beasiswaList, count } = await getBeasiswa(pageNumber)
  const totalPages = Math.ceil(count / BEASISWA_PER_HALAMAN)

  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  // Transformasi data (tidak berubah)
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
      title={JUDUL_HALAMAN}
      initialDisplayPosts={displayPosts as any}
      pagination={pagination}
      tags={tags} // ✅ Pastikan 'tags' diteruskan ke layout
    />
  )
}
