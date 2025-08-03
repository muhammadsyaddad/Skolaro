import { createBeasiswaCrawler } from '../lib/crawler/crawler.js'
import { indbeasiswaConfig, beasiswakitaConfig } from '../lib/crawler/config.js'

async function main() {
  console.log('🚀 Memulai proses crawling...')

  // Menjalankan crawler untuk beasiswakita.com
  console.log('\n🔥 Memulai crawler untuk beasiswakita.com...')
  const crawlerBeasiswaKita = createBeasiswaCrawler(beasiswakitaConfig, 'beasiswakita')
  await crawlerBeasiswaKita.run([beasiswakitaConfig.url])
  console.log('✅ Crawler beasiswakita.com selesai.')

  // Menjalankan crawler untuk indbeasiswa.com
  console.log('\n🔥 Memulai crawler untuk indbeasiswa.com...')
  const crawlerIndBeasiswa = createBeasiswaCrawler(indbeasiswaConfig, 'indbeasiswa')
  await crawlerIndBeasiswa.run([indbeasiswaConfig.url])
  console.log('✅ Crawler indbeasiswa.com selesai.')
}

main().catch((err) => console.error('❌ Terjadi error pada proses utama:', err))
