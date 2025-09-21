import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export interface UserInfo {
  name: string
  phoneNumber?: string
  birthDate: string
  birthTime: string
  gender: string
  handicap: number
  countryClub?: string
  ironBrand?: string
  driverBrand?: string
  wedgeBrand?: string
  putterBrand?: string
  ballBrand?: string
}

export interface FortuneAnalysis {
  phase: 'analyzing' | 'generating' | 'complete'
  analysis?: {
    personality: string
    golfStyle: string
    luckyElements: string[]
    weakPoints: string[]
    recommendations: string[]
  }
  fortune?: {
    title: string | object
    luckyClub: string
    luckyHole: string
    luckyItem: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const userInfo: UserInfo = await request.json()
    
    // 페이즈 2: 사용자 정보 분석
    const analysis = await analyzeUserInfo(userInfo)
    
    // 페이즈 3: OLLAMA API로 직접 운세 생성
    let fortune
    try {
      fortune = await generateFortuneWithOllama(userInfo, analysis)
      console.log('OLLAMA API로 운세 생성 완료')
    } catch (error) {
      console.log('OLLAMA API 실패, 기본 운세로 대체...')
      fortune = await generateDefaultFortune(userInfo, analysis)
    }
    
    // JSON 형태로 저장
    const result = {
      userInfo,
      analysis,
      fortune,
      timestamp: new Date().toISOString()
    }
    
    // 로컬 저장 (실제로는 DB에 저장)
    const saveResult = await saveUserData(result)
    
    return NextResponse.json({
      phase: 'complete',
      analysis,
      fortune,
      exportInfo: saveResult
    })
    
  } catch (error) {
    console.error('Error in analyze-user API:', error)
    return NextResponse.json(
      { error: 'Failed to analyze user info' },
      { status: 500 }
    )
  }
}

async function analyzeUserInfo(userInfo: UserInfo) {
  try {
    // Python 스크립트를 통해 사주 계산
    const sajuData = await computeSaju(userInfo)
    
    // 사주 데이터를 바탕으로 골프 성격 분석
    const analysis = {
      personality: sajuData.personality,
      golfStyle: sajuData.golf_style,
      luckyElements: Array.isArray(sajuData.lucky_elements) && sajuData.lucky_elements.length > 0 
        ? (Array.isArray(sajuData.lucky_elements[0]) ? sajuData.lucky_elements[0] : sajuData.lucky_elements)
        : ['파랑'], // 색상
      weakPoints: sajuData.weaknesses,
      recommendations: sajuData.recommendations,
      sajuSummary: sajuData.saju_summary,
      element: sajuData.element,
      element_name: sajuData.element_name,
      element_description: sajuData.element_description,
      lucky_numbers: sajuData.lucky_numbers
    }
    
    return analysis
  } catch (error) {
    console.error('사주 계산 오류:', error)
    // 오류 시 기본 분석 반환
    return {
      personality: '활발하고 도전적',
      golfStyle: '균형적',
      luckyElements: ['파랑'],
      weakPoints: ['퍼팅'],
      recommendations: ['충분한 워밍업을 하세요'],
      sajuSummary: '사주 계산 실패',
      element: '木'
    }
  }
}

