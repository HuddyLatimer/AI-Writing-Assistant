import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { mode, prompt, output, tokens_used } = body

    const { data, error } = await supabase
      .from('generations')
      .insert({
        mode,
        prompt,
        output,
        tokens_used,
        is_bookmarked: false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error saving generation:', error)
    return NextResponse.json(
      { error: 'Failed to save generation' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const bookmarked = searchParams.get('bookmarked')

    let query = supabase
      .from('generations')
      .select('*')
      .order('created_at', { ascending: false })

    if (bookmarked === 'true') {
      query = query.eq('is_bookmarked', true)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching generations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch generations' },
      { status: 500 }
    )
  }
}
