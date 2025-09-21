"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserInfo, FortuneAnalysis } from "./golf-fortune-app"
import Image from "next/image"

// 운세 섹션을 렌더링하는 함수
function renderFortuneSections(fortune: any) {
  if (!fortune || !fortune.title) return null

  const sections = [
    { key: 'overallFlow', title: '올해 골프 운세' },
    { key: 'mentalFortune', title: '멘탈 운' },
    { key: 'skillFortune', title: '기술 운' },
    { key: 'physicalFortune', title: '체력 운' },
    { key: 'networkFortune', title: '인맥 운' },
    { key: 'overallMessage', title: '종합 메시지' },
    { key: 'finalAdvice', title: '마무리 조언' }
  ]

  return sections.map((section, index) => {
    const content = fortune.title[section.key]
    if (!content) return null
    
    return (
      <div key={index} className="mb-6">
        <h3 className="text-xl font-bold mb-3 text-gray-800">
          {section.title}
        </h3>
        <div className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">
          {content}
        </div>
      </div>
    )
  })
}


interface FortuneResultProps {
  userInfo: UserInfo
  fortuneData: FortuneAnalysis
  onRestart: () => void
}

export function FortuneResult({ userInfo, fortuneData, onRestart }: FortuneResultProps) {
  return (
    <div className="w-full max-w-2xl mx-auto fade-in space-y-6">
      {/* 메인 운세 카드 */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8">
          {/* 골신 할아버지의 운세 헤더 */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">골신 할아버지의 운세</h2>
            <p className="text-gray-600 mb-6">1000년 넘게 골프를 쳐온 신선의 지혜</p>
            
            {/* 캐릭터 이미지와 제목 */}
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <Image 
                src="/hello.png" 
                alt="골신 캐릭터" 
                width={128} 
                height={128} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // 이미지 로드 실패 시 폴백
                  e.currentTarget.style.display = 'none'
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
              {/* 폴백 아이콘 */}
              <div 
                className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
                style={{ display: 'none' }}
              >
                <span className="text-6xl">🧙‍♂️</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {userInfo.name}의 골프 운세는 말이지...
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              "{fortuneData.fortune?.title?.summary || '한마디로 ' + (fortuneData.analysis?.personality || '활발하고 도전적') + '이라네'}"
            </p>
          </div>

          {/* 사주 입력 정보 */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">사주 입력 정보</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">이름</div>
                <div className="font-semibold text-gray-800">{userInfo.name}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">생년월일</div>
                <div className="font-semibold text-gray-800">{userInfo.birthDate}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">생시</div>
                <div className="font-semibold text-gray-800">{userInfo.birthTime}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">핸디캡</div>
                <div className="font-semibold text-gray-800">{userInfo.handicap}</div>
              </div>
            </div>
          </div>

          {/* 행운의 아이템들 */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">행운의 아이템</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">행운의 클럽</div>
                <div className="font-semibold text-gray-800">{fortuneData.fortune?.luckyClub}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">행운의 홀</div>
                <div className="font-semibold text-gray-800">{fortuneData.fortune?.luckyHole}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">행운의 착장</div>
                <div className="font-semibold text-gray-800">{fortuneData.fortune?.luckyItem}</div>
              </div>
            </div>
          </div>

          {/* 인사말 */}
          <div className="mb-8">
            <p className="text-lg leading-relaxed text-gray-700">
              좋네… 자네의 운세를 보자고 했지? 생년월일 보니, {userInfo.birthDate.slice(2, 4)}년생… {userInfo.gender}이라고? 음, 기운이 뚜렷하네. 좋아.
            </p>
          </div>

          {/* 운세 내용 */}
          <div className="mb-8">
            <div className="space-y-6">
              {renderFortuneSections(fortuneData.fortune)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 버튼들 */}
      <div className="flex gap-4">
        <Button
          onClick={onRestart}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
        >
          다시 운세보기
        </Button>
        <Button
          variant="outline"
          className="flex-1 bg-white/80 hover:bg-white border border-gray-200 text-gray-700"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${userInfo.name}님의 골프 운세`,
                text: fortuneData.fortune?.title?.overallFlow || '골프 운세',
                url: window.location.href,
              })
            }
          }}
        >
          공유하기
        </Button>
      </div>
    </div>
  )
}
