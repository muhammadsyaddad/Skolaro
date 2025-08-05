import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import type { Beasiswa } from '@/lib/db/constant'

const MAX_DISPLAY = 5 // Kita hanya akan menampilkan 5 item di halaman utama

// Terima 'beasiswa' sebagai prop, bukan 'posts'
export default function Main({ beasiswa }: { beasiswa: Beasiswa[] }) {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Beasiswa Terbaru
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!beasiswa.length && 'Tidak ada beasiswa ditemukan.'}

          {/* Gunakan .slice() pada 'beasiswa' dan map setiap 'item' */}
          {beasiswa.slice(0, MAX_DISPLAY).map((item) => {
            // Ambil properti dari setiap item beasiswa
            const { url, deadline, judul, deskripsi, tags } = item

            return (
              // Gunakan 'url' sebagai key yang unik
              <li key={url} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Deadline</dt>
                      <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                        <time dateTime={deadline!}>
                          {formatDate(deadline!, siteMetadata.locale)}
                        </time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link
                              href={`/beasiswa/${encodeURIComponent(url)}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {judul}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {/* Tampilkan paragraf pertama dari deskripsi */}
                          {deskripsi && deskripsi[0]}...
                        </div>
                      </div>
                      <div className="text-base leading-6 font-medium">
                        <Link
                          href={`/beasiswa/${encodeURIComponent(url)}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Lihat detail: "${judul}"`}
                        >
                          Lihat Detail &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="flex justify-end text-base leading-6 font-medium">
        <Link
          href="/beasiswa"
          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          aria-label="Semua beasiswa"
        >
          Semua Beasiswa &rarr;
        </Link>
      </div>
    </>
  )
}
