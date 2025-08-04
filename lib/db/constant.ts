// lib/db/constants.ts
export interface Beasiswa {
  url: string
  judul: string
  deadline: string | null
  deskripsi: string[]
  persyaratan: string[]
  benefit: string[]
  tags: string[]
  kampus: string[]
  link_pendaftaran: string | null
}

// Tipe untuk props halaman detail
export interface BeasiswaDetailPageProps {
  params: {
    url: string
  }
}
