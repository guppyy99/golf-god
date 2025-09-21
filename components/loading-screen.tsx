"use client"

import { useEffect, useState } from "react"

interface LoadingScreenProps {
  userName?: string
  phase?: "analyzing" | "generating"
  analysis?: {
    personality: string
    golfStyle: string
    luckyElements: string[]
    weakPoints: string[]
    recommendations: string[]
  }
}

export function LoadingScreen({ userName = "고객", phase = "analyzing", analysis }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [speechBubble, setSpeechBubble] = useState("")
  const [showBubble, setShowBubble] = useState(false)

  const messages = {
    analyzing: [
      `${userName}님의 정보를 수집 중입니다`,
      `생년월일과 시간을\n분석하고 있습니다`,
      `성격과 골프 스타일을\n파악하는 중입니다`,
        `행운의 요소를\n찾아보고 있습니다`,
        `약점과 개선점을\n분석 중입니다`,
      `골신 할아버지가\n사주를 분석하고 있습니다`,
      `오행의 기운을\n계산하는 중입니다`,
      `골프 인생의 흐름을\n읽어보고 있습니다`,
      `운세의 조화를\n맞추는 중입니다`,
      `분석 결과를\n종합하고 있습니다`,
      `천체의 움직임을\n관찰하고 있습니다`,
      `골프장의 에너지를\n감지하는 중입니다`,
      `과거의 골프 경험을\n되돌아보고 있습니다`,
      `미래의 가능성을\n탐색하는 중입니다`,
      `운명의 실을\n따라가고 있습니다`,
      `골프의 정신을\n깊이 이해하는 중입니다`,
      `자연의 리듬과 조화를\n열심히 맞추고 있습니다`,
      `골신 할아버지의\n천년 지혜를 집중하고 있습니다`,
      `운세의 비밀을\n해독하는 중입니다`,
      `최종 분석을\n마무리하고 있습니다`
    ],
    generating: [
      `분석 결과를 바탕으로\n운세를 생성하고 있습니다`,
      `골신 할아버지가\n운세를 작성하는 중입니다`,
      `올해의 골프 운세를\n점지하고 있습니다`,
      `행운의 클럽과 홀을\n선정하는 중입니다`,
      `골프 조언을\n정리하고 있습니다`,
      `최종 운세를\n완성하는 중입니다`,
      `1000년의 지혜를 담아\n운세를 작성하고 있습니다`,
      `골프의 신이\n특별한 조언을 준비하는 중입니다`,
      `운세의 마지막 터치를\n다듬고 있습니다`,
      `골신 할아버지의\n완성된 운세를 준비하는 중입니다`,
      `골프장의 기운을\n운세에 담고 있습니다`,
      `올해의 골프 행운을\n예측하는 중입니다`,
      `개인별 맞춤 운세를\n작성하고 있습니다`,
      `골프의 신비로운 비밀을\n풀어내는 중입니다`,
      `운명의 골프 여정을\n그려보고 있습니다`,
      `골신 할아버지의\n마법 같은 조언을 준비하는 중입니다`,
      `골프 인생의 새로운 장을\n열어보고 있습니다`,
      `운세의 마지막 퍼즐 조각을\n맞추는 중입니다`,
      `골프의 영혼과\n대화하고 있습니다`,
      `완벽한 운세를 완성하는\n마지막 단계입니다`
    ]
  }

  const currentMessages = messages[phase]
  const totalSteps = currentMessages.length

  // 말풍선 메시지들
  const speechMessages = [
    "흠...",
    "음....",
    "그렇군...",
    "허허....",
    "아하...",
    "음음...",
    "그래...",
    "흠흠...",
    "음...",
    "그렇구나...",
    "허허허..."
  ]

  useEffect(() => {
    // 초기 설정
    setProgress(0)
    setCurrentMessage(currentMessages[0])
    setCurrentStep(0)

    let step = 0
    let progressValue = 0
    const startTime = Date.now()

    // 텐션감 있는 진행률 (30초 동안 0-100%)
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const duration = 30000 // 30초
      
      // 텐션감 있는 곡선 (ease-out)
      const normalizedTime = Math.min(elapsed / duration, 1)
      const easedTime = 1 - Math.pow(1 - normalizedTime, 3) // cubic ease-out
      progressValue = Math.round(easedTime * 100)
      
      setProgress(progressValue)
    }, 100)

    // 메시지 롤링 (2초마다)
    const messageInterval = setInterval(() => {
      step = (step + 1) % totalSteps
      setCurrentStep(step)
      setCurrentMessage(currentMessages[step])
    }, 2000)

    // 말풍선 롤링 (4-6초마다 랜덤하게)
    const speechInterval = setInterval(() => {
      const randomMessage = speechMessages[Math.floor(Math.random() * speechMessages.length)]
      setSpeechBubble(randomMessage)
      setShowBubble(true)
      
      // 애니메이션 완료 후 말풍선 숨기기 (4초 후)
      setTimeout(() => {
        setShowBubble(false)
      }, 4000)
    }, Math.random() * 2000 + 4000) // 4-6초 랜덤

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
      clearInterval(speechInterval)
    }
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes cloudFloat {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(5px) translateY(-3px); }
          50% { transform: translateX(-3px) translateY(-5px); }
          75% { transform: translateX(-5px) translateY(3px); }
        }
        @keyframes bubblePop {
          0% { 
            opacity: 0; 
            transform: scale(0.8) translateY(5px); 
          }
          5% { 
            opacity: 1; 
            transform: scale(1.05) translateY(-2px); 
          }
          30% { 
            opacity: 1; 
            transform: scale(1) translateY(-2px); 
          }
          80% { 
            opacity: 0.8; 
            transform: scale(1) translateY(-2px); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.95) translateY(-5px); 
          }
        }
        .cloud-float {
          animation: cloudFloat 4s ease-in-out infinite;
        }
        .bubble-pop {
          animation: bubblePop 4s ease-out forwards;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 상단 메시지 */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <h2 className="text-3xl font-black text-gray-800 mb-2 relative z-10">
              <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent drop-shadow-lg">
                골신할아버지가
              </span>
              <br />
              <span className="text-2xl font-bold text-gray-700 drop-shadow-md">
                {phase === "analyzing" 
                  ? "당신의 사주를 분석하고 있습니다"
                  : "당신만의 특별한 운세를 작성하고 있습니다"
                }
              </span>
            </h2>
            {/* 장식 요소 */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-3 w-3 h-3 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute -bottom-2 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            <div className="absolute -bottom-1 -right-2 w-3 h-3 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
          </div>
        </div>

        {/* 로딩 카드 */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50 relative">
          {/* 배경 구름들 */}
          <div className="absolute top-4 left-4 w-16 h-8 bg-white/30 rounded-full cloud-float"></div>
          <div className="absolute top-8 right-8 w-12 h-6 bg-white/20 rounded-full cloud-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-4 left-8 w-20 h-10 bg-white/25 rounded-full cloud-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-8 right-4 w-14 h-7 bg-white/20 rounded-full cloud-float" style={{animationDelay: '3s'}}></div>

          {/* hello 이미지 둥실둥실 애니메이션 */}
          <div className="flex justify-center mb-8 relative">
            <div 
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg border-2 border-white/50"
              style={{
                animation: 'float 3s ease-in-out infinite'
              }}
            >
              <img 
                src="/hello.png" 
                alt="골신 캐릭터" 
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
              {/* 폴백 아이콘 */}
              <div 
                className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center rounded-xl"
                style={{ display: 'none' }}
              >
                <span className="text-2xl">🧙‍♂️</span>
              </div>
            </div>
            
            {/* 말풍선 */}
            {showBubble && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bubble-pop z-50">
                <div className="relative bg-white rounded-3xl px-5 py-3 shadow-lg border border-gray-100">
                  <div className="text-base font-medium text-gray-600 whitespace-nowrap">
                    {speechBubble}
                  </div>
                  {/* 말풍선 꼬리 - 더 자연스럽게 */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white"></div>
                </div>
              </div>
            )}
          </div>

          {/* 메시지 롤링 */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm w-80 mx-auto">
              <div className="h-20 flex items-center justify-center">
                <div className="w-full px-4">
                  <p className="text-lg text-blue-800 font-semibold text-center leading-relaxed animate-pulse whitespace-pre-line">
                    {currentMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* 진행률 바 */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div
              className="bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 진행률 퍼센트 */}
          <div className="text-center">
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

      </div>
      </div>
    </>
  )
}