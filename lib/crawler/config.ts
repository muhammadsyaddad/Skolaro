import type { Cheerio, CheerioAPI } from 'cheerio'
import { BeasiswaInfo } from '../constant.js'

// Interface untuk mendefinisikan "resep" scraper
export interface ScraperConfig {
  // sourceName: string; <-- Dihapus
  url: string
  globs: string[]
  contentSelector: string
  titleSelector: string
  tagsSelector: string
  maxRequestsPerCrawl?: number
  // Diubah agar menerima 'content' untuk pencarian yang lebih efisien
  extractData: ($: CheerioAPI, content: Cheerio<any>) => Partial<BeasiswaInfo>
}

// Konfigurasi untuk situs pertama (indbeasiswa.com)
export const indbeasiswaConfig: ScraperConfig = {
  // sourceName: "indbeasiswa", <-- Dihapus
  url: 'https://indbeasiswa.com/beasiswa-unggulan/',
  globs: ['https://indbeasiswa.com/beasiswa-*'],
  maxRequestsPerCrawl: 300,
  contentSelector: '.entry-content',
  titleSelector: 'h1.post-title',
  tagsSelector: 'span.post-category a',
  extractData: ($, content) => {
    // 'content' sekarang diterima
    const info: Partial<BeasiswaInfo> = {
      persyaratan: [],
      benefit: [],
      kampus: [],
    }
    const stopSelector = 'h2, h3, #post-related, .social'

    content.find('h2, h3').each((_, heading) => {
      const headingText = $(heading).text().trim().toLowerCase()
      const sectionContent = $(heading).nextUntil(stopSelector)
      const items = sectionContent
        .find('li')
        .map((_, li) => $(li).text().trim())
        .get()

      if (/persyaratan|kriteria|berkas/.test(headingText)) info.persyaratan?.push(...items)
      if (/cakupan|benefit|fasilitas/.test(headingText)) info.benefit?.push(...items)
      if (/kampus mitra/.test(headingText)) info.kampus?.push(...items)
    })
    return info
  },
}

// Konfigurasi untuk situs KEDUA (beasiswakita.com)
export const beasiswakitaConfig: ScraperConfig = {
  // sourceName: "beasiswakita", <-- Dihapus
  url: 'https://www.beasiswakita.com/',
  globs: ['https://www.beasiswakita.com/20*/*/*.html'],
  maxRequestsPerCrawl: 300,
  contentSelector: '.post-body.entry-content',
  titleSelector: 'h3.post-title.entry-title',
  tagsSelector: ".breadcrumb-bwrap a[rel='tag']",
  extractData: ($, content) => {
    // 'content' sekarang diterima
    const info: Partial<BeasiswaInfo> = {
      persyaratan: [],
      benefit: [],
      deadline: null,
    }

    content.find('h2, h3, b').each((_, heading) => {
      const headingText = $(heading).text().trim().toLowerCase()
      const itemsList = $(heading)
        .next('ul')
        .find('li')
        .map((_, li) => $(li).text().trim())
        .get()

      if (itemsList.length > 0) {
        if (/persyaratan|kriteria|berkas/.test(headingText)) info.persyaratan?.push(...itemsList)
        if (/cakupan|benefit|fasilitas|keuntungan/.test(headingText))
          info.benefit?.push(...itemsList)
      }

      if (/deadline|batas akhir|pendaftaran/.test(headingText)) {
        const match = $(heading)
          .text()
          .match(/:\s*(.*)/)
        if (match && match[1]) {
          info.deadline = match[1].trim()
        }
      }
    })

    return info
  },
}