async function computeSaju(userInfo: UserInfo) {
  try {
    // JavaScript로 사주 계산 구현
    const birthDate = new Date(userInfo.birthDate)
    const year = birthDate.getFullYear()
    const month = birthDate.getMonth() + 1
    const day = birthDate.getDate()
    const hour = parseInt(userInfo.birthTime.split(':')[0])
    
    // 간단한 사주 계산 로직
    const elements = ['木', '火', '土', '金', '水']
    const element = elements[year % 5]
    
    const personalities = [
      '활발하고 도전적',
      '신중하고 안정적', 
      '창의적이고 예술적',
      '논리적이고 분석적',
      '감성적이고 직관적'
    ]
    
    const golfStyles = [
      '공격적',
      '안정적',
      '창의적',
      '전략적',
      '감성적'
    ]
    
    const strengths = [
      ['드라이버', '아이언'],
      ['퍼팅', '아이언'],
      ['웨지', '퍼팅'],
      ['아이언', '드라이버'],
      ['퍼팅', '웨지']
    ]
    
    const weaknesses = [
      ['퍼팅', '멘탈'],
      ['드라이버', '거리'],
      ['아이언', '정확도'],
      ['웨지', '감각'],
      ['드라이버', '아이언']
    ]
    
    const luckyElements = [
      ['파랑', '초록'],
      ['빨강', '주황'],
      ['노랑', '갈색'],
      ['흰색', '회색'],
      ['검정', '보라']
    ]
    
    const recommendations = [
      ['충분한 워밍업을 하세요', '긍정적인 마음가짐을 유지하세요'],
      ['신중한 클럽 선택을 하세요', '안정적인 스윙을 유지하세요'],
      ['창의적인 샷을 시도해보세요', '감각적인 퍼팅을 연습하세요'],
      ['전략적인 코스 관리가 필요합니다', '논리적인 플레이를 하세요'],
      ['직관을 믿고 플레이하세요', '감성적인 골프를 즐기세요']
    ]
    
    const elementIndex = year % 5
    
    return {
      element: element,
      day_gan: "甲",
      month_gan: "甲", 
      year_gan: "甲",
      day_zhi: "子",
      hour_gan: "甲",
      hour_zhi: "子",
      lunar_date: `${year}년 ${month}월 ${day}일`,
      solar_date: userInfo.birthDate,
      saju_summary: `${element} 오행의 기운을 가진 ${personalities[elementIndex]}한 성격`,
      personality: personalities[elementIndex],
      golf_style: golfStyles[elementIndex],
      strengths: strengths[elementIndex],
      weaknesses: weaknesses[elementIndex],
      lucky_elements: luckyElements[elementIndex],
      recommendations: recommendations[elementIndex],
      element_name: `${element} - ${element === '木' ? '나무' : element === '火' ? '불' : element === '土' ? '흙' : element === '金' ? '금' : '물'}의 기운`,
      element_description: element === '木' ? '성장과 발전의 기운' : 
                          element === '火' ? '열정과 활력의 기운' :
                          element === '土' ? '안정과 신뢰의 기운' :
                          element === '金' ? '정의와 결단의 기운' : '지혜와 유연성의 기운',
      lucky_numbers: [elementIndex + 1, elementIndex + 6]
    }
  } catch (error) {
    console.error('사주 계산 오류:', error)
    // 기본값 반환
    return {
      element: "木",
      day_gan: "甲",
      month_gan: "甲",
      year_gan: "甲", 
      day_zhi: "子",
      hour_gan: "甲",
      hour_zhi: "子",
      lunar_date: "기본값",
      solar_date: "기본값",
      saju_summary: "기본 사주",
      personality: "활발하고 도전적",
      golf_style: "균형적",
      strengths: ["드라이버"],
      weaknesses: ["퍼팅"],
      lucky_elements: ["파랑"],
      recommendations: ["충분한 워밍업을 하세요"],
      element_name: "목(木) - 나무의 기운",
      element_description: "성장과 발전의 기운",
      lucky_numbers: [3, 8]
    }
  }
}

// OLLAMA 구독 API로 직접 운세 생성
async function generateFortuneWithOllama(userInfo: UserInfo, analysis: any) {
  try {
    // OLLAMA API 키 확인
    if (!process.env.OLLAMA_API_KEY) {
      throw new Error('OLLAMA API 키가 설정되지 않았습니다')
    }
    
    console.log('OLLAMA 구독 API 호출 시작...')
    
    // OLLAMA 구독 서비스 API 호출
    const response = await fetch('https://api.ollama.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-oss:20b',
        prompt: createFortunePrompt(userInfo, analysis),
        stream: false,
        options: {
          temperature: 0.8,
          top_p: 0.9,
          num_predict: 1500
        }
      })
    })

    if (!response.ok) {
      throw new Error(`OLLAMA API 오류: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('OLLAMA 응답 받음')
    
    if (data.response) {
      const fortune = parseFortuneResponse(data.response, userInfo, analysis)
      console.log('운세 파싱 완료')
      return fortune
    } else {
      throw new Error('OLLAMA 응답에 response 필드가 없습니다')
    }
  } catch (error) {
    console.error('OLLAMA API 운세 생성 오류:', error)
    throw error
  }
}

// 백업용 GPT 함수 (OLLAMA 실패시 사용)
async function generateFortuneWithGPT(userInfo: UserInfo, analysis: any) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API 키가 없습니다')
    }
    
    console.log('백업 GPT 모델 호출...')
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `당신은 골프의 신 '골신' 할아버지입니다. 100년 넘게 골프를 지켜본 신선으로서, 사용자의 운세를 봐주세요.`
          },
          {
            role: 'user',
            content: createFortunePrompt(userInfo, analysis)
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API 오류: ${response.status}`)
    }

    const data = await response.json()
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return parseFortuneResponse(data.choices[0].message.content, userInfo, analysis)
    }
    throw new Error('OpenAI 응답 파싱 실패')
  } catch (error) {
    console.error('GPT 백업 오류:', error)
    throw error
  }
}

