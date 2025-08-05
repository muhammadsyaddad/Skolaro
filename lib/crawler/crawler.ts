import { PlaywrightCrawler } from 'crawlee'
import { ScraperConfig } from './config.js'
import { Beasiswa } from '@/lib/db/constant'
import { extractListItems } from './helperCrawler.js'
import { supabase } from '@/lib/db/supabaseClient' // <-- Ganti import fs dengan supabase

export function createBeasiswaCrawler(config: ScraperConfig, sourceName: string) {
  // Tambahkan sourceName di sini
  return new PlaywrightCrawler({
    maxRequestsPerCrawl: config.maxRequestsPerCrawl ?? 300,
    navigationTimeoutSecs: 120000, // Tambahkan timeout yang lebih lama
    async requestHandler({ page, parseWithCheerio, request, enqueueLinks }: any) {
      try {
        console.log(`[${sourceName}] 🤖 Mengunjungi: ${request.url}`)
        await page.waitForSelector(config.contentSelector, { timeout: 30000 })

        const $ = await parseWithCheerio()
        const content = $(config.contentSelector)

        const info: Beasiswa = {
          url: request.url,
          judul: $(config.titleSelector).text().trim(),
          tags: $(config.tagsSelector)
            .map((_, el) => $(el).text().trim())
            .get(),
          deskripsi: [content.find("div[style*='text-align: justify']").first().text().trim()],
          // sumber: sourceName, <-- Dihapus dari BeasiswaInfo, jadi tidak perlu diisi
          link_pendaftaran:
            content
              .find('a[href*="daftar"], a[href*="apply"], a[href*="register"]')
              .first()
              .attr('href') || null,
          deadline: null,
          persyaratan: [],
          benefit: [],
          kampus: [],
        }

        const specificData = config.extractData($ as any, content as any)
        Object.assign(info, specificData)

        // --- Logika Penyimpanan Diubah ke Supabase ---
        if (info.judul && (info.persyaratan.length > 0 || info.benefit.length > 0)) {
          console.log(`[${sourceName}] 💾 Menyimpan data: ${info.judul}`)

          const dataToUpsert = { ...info, sumber: sourceName } // Tambahkan 'sumber' saat upsert

          const { error } = await supabase
            .from('beasiswa')
            .upsert(dataToUpsert, { onConflict: 'url' })

          if (error) {
            console.error(`❌ [Supabase] Gagal menyimpan ${info.url}:`, error.message)
          } else {
            console.log(`✔ [Supabase] Data berhasil disimpan: ${info.url}`)
          }
        } else {
          console.log(`⚠ [${sourceName}] Tidak cukup info di ${request.url}, skip.`)
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`❌ [${sourceName}] Gagal di ${request.url}: ${error.message}`)
        }
      }

      await enqueueLinks({ globs: config.globs, strategy: 'same-domain' })
    },
    async errorHandler({ request, log }) {
      log.error(`URL gagal total: ${request.url}`)
    },
  })
}
