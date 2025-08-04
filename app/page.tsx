import { getBeasiswa } from '@/lib/db/data'
import Main from './Main'

export default async function Page() {
  // Ambil data halaman pertama dari fungsi yang kita buat
  const { data: beasiswa } = await getBeasiswa(1)

  // Kirim data tersebut ke komponen Main melalui prop 'beasiswa'
  return <Main beasiswa={beasiswa} />
}
