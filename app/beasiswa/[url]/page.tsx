// app/beasiswa/[url]/page.tsx

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBeasiswaByUrl } from '@/lib/db/data'
import ScholarshipLayout from '@/layouts/ScholarshipLayout'

// Definisikan tipe props di sini agar jelas
interface BeasiswaDetailPageProps {
  params: Promise<{
    url: string
  }>
}

// Fungsi untuk membuat metadata SEO
export async function generateMetadata({ params }: BeasiswaDetailPageProps): Promise<Metadata> {
  const { url } = await params
  const decodedUrl = decodeURIComponent(url)
  const beasiswa = await getBeasiswaByUrl(decodedUrl)

  if (!beasiswa) {
    return {
      title: 'Beasiswa Tidak Ditemukan',
    }
  }

  const summary =
    beasiswa.deskripsi && beasiswa.deskripsi.length > 0 ? beasiswa.deskripsi[0] : undefined

  return {
    title: beasiswa.judul,
    description: summary,
  }
}

// Komponen Halaman Utama
export default async function BeasiswaDetailPage({ params }: BeasiswaDetailPageProps) {
  const { url } = await params
  const decodedUrl = decodeURIComponent(url)
  const beasiswa = await getBeasiswaByUrl(decodedUrl)

  if (!beasiswa) {
    notFound()
  }

  return <ScholarshipLayout beasiswa={beasiswa} />
}
