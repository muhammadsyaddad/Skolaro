// app/tags/page.tsx

import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import { getAllTagsWithCounts } from '@/lib/db/data' // Ambil data dari database
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

// SEO untuk halaman
export const metadata: Metadata = {
  title: 'Tags',
  description: `Telusuri beasiswa berdasarkan kategori dan tag di ${siteMetadata.title}`,
}

export default async function TagsPage() {
  // Ambil data tags dari Supabase
  const tags = await getAllTagsWithCounts()
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a])

  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0 dark:divide-gray-700">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14 dark:text-gray-100">
            Tags
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {sortedTags.length === 0 && 'No tags found.'}
          {sortedTags.map((t) => {
            return (
              <div key={t} className="mt-2 mr-5 mb-2">
                <Tag text={t} />
                <Link
                  href={`/tags/${slug(t)}`}
                  className="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300"
                  aria-label={`Lihat beasiswa dengan tag ${t}`}
                >
                  {` (${tags[t]})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
