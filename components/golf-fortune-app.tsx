"use client"

import { useState } from "react"
import { UserInfoForm } from "./user-info-form"
import { FortuneResult } from "./fortune-result"
import { LoadingScreen } from "./loading-screen"
import { IntroPage } from "./intro-page"

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
    element?: string
    element_name?: string
    lucky_numbers?: number[]
  }
  fortune?: {
    title: {
      greeting: string
      overallFlow: string
      mentalFortune: string
      skillFortune: string
      physicalFortune: string
      networkFortune: string
      overallMessage: string
      finalAdvice: string
    }
    luckyClub: string
    luckyHole: string
    luckyItem: string
  }
}

export function GolfFortuneApp() {
  const [currentPhase, setCurrentPhase] = useState<"intro" | "form" | "analyzing" | "generating" | "result">("intro")
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [fortuneData, setFortuneData] = useState<FortuneAnalysis | null>(null)

  const handleFormComplete = async (data: UserInfo) => {
    setUserInfo(data)
    setCurrentPhase("analyzing")

    try {
      // 페이즈 2: 사용자 정보 분석
      const response = await fetch('/api/analyze-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('분석 실패')
      }

      const result = await response.json()
      
      // 페이즈 3: 운세 생성
      setCurrentPhase("generating")
      setFortuneData(result)
      
      // 완료
      setTimeout(() => {
        setCurrentPhase("result")
      }, 2000)

    } catch (error) {
      console.error('분석 오류:', error)
      // 오류 시 기본 운세로 폴백
      setFortuneData({
        phase: 'complete',
        analysis: {
          personality: '활발하고 도전적',
          golfStyle: '균형적',
          luckyElements: ['물'],
          weakPoints: ['퍼팅'],
          recommendations: ['충분한 워밍업을 하세요']
        },
        fortune: {
          title: {
            greeting: `좋네… 자네 ${data.name}의 운세를 보자고 했지? 생년월일 보니, ${data.birthDate}생… ${data.gender}라구? 음, 기운이 뚜렷하네.`,
            overallFlow: `올해 자네 골프 운세는 목의 기운의 기운이 강하게 들어와 있네. 활발하고 도전적인 성격으로 균형적인 플레이가 잘 맞을 걸세. 핸디캡 ${data.handicap}으로는 아직 백돌이지만, 올해는 기초를 다지는 해가 될 것 같네.`,
            mentalFortune: `골프는 멘탈이 절반이야. 올해 자네는 OB나 해저드에 빠져도, 그 다음 샷에 집중하면 흐름이 다시 살아날 거라네. "다음 샷이 가장 중요한 샷이다" 이 말을 늘 마음에 새겨두게.`,
            skillFortune: `드라이버은 아직 들쑥날쑥하지만, 올해는 숏게임에서 성과가 크게 보일 걸세. 웨지 감각이 빨리 붙고, 퍼트에서도 손맛이 좋아질 테니… 작은 연습도 헛되지 않을 걸세.`,
            physicalFortune: `몸의 기운이 순환하는 해라, 무리하게 치는 것보다 라운딩 뒤 회복과 스트레칭이 중요하다네. 부상만 없으면 올해는 계속 즐겁게 칠 수 있을 게야.`,
            networkFortune: `동반자 운이 강하게 들어와 있네. 좋은 멘토 같은 골퍼를 만나, 기술도 배우고 골프 철학도 익힐 기회가 있겠구먼.`,
            overallMessage: `올해 자네 골프 운세는 말이야, "한 방에 확 튀어 오르는 해"가 아니라, 땅을 다지고 천천히 기초를 세우는 해라네.`,
            finalAdvice: `허허, 그러니 너무 조급해 말고… 올해는 드라이버와 멘탈, 그리고 기본기만 믿고 가면, 자네 골프 인생에 큰 길이 열릴 걸세. ${data.name}아, 오늘도 즐거운 라운드 되게!`
          },
          luckyClub: "XXIO 13 Irons",
          luckyHole: "5번홀",
          luckyItem: "거리측정기"
        }
      })
      setCurrentPhase("result")
    }
  }

  const handleRestart = () => {
    setCurrentPhase("form")
    setUserInfo(null)
    setFortuneData(null)
  }

  const handleStart = () => {
    setCurrentPhase("form")
  }

  return (
    <>
      {currentPhase === "intro" && <IntroPage onStart={handleStart} />}
      {currentPhase === "form" && <UserInfoForm onComplete={handleFormComplete} />}
      {(currentPhase === "analyzing" || currentPhase === "generating") && (
        <LoadingScreen 
          userName={userInfo?.name} 
          phase={currentPhase}
          analysis={fortuneData?.analysis}
        />
      )}
      {currentPhase === "result" && userInfo && fortuneData && (
        <FortuneResult 
          userInfo={userInfo} 
          fortuneData={fortuneData} 
          onRestart={handleRestart} 
        />
      )}
      
    </>
  )
}
