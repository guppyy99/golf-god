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
      const resp = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: 'system',
            content: '당신은 1000년 넘게 골프를 쳐온 골신 할아버지입니다. 사주와 골프를 결합한 운세를 제공합니다. 골신 할아버지의 말투로 친근하지만, 구체적이고 과감한 점지를 해주세요. 각 운세 섹션은 반드시 3-4문장으로 작성하고, 기승전결 구조로 논리적 설명을 해주세요.'
          },
          {
            role: 'user',
            content: `사용자 정보\n- 이름: ${userInfo.name}\n- 생년월일: ${userInfo.birthDate}\n- 생시: ${userInfo.birthTime}\n- 성별: ${userInfo.gender}\n- 핸디: ${userInfo.handicap}\n- 오행: ${analysis.element_name}\n\n중요: 이는 2024년 연간 골프 운세입니다. "이번 주", "오늘", "이번 달" 같은 단기적 표현을 사용하지 마세요. "올해", "이번 해", "연간" 등의 표현을 사용하세요.\n\n작성 규칙:\n- "핸디캡" 대신 "핸디" 구어체 사용\n- 드라이버 거리는 "야드" 단위 사용 금지, "거리" 또는 "비거리"로 표현\n- 핸디 20 이하는 비거리 향상보다 숏게임(퍼팅, 웨지, 아이언) 중심으로 설명\n- 정확한 수치(퍼팅 성공률 80%, 드라이버 250야드 등) 사용 금지\n- 기승전결 구조로 논리적 설명: 원인 → 결과 → 전개 → 결론\n- 각 운세 섹션은 반드시 3-4문장으로 구성\n\n예시 (3문장 구조):\n- overallFlow: "올해는 ${userInfo.name}의 골프 인생에 큰 전환점이 될 거라네. 기존의 불안정한 스윙이 안정화되면서 일관성 있는 플레이가 가능해질 걸세. 특히 숏게임에서 큰 발전이 있을 것이고, 이로 인해 전체적인 스코어가 크게 개선될 거라네."\n- mentalFortune: "올해는 골프 멘탈이 크게 강화되는 해가 될 거라네. 어려운 상황에서도 침착함을 유지할 수 있게 되고, 실패를 두려워하지 않는 마음가짐을 갖게 될 걸세. 긍정적인 사고로 어떤 난관도 극복할 수 있는 해가 될 거라네."\n\n요구사항\n- JSON으로만 응답 (키: summary, overallFlow, mentalFortune, skillFortune, physicalFortune, networkFortune, overallMessage, finalAdvice, luckyClub, luckyHole, luckyItem)\n- summary는 "한마디로 [성격특성]이라네" 형식\n- 각 운세 섹션은 반드시 3-4문장으로 구성 (2문장 절대 금지)\n- 연간 운세이므로 "올해", "이번 해", "연간" 표현 사용\n- 핸디에 맞는 구체적이고 과감한 점지 제공\n- 기승전결 구조로 논리적 설명\n- 골신 할아버지의 말투로 친근하지만 확신에 찬 조언\n- luckyClub은 반드시 드라이버/아이언/웨지/퍼터 중 하나의 단어만\n- luckyHole은 "숫자+번홀" 형식 (예: 10번홀)\n- luckyItem은 "색상+아이템+이모지" 형식 (예: "푸른색 골프화+👟", "빨간색 모자+🧢", "검은색 하의+👖")\n\n반드시 각 섹션마다 3문장 이상으로 작성하세요. 2문장으로 작성하면 안 됩니다.`
          }
        ],
        response_format: { type: 'json_object' }
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