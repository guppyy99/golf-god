"use client"

interface IntroPageProps {
  onStart: () => void
}

export function IntroPage({ onStart }: IntroPageProps) {
  return (
    <>
      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-20px) rotate(360deg); opacity: 0; }
        }
        .sparkle {
          animation: sparkle 2s infinite;
        }
        .confetti {
          animation: confetti 3s infinite;
        }
      `}</style>
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* 메인 이미지 섹션 */}
      <div className="w-full aspect-[4/5] relative overflow-hidden">
        <img 
          src="/main-campaign.jpg" 
          alt="골프 운세 캠페인 메인 이미지"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.log('이미지 로드 실패, 폴백 적용')
            e.currentTarget.style.display = 'none'
            const fallback = e.currentTarget.nextElementSibling as HTMLElement
            if (fallback) fallback.style.display = 'flex'
          }}
        />
        {/* 폴백 디자인 */}
        <div 
          className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center"
          style={{ display: 'none' }}
        >
          <div className="text-center text-white">
            <div className="text-6xl mb-4">🏌️‍♂️</div>
            <div className="text-2xl font-bold">골프 운세</div>
          </div>
        </div>
      </div>

      {/* 텍스트 섹션 */}
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-3 leading-none">
          {/* 첫 번째 줄 - 그라데이션 효과 */}
          <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent animate-pulse">
            "올해 골프 운세를 알려주마"
          </div>
          {/* 두 번째 줄 - 회색 텍스트로 원복 */}
          <div className="text-gray-900 mt-1">
            너의 운세는 버디일까 OB일까
          </div>
        </h1>

        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          골프의 신 '골신'이 알려주는
          <br />
          올해 당신의 골프 운세는?
        </p>

        <button
          onClick={onStart}
          className="relative w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black py-4 rounded-full font-bold text-lg hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden group"
        >
          {/* 반짝반짝 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
          
          {/* 빵빠레 효과 (confetti) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-300 rounded-full sparkle" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-2 right-1/3 w-1 h-1 bg-yellow-200 rounded-full sparkle" style={{animationDelay: '0.3s'}}></div>
            <div className="absolute top-1 right-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full sparkle" style={{animationDelay: '0.6s'}}></div>
            <div className="absolute top-3 left-1/3 w-1 h-1 bg-yellow-300 rounded-full sparkle" style={{animationDelay: '0.9s'}}></div>
            <div className="absolute top-0 right-1/2 w-2 h-2 bg-yellow-200 rounded-full sparkle" style={{animationDelay: '1.2s'}}></div>
            <div className="absolute top-4 left-1/2 w-1 h-1 bg-yellow-400 rounded-full sparkle" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute top-1 left-1/6 w-1.5 h-1.5 bg-yellow-300 rounded-full sparkle" style={{animationDelay: '1.8s'}}></div>
            <div className="absolute top-2 right-1/6 w-1 h-1 bg-yellow-200 rounded-full sparkle" style={{animationDelay: '2.1s'}}></div>
          </div>
          
          {/* 버튼 텍스트 */}
          <span className="relative z-10 flex items-center justify-center">
            ✨ 운세시작! ✨
          </span>
        </button>
      </div>
      </div>
    </>
  )
}