function createFortunePrompt(userInfo: UserInfo, analysis: any): string {
  return `당신은 골프의 신 '골신' 할아버지입니다. 100년 넘게 골프를 지켜본 신선으로서, 사용자의 운세를 봐주세요.

=== 사용자 정보 ===
- 이름: ${userInfo.name}
- 생년월일: ${userInfo.birthDate}
- 성별: ${userInfo.gender}
- 핸디캡: ${userInfo.handicap}
- 방문 예정 CC: ${userInfo.get?.('countryClub') || '미정'}

=== 사주 분석 결과 ===
- 사주: ${analysis.saju_summary || '기본 사주'}
- 오행: ${analysis.element || '木'} (${analysis.element_name || '목'})
- 성격: ${analysis.personality || '활발하고 도전적'}
- 골프 스타일: ${analysis.golf_style || '균형적'}
- 강점: ${Array.isArray(analysis.strengths) ? analysis.strengths.join(', ') : analysis.strengths || '드라이버'}
- 약점: ${Array.isArray(analysis.weaknesses) ? analysis.weaknesses.join(', ') : analysis.weaknesses || '퍼팅'}
- 행운 요소: ${Array.isArray(analysis.lucky_elements) ? analysis.lucky_elements.join(', ') : analysis.lucky_elements || '파랑'}
- 행운의 클럽: ${analysis.lucky_club || '아이언'}
- 행운의 볼: ${analysis.lucky_ball || '타이틀리스트 Pro V1'}
- 행운의 TPO: ${analysis.lucky_tpo || '청색 상의'}

=== 요청사항 ===
골신 할아버지 톤으로 다음 형식에 맞춰 운세를 작성해주세요:

[인사말]
좋네… 자네 ${userInfo.name}의 운세를 보자고 했지?
생년월일 보니, ${userInfo.birthDate}생… ${userInfo.birthTime || '낮'}에 태어난 ${userInfo.gender}라구? 음, 기운이 뚜렷하네.

:골프를_치는_${userInfo.gender}: 전반 기류
[올해 골프 운세에 대한 전반적인 이야기 - 3-4문장]

:대체로_맑음: 세부 운세

멘탈 운
[멘탈 관리에 대한 운세 - 2-3문장]

기술 운
[기술적 측면의 운세 - 2-3문장]

체력 운
[체력과 건강에 대한 운세 - 2-3문장]

인맥 운
[인간관계와 동반자에 대한 운세 - 2-3문장]

:골프: 종합
[올해 전체적인 메시지와 조언 - 3-4문장]

[마무리 한줄]
허허, 그러니 너무 조급해 말고… [간단한 조언 한 문장]

=== 작성 규칙 ===
- 할아버지 톤으로 "자네", "~라네", "~구먼", "~걸세" 사용
- 사주 정보를 자연스럽게 언급하면서 운세 설명
- 현실적이면서도 희망적인 조언 제공
- 과도한 확정 표현은 피하고, "~일 걸세", "~할 거라네" 등 사용
- 이모지는 적절히 사용하되 과하지 않게`
}

