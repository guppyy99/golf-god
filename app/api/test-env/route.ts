import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envStatus = {
      openai_api_key: process.env.OPENAI_API_KEY ? '설정됨' : '설정 안됨',
      ollama_api_key: process.env.OLLAMA_API_KEY ? '설정됨' : '설정 안됨',
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json({
      status: 'success',
      environment: envStatus,
      message: '환경변수 상태 확인 완료'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        error: error.message,
        environment: {
          openai_api_key: '확인 실패',
          ollama_api_key: '확인 실패'
        }
      },
      { status: 500 }
    )
  }
}
