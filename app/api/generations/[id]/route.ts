import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { is_bookmarked } = body

    const { data, error } = await supabase
      .from('generations')
      .update({ is_bookmarked })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating generation:', error)
    return NextResponse.json(
      { error: 'Failed to update generation' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('generations')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting generation:', error)
    return NextResponse.json(
      { error: 'Failed to delete generation' },
      { status: 500 }
    )
  }
}