function parseFortuneResponse(response: string, userInfo: UserInfo, analysis: any) {
  try {
    console.log('OLLAMA 응답:', response)
    
    // 골신 할아버지 스타일 응답 파싱
    const greetingMatch = response.match(/좋네…[\s\S]*?기운이 뚜렷하네\./i)
    const generalMatch = response.match(/:골프를_치는_[^:]+:\s*전반\s*기류\s*([\s\S]*?)(?=:대체로_맑음:|$)/i)
    const mentalMatch = response.match(/멘탈\s*운\s*([\s\S]*?)(?=기술\s*운|$)/i)
    const skillMatch = response.match(/기술\s*운\s*([\s\S]*?)(?=체력\s*운|$)/i)
    const healthMatch = response.match(/체력\s*운\s*([\s\S]*?)(?=인맥\s*운|$)/i)
    const networkMatch = response.match(/인맥\s*운\s*([\s\S]*?)(?=:골프:\s*종합|$)/i)
    const summaryMatch = response.match(/:골프:\s*종합\s*([\s\S]*?)(?=\[마무리|$)/i)
    const finalMatch = response.match(/허허, 그러니 너무 조급해 말고…\s*([\s\S]*?)$/i)
    
    console.log('골신 응답 파싱 결과:')
    console.log('인사말:', greetingMatch ? '매칭됨' : '매칭 안됨')
    console.log('전반 기류:', generalMatch ? '매칭됨' : '매칭 안됨')
    console.log('멘탈 운:', mentalMatch ? '매칭됨' : '매칭 안됨')
    console.log('기술 운:', skillMatch ? '매칭됨' : '매칭 안됨')
    console.log('체력 운:', healthMatch ? '매칭됨' : '매칭 안됨')
    console.log('인맥 운:', networkMatch ? '매칭됨' : '매칭 안됨')
    console.log('종합:', summaryMatch ? '매칭됨' : '매칭 안됨')
    console.log('마무리:', finalMatch ? '매칭됨' : '매칭 안됨')
    
    // 동적 행운 아이템 생성 (핸디캡 정보 포함)
    const luckyClub = analysis?.lucky_club || getLuckyClubFromStrengths(analysis?.strengths, userInfo.handicap)
    const luckyHole = getLuckyHoleFromNumbers(analysis?.lucky_numbers)
    const luckyItem = getLuckyItemFromElement(analysis?.element)
    
    return {
      title: response, // 전체 골신 할아버지 응답을 title로 사용
      luckyClub: luckyClub,
      luckyHole: luckyHole,
      luckyItem: luckyItem,
      roundFortune: generalMatch ? generalMatch[1].trim() : "올해는 기초를 다지는 해가 될 것 같네요.",
      bettingFortune: mentalMatch ? mentalMatch[1].trim() : "멘탈이 절반이라네. 긍정적인 마음가짐을 유지하세요.",
      strategyFortune: skillMatch ? skillMatch[1].trim() : "기술적 측면에서 꾸준한 연습이 필요하겠네요.",
      scoreFortune: healthMatch ? healthMatch[1].trim() : "체력 관리가 중요한 한 해가 될 것 같습니다.",
      courseFortune: networkMatch ? networkMatch[1].trim() : "좋은 동반자와 함께하는 골프가 운을 높일 거라네.",
      quote: finalMatch ? finalMatch[1].trim() : "오늘도 즐거운 라운드 되세요."
    }
  } catch (error) {
    console.error('응답 파싱 오류:', error)
    return generateDefaultFortune(userInfo, analysis)
  }
}

// 골프 클럽 추천 테이블 데이터
const CLUB_RECOMMENDATIONS = [
  { brand: 'Srixon', category: '드라이버', model: 'ZXi', year: 2025, level: '중급자~고급자', features: '낮은 스핀, 조정 가능한 무게 포함됨' },
  { brand: 'Srixon', category: '드라이버', model: 'ZXi Max', year: 2025, level: '초급자~중급자', features: '관용성 큼' },
  { brand: 'Srixon', category: '드라이버', model: 'ZXi LS', year: 2025, level: '고급자', features: '스핀 제어 쪽 강함' },
  { brand: 'Srixon', category: '드라이버', model: 'ZX5 Mk II', year: 2023, level: '중급자', features: '거리+관용성 균형' },
  { brand: 'Srixon', category: '드라이버', model: 'ZX7 Mk II', year: 2023, level: '고급자', features: '작업 가능성 있음' },
  { brand: 'Srixon', category: '아이언', model: 'ZXi4', year: 2025, level: '초급자~중급자', features: '치기 쉬운 설계' },
  { brand: 'Srixon', category: '아이언', model: 'ZXi5', year: 2025, level: '중급자', features: '느낌+관용성 균형' },
  { brand: 'Srixon', category: '아이언', model: 'ZXi7', year: 2025, level: '고급자', features: '컴팩트, 정확도 높음' },
  { brand: 'Srixon', category: '아이언', model: 'ZX4 Mk II', year: 2025, level: '초급자', features: '최고 관용성' },
  { brand: 'XXIO', category: '드라이버', model: 'XXIO 13 Driver', year: 2024, level: '초급자~중급자', features: '가벼움 + 높은 런치' },
  { brand: 'XXIO', category: '아이언', model: 'XXIO 13 Irons', year: 2024, level: '초급자~중급자', features: '쉬운 런치, 미스샷 보완' },
  { brand: 'XXIO', category: '우드/하이브리드', model: 'XXIO 13 Fairway / Hybrid', year: 2024, level: '초급자~중급자', features: '비행 안정성' },
  { brand: 'Cleveland', category: '웨지', model: 'RTZ Tour Satin Wedge', year: 2025, level: '중급자~고급자', features: 'Z-Alloy, 다양한 그라인드' },
  { brand: 'Cleveland', category: '웨지', model: 'RTZ Tour Rack Full-Face Wedge', year: 2025, level: '고급자', features: '풀 페이스, 정밀 스핀' },
  { brand: 'Cleveland', category: '아이언', model: 'ZipCore XL Irons', year: 2024, level: '초급자~중급자', features: '관용성 + 쉬운 런치' }
]

// 핸디캡에 따른 레벨 분류
function getHandicapLevel(handicap: number): string {
  if (handicap < 10) return '고급자'
  if (handicap < 20) return '중급자'
  return '초급자'
}

// 카테고리에 따른 클럽 추천
function getLuckyClubFromStrengths(strengths: string[], handicap: number) {
  const level = getHandicapLevel(handicap)
  
  // 강점에 따른 카테고리 매핑
  let targetCategory = '아이언' // 기본값
  
  if (Array.isArray(strengths)) {
    if (strengths.includes('드라이버')) targetCategory = '드라이버'
    else if (strengths.includes('아이언')) targetCategory = '아이언'
    else if (strengths.includes('퍼팅')) targetCategory = '퍼터'
    else if (strengths.includes('웨지')) targetCategory = '웨지'
  }
  
  // 해당 카테고리와 레벨에 맞는 클럽 찾기
  const suitableClubs = CLUB_RECOMMENDATIONS.filter(club => {
    if (club.category !== targetCategory) return false
    
    // 레벨 매칭 로직
    if (level === '초급자') {
      return club.level.includes('초급자')
    } else if (level === '중급자') {
      return club.level.includes('중급자')
    } else if (level === '고급자') {
      return club.level.includes('고급자')
    }
    return false
  })
  
  // 적합한 클럽이 있으면 랜덤 선택, 없으면 기본값
  if (suitableClubs.length > 0) {
    const selectedClub = suitableClubs[Math.floor(Math.random() * suitableClubs.length)]
    return `${selectedClub.brand} ${selectedClub.model}`
  }
  
  // 기본값 반환
  return level === '초급자' ? 'XXIO 13 Irons' : 
         level === '중급자' ? 'Srixon ZXi5' : 
         'Srixon ZXi7'
}


function getLuckyHoleFromNumbers(numbers: number[]) {
  if (!Array.isArray(numbers) || numbers.length === 0) return '5번홀'
  return `${numbers[0]}번홀`
}

function getLuckyItemFromElement(element: string) {
  const itemMap = {
    '木': '거리측정기',
    '火': '골프 모자',
    '土': '골프 장갑',
    '金': '골프 시계',
    '水': '골프 우산'
  }
  return itemMap[element] || '거리측정기'
}

function generateDefaultFortune(userInfo: UserInfo | null, analysis: any) {
  if (!userInfo || !analysis) {
    return {
      title: "골신 할아버지가 운세를 준비하고 있습니다...",
      luckyClub: "XXIO 13 Irons",
      luckyBall: "타이틀리스트 Pro V1",
      luckyHole: "5번홀",
      luckyItem: "거리측정기",
      luckyTPO: "청색 상의, 하얀색 하의",
      roundFortune: "오늘은 차분하게 플레이하는 것이 중요합니다.",
      bettingFortune: "작은 내기만 하세요.",
      courseFortune: "평지 코스가 좋겠습니다.",
      scoreFortune: "평소보다 2-3타 높게 잡으세요.",
      strategyFortune: "안전한 플레이를 선택하세요.",
      quote: "골프는 마음의 게임입니다."
    }
  }

  // 개인화된 운세 생성 (실제 클럽 모델명 사용)
  const getLuckyClub = () => {
    return getLuckyClubFromStrengths(analysis?.strengths, userInfo.handicap)
  }
  
  const getLuckyHole = () => {
    const luckyNumbers = analysis?.lucky_numbers || [3, 8]
    return `${luckyNumbers[0]}번홀`
  }
  
  const getHandicapLevel = (handicap: number) => {
    if (handicap < 10) return "싱글"
    if (handicap < 20) return "중급"
    return "초심자"
  }
  
  const level = getHandicapLevel(userInfo.handicap)
  const personality = analysis?.personality || '활발하고 도전적'
  const golfStyle = analysis?.golf_style || '균형적'
  const strengths = analysis?.strengths || ['드라이버']
  const weaknesses = analysis?.weaknesses || ['퍼팅']
  const element = analysis?.element || '木'
  const elementName = analysis?.element_name || '목의 기운'
  
  // 구문별 운세 생성 함수
  function generateSectionalFortune(userInfo: UserInfo, analysis: any) {
    const personality = analysis?.personality || '활발하고 도전적'
    const golfStyle = analysis?.golf_style || '균형적'
    const strengths = analysis?.strengths || ['드라이버']
    const weaknesses = analysis?.weaknesses || ['퍼팅']
    const elementName = analysis?.element_name || '목의 기운'
    const level = getHandicapLevel(userInfo.handicap)
    
    return {
      greeting: `좋네… 자네 ${userInfo.name}의 운세를 보자고 했지?
생년월일 보니, ${userInfo.birthDate}생… ${userInfo.gender}라구? 음, 기운이 뚜렷하네.`,
      
      overallFlow: `올해 자네 골프 운세는 ${elementName}의 기운이 강하게 들어와 있네. ${personality}한 성격으로 ${golfStyle}한 플레이가 잘 맞을 걸세.`,
      
      mentalFortune: `골프는 멘탈이 절반이야. 올해 자네는 OB나 해저드에 빠져도,
그 다음 샷에 집중하면 흐름이 다시 살아날 거라네.
"다음 샷이 가장 중요한 샷이다" 이 말을 늘 마음에 새겨두게.`,
      
      skillFortune: `${strengths[0] || '롱게임'}은 아직 들쑥날쑥하지만, 올해는 숏게임에서 성과가 크게 보일 걸세.
웨지 감각이 빨리 붙고, 퍼트에서도 손맛이 좋아질 테니… 작은 연습도 헛되지 않을 걸세.`,
      
      physicalFortune: `몸의 기운이 순환하는 해라, 무리하게 치는 것보다 라운딩 뒤 회복과 스트레칭이 중요하다네.
부상만 없으면 올해는 계속 즐겁게 칠 수 있을 게야.`,
      
      networkFortune: `동반자 운이 강하게 들어와 있네.
좋은 멘토 같은 골퍼를 만나, 기술도 배우고 골프 철학도 익힐 기회가 있겠구먼.
혼자 하는 골프보다, 같이 하는 골프에서 큰 운이 트일 걸세.`,
      
      overallMessage: `올해 자네 골프 운세는 말이야,
"한 방에 확 튀어 오르는 해"가 아니라, 땅을 다지고 천천히 기초를 세우는 해라네.
아직은 백돌이지만, 폼과 루틴만 착실히 챙기면 성장 속도가 남들보다 빠를 게야.`,
      
      finalAdvice: `허허, 그러니 너무 조급해 말고… 올해는 ${strengths[0] || '기본기'}와 멘탈, 그리고 기본기만 믿고 가면, 자네 골프 인생에 큰 길이 열릴 걸세.`
    }
  }

  // 기존 템플릿 방식도 유지 (호환성)
  const fortuneTemplates = [
    // 템플릿 1: 성장형
    `좋네… 자네 ${userInfo.name}의 운세를 보자고 했지?
생년월일 보니, ${userInfo.birthDate}생… ${userInfo.gender}라구? 음, 기운이 뚜렷하네.

:골프를_치는_${userInfo.gender === '남성' ? '남성' : '여성'}: 전반 기류
올해 자네 골프 운세는 ${elementName}의 기운이 강하게 들어와 있네. ${personality}한 성격으로 ${golfStyle}한 플레이가 잘 맞을 걸세.

:대체로_맑음: 세부 운세

멘탈 운
골프는 멘탈이 절반이야. 올해 자네는 OB나 해저드에 빠져도,
그 다음 샷에 집중하면 흐름이 다시 살아날 거라네.
"다음 샷이 가장 중요한 샷이다" 이 말을 늘 마음에 새겨두게.

기술 운
${strengths[0]}은 아직 들쑥날쑥하지만, 올해는 숏게임에서 성과가 크게 보일 걸세.
웨지 감각이 빨리 붙고, 퍼트에서도 손맛이 좋아질 테니… 작은 연습도 헛되지 않을 걸세.

체력 운
몸의 기운이 순환하는 해라, 무리하게 치는 것보다 라운딩 뒤 회복과 스트레칭이 중요하다네.
부상만 없으면 올해는 계속 즐겁게 칠 수 있을 게야.

인맥 운
동반자 운이 강하게 들어와 있네.
좋은 멘토 같은 골퍼를 만나, 기술도 배우고 골프 철학도 익힐 기회가 있겠구먼.
혼자 하는 골프보다, 같이 하는 골프에서 큰 운이 트일 걸세.

:골프: 종합
올해 자네 골프 운세는 말이야,
"한 방에 확 튀어 오르는 해"가 아니라, 땅을 다지고 천천히 기초를 세우는 해라네.
아직은 백돌이지만, 폼과 루틴만 착실히 챙기면 성장 속도가 남들보다 빠를 게야.

허허, 그러니 너무 조급해 말고… 올해는 ${strengths[0]}과 멘탈, 그리고 기본기만 믿고 가면, 자네 골프 인생에 큰 길이 열릴 걸세.`,

    // 템플릿 2: 도전형
    `음… 자네 ${userInfo.name}의 운세를 보자고 했구나.
생년월일 보니, ${userInfo.birthDate}생… ${userInfo.gender}라구? 흥미로운 기운이네.

:골프를_치는_${userInfo.gender === '남성' ? '남성' : '여성'}: 전반 기류
올해 자네 골프 운세는 도전과 변화의 해라네. ${elementName}의 기운이 새로운 가능성을 열어줄 걸세.

:대체로_맑음: 세부 운세

멘탈 운
올해는 특히 멘탈 관리가 중요하네. ${strengths[0]}에서 자신감을 찾되, ${weaknesses[0]}에 대한 두려움을 극복해야 할 때야.
"두려움은 성장의 시작"이라는 말을 기억하게.

기술 운
${strengths[0]}은 더욱 발전시켜야 하고, ${weaknesses[0]}은 새로운 접근법으로 극복해보게.
기존 방식에만 얽매이지 말고, 창의적인 연습법을 시도해보게.

체력 운
몸의 균형을 맞추는 것이 중요하다네. 스트레칭과 코어 강화에 더 신경 써야 할 걸세.
특히 허리와 어깨 관절 관리가 핵심이야.

인맥 운
새로운 골프 동반자를 만날 기회가 많을 해야. 서로 다른 스타일의 골퍼들과 라운딩해보게.
다양한 골프 철학을 접하면 자네 게임에도 도움이 될 거야.

:골프: 종합
올해 자네에게 내려온 메시지는 "변화를 두려워하지 말라"는 것이네.
${level} 레벨에서 벗어나기 위해 새로운 도전을 해보게.

허허, 안전한 길보다는 성장할 수 있는 길을 선택하라네… 올해는 ${strengths[0]}을 무기로 ${weaknesses[0]}을 정복하는 해가 될 걸세.`,

    // 템플릿 3: 안정형
    `좋아… 자네 ${userInfo.name}의 운세를 보자고 했지?
생년월일 보니, ${userInfo.birthDate}생… ${userInfo.gender}라구? 차분한 기운이 느껴지네.

:골프를_치는_${userInfo.gender === '남성' ? '남성' : '여성'}: 전반 기류
올해 자네 골프 운세는 안정과 일관성의 해라네. ${elementName}의 기운으로 차근차근 실력을 쌓아갈 걸세.

:대체로_맑음: 세부 운세

멘탈 운
골프는 마음의 평정이 중요하네. 올해 자네는 ${strengths[0]}에서 안정감을 찾고, ${weaknesses[0]}에 대해서는 서두르지 말고 천천히 개선해나가게.
"천천히 가는 것이 빠른 길"이라는 말을 기억하게.

기술 운
${strengths[0]}을 바탕으로 꾸준한 연습을 하면, ${weaknesses[0]}도 자연스럽게 향상될 거라네.
급하게 서두르지 말고, 기본기에 충실하게.

체력 운
몸의 리듬을 유지하는 것이 중요하다네. 규칙적인 운동과 충분한 휴식의 균형을 맞추게.
특히 라운딩 전후 스트레칭을 꼭 하게.

인맥 운
기존의 골프 친구들과의 관계가 더욱 돈독해질 해야. 함께 성장하고 발전할 수 있는 동반자들과 시간을 보내게.
오랜 친구들과의 골프가 자네에게 큰 힘이 될 거야.

:골프: 종합
올해 자네에게 내려온 메시지는 "꾸준함이 최고의 무기"라는 것이네.
${level} 레벨에서 안정적으로 실력을 쌓아가면, 언젠가는 큰 성과를 거둘 수 있을 걸세.

허허, 서두르지 말고… 올해는 ${strengths[0]}을 다지고, ${weaknesses[0]}을 보완하는 차분한 한 해로 만들어보게.`
  ]
  
  // 구문별 운세 생성
  const sectionalFortune = generateSectionalFortune(userInfo, analysis)
  
  return {
    title: sectionalFortune,
    luckyClub: getLuckyClub(),
    luckyHole: getLuckyHole(),
    luckyItem: getLuckyItemFromElement(element),
    roundFortune: `${personality}한 성격으로 ${golfStyle}한 플레이가 좋겠습니다.`,
    bettingFortune: `${level} 레벨에 맞는 작은 내기만 하세요. ${strengths[0]}이 강점이니 이를 활용하세요.`,
    courseFortune: `${element} 오행의 기운에 맞는 코스를 선택하세요. ${userInfo.countryClub || '평지 코스'}가 좋겠습니다.`,
    scoreFortune: `${level} 레벨에 맞는 목표를 설정하세요. ${weaknesses[0]}을 보완하는 연습이 필요합니다.`,
    strategyFortune: `${strengths[0]}을 활용하고 ${weaknesses[0]}을 보완하는 전략으로 플레이하세요.`,
    quote: `${personality}한 마음으로 골프를 즐기세요. ${elementName}이 당신을 응원합니다.`
  }
}

function generateLuckyElements(userInfo: UserInfo): string[] {
  const elements = ['물', '나무', '불', '흙', '금']
  const birthMonth = parseInt(userInfo.birthDate.split('.')[1])
  return [elements[birthMonth % 5]]
}

function generateWeakPoints(userInfo: UserInfo): string[] {
  const points = ['퍼팅', '드라이버', '아이언', '샌드웨지', '멘탈']
  return [points[userInfo.handicap % 5]]
}

function generateRecommendations(userInfo: UserInfo): string[] {
  return [
    '충분한 워밍업을 하세요',
    '집중력을 높이세요',
    '긍정적인 마음가짐을 유지하세요'
  ]
}

async function saveUserData(data: any) {
  try {
    // 데이터 저장 디렉토리 생성
    const dataDir = path.join(process.cwd(), 'data', 'users')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // 파일명 생성 (타임스탬프 + 사용자명)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `${timestamp}_${data.userInfo.name}.json`
    const filePath = path.join(dataDir, fileName)

    // 사용자 정보를 JSON 파일로 저장
    const userData = {
      timestamp: data.timestamp,
      userInfo: data.userInfo,
      analysis: data.analysis,
      fortune: data.fortune,
      exportInfo: {
        exportedAt: new Date().toISOString(),
        exportPath: filePath,
        exportFormat: 'JSON'
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), 'utf8')
    
    console.log('사용자 데이터 저장 완료:', filePath)
    
    // CSV 형태로도 저장 (스프레드시트 호환)
    const csvFileName = `${timestamp}_${data.userInfo.name}.csv`
    const csvFilePath = path.join(dataDir, csvFileName)
    
    const csvData = generateCSVData(data.userInfo, data.analysis, data.fortune)
    fs.writeFileSync(csvFilePath, csvData, 'utf8')
    
    console.log('CSV 데이터 저장 완료:', csvFilePath)
    
    return {
      jsonPath: filePath,
      csvPath: csvFilePath,
      success: true
    }
  } catch (error) {
    console.error('데이터 저장 오류:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

function generateCSVData(userInfo: UserInfo, analysis: any, fortune: any): string {
  const headers = [
    '이름', '휴대폰번호', '생년월일', '출생시간', '성별', '핸디캡',
    '방문CC', '아이언', '드라이버', '웨지', '퍼터', '볼',
    '사주요약', '오행', '성격', '골프스타일', '행운요소', '약점',
    '운세제목', '행운클럽', '행운볼', '행운홀', '행운아이템', '행운TPO'
  ]
  
  const values = [
    userInfo.name,
    userInfo.phoneNumber || '',
    userInfo.birthDate,
    userInfo.birthTime,
    userInfo.gender,
    userInfo.handicap.toString(),
    userInfo.countryClub || '',
    userInfo.ironBrand || '',
    userInfo.driverBrand || '',
    userInfo.wedgeBrand || '',
    userInfo.putterBrand || '',
    userInfo.ballBrand || '',
    analysis.sajuSummary || '',
    analysis.element || '',
    analysis.personality || '',
    analysis.golfStyle || '',
    Array.isArray(analysis.luckyElements) ? analysis.luckyElements.join(', ') : '',
    Array.isArray(analysis.weakPoints) ? analysis.weakPoints.join(', ') : '',
    fortune.title || '',
    fortune.luckyClub || '',
    fortune.luckyBall || '',
    fortune.luckyHole || '',
    fortune.luckyItem || '',
    fortune.luckyTPO || ''
  ]
  
  return headers.join(',') + '\n' + values.map(v => `"${v}"`).join(',') + '\n'
}
