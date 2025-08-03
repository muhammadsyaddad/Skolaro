import type { Cheerio, CheerioAPI, Element } from 'cheerio'

// ... (fungsi extractOfficialLink tetap sama)

/**
 * Helper untuk mengekstrak teks dari list <li> di dalam sebuah section.
 * Ini adalah solusi untuk error TypeScript di screenshot-mu.
 * @param {Cheerio<Element>} section - Objek Cheerio yang berisi elemen <ul> atau <ol>.
 * @param {CheerioAPI} $ - Instance Cheerio utama.
 * @returns {string[]} Array berisi teks dari setiap <li>.
 */
export function extractListItems(section: Cheerio<Element>, $: CheerioAPI): string[] {
  const items: string[] = []

  // Beri tipe pada parameter `li` untuk mengatasi error 'implicitly has an any type'
  section.find('li').each((_, li: Element) => {
    const text = $(li).text().trim().replace(/\s+/g, ' ') // Membersihkan spasi berlebih
    if (text) {
      items.push(text)
    }
  })

  return items
}
