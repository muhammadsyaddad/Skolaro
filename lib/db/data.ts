// lib/db/data.ts
import { supabase } from './supabaseClient'
import type { Beasiswa } from './constant' // Asumsi tipe ada di constant

// Tentukan berapa item yang akan ditampilkan per halaman
export const BEASISWA_PER_HALAMAN = 5

// Fungsi untuk mengambil data beasiswa dengan pagination
export async function getBeasiswa(page: number = 1) {
  const from = (page - 1) * BEASISWA_PER_HALAMAN
  const to = from + BEASISWA_PER_HALAMAN - 1

  const { data, error, count } = await supabase
    .from('beasiswa')
    .select('*', { count: 'exact' }) // Ambil semua data & total hitungannya
    .order('deadline', { ascending: false }) // Urutkan berdasarkan deadline
    .range(from, to) // Ambil data sesuai halaman

  if (error) {
    console.error('Database Error (getBeasiswa):', error.message)
    throw new Error('Gagal mengambil data beasiswa.')
  }

  // Kembalikan data dan total hitungannya
  return {
    data: data as Beasiswa[],
    count: count ?? 0,
  }
}

// Fungsi untuk mengambil satu beasiswa berdasarkan URL
export async function getBeasiswaByUrl(url: string): Promise<Beasiswa | null> {
  const { data, error } = await supabase
    .from('beasiswa')
    .select('*')
    .eq('url', url) // Filter berdasarkan URL
    .single() // Ambil satu hasil

  if (error) {
    console.error('Database Error (getBeasiswaByUrl):', error.message)
    return null
  }

  return data
}
export async function getAllTagsWithCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc('get_all_tags_with_counts')

  if (error) {
    console.error('Database Error (getAllTagsWithCounts):', error.message)
    return {}
  }

  // Ubah hasil array menjadi objek/record yang dibutuhkan oleh layout
  const tagsRecord: Record<string, number> = {}
  if (data) {
    for (const item of data) {
      tagsRecord[item.tag] = item.tag_count
    }
  }

  return tagsRecord
}
export async function getBeasiswaByTag(tag: string) {
  const { data, error, count } = await supabase
    .from('beasiswa')
    .select('*', { count: 'exact' })
    // .contains() memeriksa apakah array 'tags' mengandung nilai 'tag'
    .contains('tags', [tag])
    .order('deadline', { ascending: false })

  if (error) {
    console.error('Database Error (getBeasiswaByTag):', error.message)
    throw new Error('Gagal mengambil data beasiswa berdasarkan tag.')
  }

  return {
    data: data as Beasiswa[],
    count: count ?? 0,
  }
}

export async function getBeasiswaForSearch() {
  const { data, error } = await supabase.from('beasiswa').select('judul, url, deskripsi, tags') // Ambil kolom yang relevan

  if (error) {
    console.error('Database Error (getBeasiswaForSearch):', error)
    return []
  }

  // Format data agar sesuai dengan apa yang dibutuhkan KBar nanti
  return data.map((item) => ({
    path: `/beasiswa/${encodeURIComponent(item.url)}`,
    title: item.judul,
    summary: item.deskripsi.length > 0 ? item.deskripsi[0] : '',
    tags: item.tags || [],
  }))
}
