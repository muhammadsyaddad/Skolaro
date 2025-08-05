'use client'

import { KBarSearchProvider } from 'pliny/search/KBar'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

interface SearchItem {
  path: string
  title: string
  summary?: string
  tags: string[]
}

interface SearchProviderProps {
  children: ReactNode
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const router = useRouter()

  return (
    <KBarSearchProvider
      kbarConfig={{
        // ✅ Arahkan ke API yang menyajikan seluruh indeks
        searchDocumentsPath: '/api/search',
        // ✅ onSearchDocumentsLoad akan mengubah format JSON dari API kita
        // agar bisa dibaca oleh KBar.
        onSearchDocumentsLoad(json) {
          return json.map((item: SearchItem) => ({
            id: item.path,
            name: item.title,
            keywords: item.summary || '',
            section: 'Beasiswa',
            subtitle: item.tags.join(', '),
            perform: () => router.push(item.path),
          }))
        },
      }}
    >
      {children}
    </KBarSearchProvider>
  )
}
