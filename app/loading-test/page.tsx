"use client"

import { useState } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function LoadingTestPage() {
  const [userName, setUserName] = useState("김도윤")
  const [phase, setPhase] = useState<"analyzing" | "generating">("analyzing")

  const testAnalysis = {
    personality: '활발하고 도전적',
    golfStyle: '균형적',
    luckyElements: ['물', '바람'],
    weakPoints: ['퍼팅', '멘탈'],
    recommendations: ['충분한 워밍업', '긍정적 사고']
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">로딩 화면 테스트</h1>
        <div className="flex items-center space-x-4 mb-4">
          <Label htmlFor="userName" className="text-lg">사용자 이름:</Label>
          <Input
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-48"
          />
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={() => setPhase("analyzing")}
            variant={phase === "analyzing" ? "default" : "outline"}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            분석 중
          </Button>
          <Button
            onClick={() => setPhase("generating")}
            variant={phase === "generating" ? "default" : "outline"}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            생성 중
          </Button>
        </div>
      </div>
      <LoadingScreen userName={userName} phase={phase} analysis={testAnalysis} />
    </div>
  )
}
