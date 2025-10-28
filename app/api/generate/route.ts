import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

export const runtime = 'edge'

const PROMPTS = {
  email: 'Write a professional email based on the following requirements:',
  'blog-post': 'Write an engaging blog post based on the following topic:',
  'social-media': 'Create a compelling social media caption based on:',
  'code-comments': 'Generate clear and helpful code comments for:',
  'product-description': 'Write a persuasive product description for:',
}

export async function POST(req: Request) {
  console.log('=== API Route Called ===')

  try {
    const { prompt, mode } = await req.json()
    console.log('Received prompt:', prompt)
    console.log('Received mode:', mode)

    if (!prompt) {
      console.log('Missing prompt!')
      return new Response('Missing required fields', { status: 400 })
    }

    const systemPrompt = PROMPTS[mode as keyof typeof PROMPTS] || PROMPTS.email
    console.log('System prompt:', systemPrompt)
    console.log('API Key exists:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY)

    console.log('Starting streamText...')
    const result = streamText({
      model: google('gemini-2.0-flash-exp'),
      system: systemPrompt,
      prompt: prompt,
      temperature: 0.7,
    })

    console.log('Awaiting result...')
    const awaitedResult = await result
    console.log('Result received:', awaitedResult)

    // Create a readable stream from the text stream
    const encoder = new TextEncoder()
    let chunkCount = 0

    const stream = new ReadableStream({
      async start(controller) {
        console.log('Stream started')
        try {
          console.log('Starting to iterate textStream...')
          for await (const chunk of awaitedResult.textStream) {
            chunkCount++
            console.log(`Chunk #${chunkCount}:`, chunk)
            controller.enqueue(encoder.encode(chunk))
          }
          console.log(`Total chunks sent: ${chunkCount}`)
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        } finally {
          console.log('Closing stream')
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error generating content:', error)
    return new Response('Error generating content', { status: 500 })
  }
}
