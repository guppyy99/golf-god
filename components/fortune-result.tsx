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
    { key: 'finalAdvice', title: '마무리 조언' }
  ]

  return sections.map((section, index) => {
    const content = fortune.title[section.key]
    if (!content) return null
    
    // 마무리 조언은 특별한 스타일링 적용
    if (section.key === 'finalAdvice') {
      return (
        <div key={index} className="mb-6">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200 shadow-sm">
            <div className="text-center">
              <div className="text-lg leading-relaxed text-amber-800 font-medium italic">
                "{content}"
              </div>
            </div>
          </div>
        </div>
      )
    }
    
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
          {/* 나의 올해 운세는? 헤더 */}
          <div className="text-center mb-8">
            {/* 골프 테마 그라데이션 제목 */}
            <div className="relative mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 drop-shadow-lg mb-4">
                나의 올해 운세는?
              </h2>
              {/* 파티클 효과 */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-3 w-3 h-3 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute -bottom-2 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute -bottom-1 -right-2 w-3 h-3 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
            </div>
            
            {/* 캐릭터 이미지 (원형 제거) */}
            <div className="w-40 h-40 mx-auto mb-6 flex items-center justify-center">
              <Image 
                src="/hello.png" 
                alt="골신 캐릭터" 
                width={160} 
                height={160} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
              <div 
                className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
                style={{ display: 'none' }}
              >
                <span className="text-6xl">🧙‍♂️</span>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
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
          <div className="mb-8 text-center">
            <p className="text-lg leading-relaxed text-green-700 font-bold">
              좋네… 자네의 운세를 보자고 했지?<br />
              생년월일 보니, {userInfo.birthDate.slice(2, 4)}년생…<br />
              {userInfo.gender}이라고? 음, 기운이 뚜렷하네. 좋아.
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
