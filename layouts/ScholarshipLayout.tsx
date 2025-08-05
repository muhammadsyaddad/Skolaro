import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import Tag from '@/components/Tag'
import Link from '@/components/Link'
import type { Beasiswa } from '@/lib/db/constant'
import { formatDate } from 'pliny/utils/formatDate'

interface LayoutProps {
  beasiswa: Beasiswa
}

export default function ScholarshipLayout({ beasiswa }: LayoutProps) {
  const { judul, deadline, tags, deskripsi, persyaratan, benefit, kampus, link_pendaftaran } =
    beasiswa

  // Ambil deskripsi pertama untuk summary SEO
  const summary = deskripsi && deskripsi.length > 0 ? deskripsi[0] : 'Informasi beasiswa.'

  return (
    <SectionContainer>
      {/* Komponen SEO untuk mengatur <head> tag secara dinamis */}

      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Deadline</dt>
                  <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                    <time dateTime={deadline!}>
                      Deadline: {formatDate(deadline!, siteMetadata.locale)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{judul}</PageTitle>
              </div>
            </div>
          </header>

          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
            <footer>
              <div className="divide-gray-200 text-sm leading-5 font-medium xl:col-start-1 xl:row-start-2 xl:divide-y dark:divide-gray-700">
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                <div className="py-4 xl:py-8">
                  {/*<Link
                    href={link_pendaftaran!}
                    className="bg-primary-500 hover:bg-primary-600 w-full rounded-md px-4 py-2 text-center font-medium text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Kunjungi Pendaftaran
                  </Link>*/}
                  <Link
                    href={link_pendaftaran!}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label="Semua beasiswa"
                  >
                    Link Pendaftaran &rarr;
                  </Link>
                </div>
              </div>
            </footer>
            {/* Kolom utama untuk konten */}
            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              <div className="prose dark:prose-invert max-w-none pt-10 pb-8">
                {/* Kita render setiap bagian di sini */}
                <h2>Deskripsi</h2>
                {deskripsi.map((paragraf, index) => (
                  <p key={`desc-${index}`}>{paragraf}</p>
                ))}

                <h2>Persyaratan</h2>
                <ul>
                  {persyaratan.map((syarat, index) => (
                    <li key={`req-${index}`}>{syarat}</li>
                  ))}
                </ul>

                <h2>Benefit</h2>
                <ul>
                  {benefit.map((item, index) => (
                    <li key={`ben-${index}`}>{item}</li>
                  ))}
                </ul>

                <h2>Kampus Mitra</h2>
                <ul>
                  {kampus.map((item, index) => (
                    <li key={`kampus-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar untuk tags dan link */}
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
