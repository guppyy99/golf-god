import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

export interface UserInfo {
  name: string
  birthDate: string
  birthTime: string
  gender: string
  handicap: number
}

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// CSV 파일에 사용자 데이터 저장
function saveUserDataToCSV(userInfo: UserInfo) {
  try {
    const csvPath = path.join(process.cwd(), 'user_data.csv')
    const csvHeader = '이름,생년월일,생시,성별,핸디캡,등록시간\n'
    const csvRow = `${userInfo.name},${userInfo.birthDate},${userInfo.birthTime},${userInfo.gender},${userInfo.handicap},${new Date().toISOString()}\n`
    
    // 파일이 없으면 헤더 추가
    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, csvHeader, 'utf8')
    }
    
    // 데이터 추가
    fs.appendFileSync(csvPath, csvRow, 'utf8')
    console.log('사용자 데이터가 CSV에 저장되었습니다:', csvPath)
  } catch (error) {
    console.error('CSV 저장 오류:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const userInfo: UserInfo = await request.json()
    
        // 디버깅: 받은 사용자 정보 로그 출력
        console.log('=== API 디버깅 시작 ===')
        console.log('받은 사용자 정보:', userInfo)
        console.log('생년월일:', userInfo.birthDate)
        console.log('핸디:', userInfo.handicap)
    
    // 사용자 데이터를 CSV에 저장
    saveUserDataToCSV(userInfo)
    
    // 사주 기본 정보 계산
    const birthDate = new Date(userInfo.birthDate)
    const year = birthDate.getFullYear()
    const month = birthDate.getMonth() + 1
    const day = birthDate.getDate()
    
    // 오행 계산 (년도 마지막 자리 기준)
    const elements = ['木', '火', '土', '金', '水']
    const elementNames = ['나무', '불', '흙', '금', '물']
    
    // 년도 마지막 자리로 오행 결정
    const lastDigit = year % 10
    const elementIndex = lastDigit % 5
    const element = elements[elementIndex]
    const elementName = elementNames[elementIndex]
    
    // 기본 분석 결과
    const analysis = {
      personality: ['활발하고 도전적', '신중하고 안정적', '창의적이고 예술적', '논리적이고 분석적', '감성적이고 직관적'][elementIndex],
      golfStyle: ['공격적', '안정적', '창의적', '전략적', '감성적'][elementIndex],
      luckyElements: ['파랑', '초록'],
      weakPoints: ['퍼팅', '멘탈'],
      recommendations: ['충분한 워밍업을 하세요', '긍정적인 마음가짐을 유지하세요'],
          element: element,
          element_name: `${element} - ${elementName}의 기운`,
      lucky_numbers: [elementIndex + 1, elementIndex + 6]
    }
    
    // OpenAI API를 사용한 운세 및 행운의 아이템 생성
    let fortuneContent = {}
    let luckyItems = {}
    
    try {
      // API 키 확인
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API 키가 설정되지 않았습니다.')
      }
      
      console.log('OpenAI API 호출 시작...')
      const resp = await openai.chat.completions.create({
        model: "gpt-4o", // gpt-5에서 gpt-4o로 변경 (더 빠름)
        messages: [
          {
            role: 'system',
            content: '당신은 1000년 넘게 골프를 쳐온 골신 할아버지입니다. 사주와 골프를 결합한 운세를 제공합니다. 골신 할아버지의 말투로 친근하지만, 구체적이고 과감한 점지를 해주세요. 각 운세 섹션은 반드시 3-4문장으로 작성하고, 기승전결 구조로 논리적 설명을 해주세요.'
          },
          {
            role: 'user',
            content: `사용자: ${userInfo.name} (${userInfo.birthDate}, ${userInfo.birthTime}, ${userInfo.gender}, 핸디${userInfo.handicap}, ${analysis.element_name})\n\n2024년 골프 운세를 JSON으로 작성해줘.\n\n규칙:\n- 각 섹션은 3-4문장으로 써줘\n- "올해", "이번 해" 같은 말로 써줘\n- 핸디 20 이하는 퍼팅, 웨지 같은 숏게임 위주로 설명해줘\n- 정확한 숫자나 수치는 말하지 마\n- 쉬운 말로, 구어체로 써줘 (전문용어 금지)\n- 골신 할아버지 말투로 친근하게\n\nJSON 키: summary, overallFlow, mentalFortune, skillFortune, physicalFortune, networkFortune, finalAdvice, luckyClub, luckyHole, luckyItem\n\n- summary: "한마디로 [성격]이라네"\n- luckyClub: 드라이버/아이언/웨지/퍼터 중 하나\n- luckyHole: "숫자번홀" 형식\n- luckyItem: "색상+아이템+이모지" 형식`
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1500, // 토큰 수 제한으로 응답 시간 단축
        temperature: 0.8, // 창의성과 일관성의 균형
        top_p: 0.9, // 응답 품질 유지하면서 속도 향상
        frequency_penalty: 0.1, // 반복 방지
        presence_penalty: 0.1 // 다양성 증가
      })

      const content = resp.choices[0]?.message?.content || ''
      if (content) {
        try {
          const parsedContent = JSON.parse(content)
          fortuneContent = {
            summary: parsedContent.summary || `한마디로 ${analysis.personality}이라네`,
            overallFlow: parsedContent.overallFlow,
            mentalFortune: parsedContent.mentalFortune,
            skillFortune: parsedContent.skillFortune,
            physicalFortune: parsedContent.physicalFortune,
            networkFortune: parsedContent.networkFortune,
            overallMessage: parsedContent.overallMessage,
            finalAdvice: parsedContent.finalAdvice
          }
          luckyItems = {
            luckyClub: parsedContent.luckyClub,
            luckyHole: parsedContent.luckyHole,
            luckyItem: parsedContent.luckyItem
          }
        } catch (parseError) {
          console.error('JSON 파싱 오류:', parseError)
          // 파싱 실패 시 기본 운세 사용
          fortuneContent = {
            summary: `한마디로 ${analysis.personality}이라네`,
            overallFlow: `올해 자네 골프 운세는 ${analysis.element_name}의 기운이 강하게 들어와 있네. ${analysis.personality}한 성격으로 ${analysis.golfStyle}한 플레이가 잘 맞을 걸세.`,
            mentalFortune: `골프는 멘탈이 절반이야. 올해 자네는 OB나 해저드에 빠져도, 그 다음 샷에 집중하면 흐름이 다시 살아날 거라네.`,
            skillFortune: `드라이버은 아직 들쑥날쑥하지만, 올해는 숏게임에서 성과가 크게 보일 걸세.`,
            physicalFortune: `몸의 기운이 순환하는 해라, 무리하게 치는 것보다 라운딩 뒤 회복과 스트레칭이 중요하다네.`,
            networkFortune: `동반자 운이 강하게 들어와 있네. 좋은 멘토 같은 골퍼를 만날 기회가 있겠구먼.`,
            overallMessage: `올해 자네 골프 운세는 말이야, "한 방에 확 튀어 오르는 해"가 아니라, 땅을 다지고 천천히 기초를 세우는 해라네.`,
            finalAdvice: `허허, 그러니 너무 조급해 말고… 올해는 드라이버와 멘탈, 그리고 기본기만 믿고 가면, 자네 골프 인생에 큰 길이 열릴 걸세. ${userInfo.name}아, 오늘도 즐거운 라운드 되게!`
          }
          luckyItems = {
            luckyClub: userInfo.handicap < 20 ? "Srixon ZXi5" : "XXIO 13 Irons",
            luckyHole: `${analysis.lucky_numbers[0]}번홀`,
            luckyItem: analysis.element === '木' ? '파란색 상의' : 
                       analysis.element === '火' ? '빨간색 모자' : 
                       analysis.element === '土' ? '갈색 하의' : 
                       analysis.element === '金' ? '흰색 상의' : '검은색 모자'
          }
        }
      }
    } catch (openaiError) {
      console.error('OpenAI API 오류:', openaiError)
      console.error('오류 상세:', {
        message: openaiError.message,
        status: openaiError.status,
        type: openaiError.type
      })
      // API 오류 시 기본 운세 사용
      fortuneContent = {
        summary: `한마디로 ${analysis.personality}이라네`,
        overallFlow: `올해 자네 골프 운세는 ${analysis.element_name}의 기운이 강하게 들어와 있네. ${analysis.personality}한 성격으로 ${analysis.golfStyle}한 플레이가 잘 맞을 걸세.`,
        mentalFortune: `골프는 멘탈이 절반이야. 올해 자네는 OB나 해저드에 빠져도, 그 다음 샷에 집중하면 흐름이 다시 살아날 거라네.`,
        skillFortune: `드라이버은 아직 들쑥날쑥하지만, 올해는 숏게임에서 성과가 크게 보일 걸세.`,
        physicalFortune: `몸의 기운이 순환하는 해라, 무리하게 치는 것보다 라운딩 뒤 회복과 스트레칭이 중요하다네.`,
        networkFortune: `동반자 운이 강하게 들어와 있네. 좋은 멘토 같은 골퍼를 만날 기회가 있겠구먼.`,
        overallMessage: `올해 자네 골프 운세는 말이야, "한 방에 확 튀어 오르는 해"가 아니라, 땅을 다지고 천천히 기초를 세우는 해라네.`,
        finalAdvice: `허허, 그러니 너무 조급해 말고… 올해는 드라이버와 멘탈, 그리고 기본기만 믿고 가면, 자네 골프 인생에 큰 길이 열릴 걸세. ${userInfo.name}아, 오늘도 즐거운 라운드 되게!`
      }
      luckyItems = {
        luckyClub: userInfo.handicap < 20 ? "Srixon ZXi5" : "XXIO 13 Irons",
        luckyHole: `${analysis.lucky_numbers[0]}번홀`,
        luckyItem: analysis.element === '木' ? '파란색 상의' : 
                   analysis.element === '火' ? '빨간색 모자' : 
                   analysis.element === '土' ? '갈색 하의' : 
                   analysis.element === '金' ? '흰색 상의' : '검은색 모자'
      }
    }
    
    const fortune = {
      title: fortuneContent,
      ...luckyItems
    }
    
    return NextResponse.json({
      phase: 'complete',
      analysis,
      fortune,
    })

  } catch (error) {
    console.error('Error in analyze-user API:', error)
    return NextResponse.json(
      { error: 'Failed to analyze user info' },
      { status: 500 }
    )
  }
}