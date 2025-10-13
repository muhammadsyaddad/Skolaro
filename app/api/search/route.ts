// app/api/search/route.ts

import { NextResponse } from 'next/server'
import { getBeasiswaForSearch } from '@/lib/db/data'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const searchIndex = await getBeasiswaForSearch()
    return NextResponse.json(searchIndex)
  } catch (error) {
    return NextResponse.json({ error: 'Gagal membuat indeks pencarian' }, { status: 500 })
  }
}
