"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserInfo } from "./golf-fortune-app"

interface UserInfoFormProps {
  onComplete: (data: UserInfo) => void
}

export function UserInfoForm({ onComplete }: UserInfoFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<UserInfo>>({
    handicap: 28,
  })
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [noBirthTime, setNoBirthTime] = useState(false)

  const totalSteps = 6 // 기본 6단계: 이름, 휴대폰번호, 성별, 생년월일, 출생시간, 핸디캡

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      setShowSummaryModal(true)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSummaryConfirm = () => {
    setShowSummaryModal(false)
    setShowTermsModal(true)
  }

  const handleTermsAgree = () => {
    setShowTermsModal(false)
    onComplete(formData as UserInfo)
  }

  const updateFormData = (field: keyof UserInfo, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const formatBirthDate = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 4) {
      return numbers
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}.${numbers.slice(4)}`
    } else {
      return `${numbers.slice(0, 4)}.${numbers.slice(4, 6)}.${numbers.slice(6, 8)}`
    }
  }

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBirthDate(e.target.value)
    updateFormData("birthDate", formatted)
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.name.trim() !== ""
      case 2:
        return formData.phoneNumber && formData.phoneNumber.trim() !== ""
      case 3:
        return formData.gender
      case 4:
        return formData.birthDate && formData.birthDate.length >= 10
      case 5:
        return formData.birthTime || noBirthTime
      case 6:
        return formData.handicap !== undefined
      default:
        return false
    }
  }

  const getStepContent = () => {
    switch (step) {
      case 1:
        return {
          title: `안녕하세요!\n이름을 알려주세요.`,
          subtitle: "이름",
          placeholder: "김골프",
        }
      case 2:
        return {
          title: `${formData.name || "김골프"}님의\n휴대폰번호를 알려주세요.`,
          subtitle: "휴대폰번호",
          placeholder: "010-1234-5678",
        }
      case 3:
        return {
          title: `${formData.name || "김골프"}님의\n성별을 알려주세요.`,
          subtitle: "성별",
        }
      case 4:
        return {
          title: `${formData.name || "김골프"}님의\n생년월일을 알려주세요.`,
          subtitle: "생년월일",
          placeholder: "1999.10.24",
        }
      case 5:
        return {
          title: `${formData.name || "김골프"}님의\n출생시간을 알려주세요.`,
          subtitle: "출생시간",
          placeholder: "14:30",
        }
      case 6:
        return {
          title: `${formData.name || "김골프"}님의\n골프 핸디캡을 알려주세요.`,
          subtitle: "핸디캡",
          placeholder: "28",
        }
      default:
        return {
          title: "정보를 입력해주세요.",
          subtitle: "",
          placeholder: "",
        }
    }
  }

  const stepContent = getStepContent()

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* 진행 단계 표시 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">단계 {step} / {totalSteps}</span>
          <span className="text-sm text-gray-500">{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2 whitespace-pre-line">
            {stepContent.title}
          </h2>
          <p className="text-sm text-gray-600">
            {stepContent.subtitle}
          </p>
        </div>

        <div className="space-y-6">
          {/* 이름 입력 */}
          {step === 1 && (
            <div className="transition-all duration-300 ease-in-out">
              <Input
                value={formData.name || ""}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder={stepContent.placeholder}
                className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-3 text-base focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 w-full text-center"
                autoFocus
              />
            </div>
          )}

          {/* 휴대폰번호 입력 */}
          {step === 2 && (
            <div className="transition-all duration-300 ease-in-out">
              <Input
                value={formData.phoneNumber || ""}
                onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                placeholder={stepContent.placeholder}
                className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-3 text-base focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 w-full text-center"
                autoFocus
              />
            </div>
          )}

          {/* 성별 선택 */}
          {step === 3 && (
            <div className="transition-all duration-300 ease-in-out">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={formData.gender === "남성" ? "default" : "outline"}
                  onClick={() => updateFormData("gender", "남성")}
                  className={`h-16 text-lg font-medium ${
                    formData.gender === "남성"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                  }`}
                >
                  남성
                </Button>
                <Button
                  variant={formData.gender === "여성" ? "default" : "outline"}
                  onClick={() => updateFormData("gender", "여성")}
                  className={`h-16 text-lg font-medium ${
                    formData.gender === "여성"
                      ? "bg-pink-500 text-white hover:bg-pink-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                  }`}
                >
                  여성
                </Button>
              </div>
            </div>
          )}

          {/* 생년월일 입력 */}
          {step === 4 && (
            <div className="transition-all duration-300 ease-in-out">
              <Input
                value={formData.birthDate || ""}
                onChange={handleBirthDateChange}
                placeholder={stepContent.placeholder}
                maxLength={10}
                className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-3 text-base focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 w-full text-center"
                autoFocus
              />
            </div>
          )}

          {/* 출생시간 입력 - 완전히 새로 디자인 */}
          {step === 5 && (
            <div className="transition-all duration-300 ease-in-out">
              <Label className="text-sm text-gray-500 mb-4 block">{stepContent.subtitle}</Label>
              
              {/* 시간 입력 방식 선택 */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Button
                    variant={!noBirthTime ? "default" : "outline"}
                    onClick={() => {
                      setNoBirthTime(false)
                      updateFormData("birthTime", "")
                    }}
                    className={`h-12 text-base font-medium ${
                      !noBirthTime
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                    }`}
                  >
                    시간 입력
                  </Button>
                  <Button
                    variant={noBirthTime ? "default" : "outline"}
                    onClick={() => {
                      setNoBirthTime(true)
                      updateFormData("birthTime", "모름")
                    }}
                    className={`h-12 text-base font-medium ${
                      noBirthTime
                        ? "bg-gray-500 text-white hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                    }`}
                  >
                    모르겠어요
                  </Button>
                </div>

                {/* 시간 입력 섹션 */}
                {!noBirthTime && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Label className="text-sm text-blue-700 font-medium block">정확한 출생시간</Label>
                    <Input
                      type="time"
                      value={formData.birthTime?.includes(':') ? formData.birthTime : ''}
                      onChange={(e) => updateFormData("birthTime", e.target.value)}
                      className="border-2 border-blue-300 rounded-lg bg-white px-3 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full"
                      placeholder="14:30"
                    />
                    
                    <div className="text-center text-sm text-blue-600">
                      또는 대략적인 시간대를 선택하세요
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "새벽", value: "새벽", time: "00:00-06:00" },
                        { label: "아침", value: "아침", time: "06:00-12:00" },
                        { label: "오후", value: "오후", time: "12:00-18:00" },
                        { label: "저녁", value: "저녁", time: "18:00-24:00" }
                      ].map((timeSlot) => (
                        <Button
                          key={timeSlot.value}
                          type="button"
                          variant={formData.birthTime === timeSlot.value ? "default" : "outline"}
                          onClick={() => updateFormData("birthTime", timeSlot.value)}
                          className={`h-12 text-sm font-medium ${
                            formData.birthTime === timeSlot.value
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-white text-blue-600 hover:bg-blue-50 border-blue-300"
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-medium">{timeSlot.label}</div>
                            <div className="text-xs opacity-75">{timeSlot.time}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    
                    {formData.birthTime && (
                      <div className="text-center p-2 bg-white rounded border border-blue-300">
                        <span className="text-sm text-blue-700 font-medium">
                          선택된 시간: {formData.birthTime}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* 모르겠어요 섹션 */}
                {noBirthTime && (
                  <div className="text-center py-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl">❓</span>
                    </div>
                    <p className="text-gray-600 text-base mb-2">
                      출생시간을 모르셔도
                    </p>
                    <p className="text-gray-600 text-base mb-4">
                      기본 사주로 분석해드려요!
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg border border-gray-300">
                      <span className="text-sm text-gray-700 font-medium">
                        기본 사주로 진행
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 핸디캡 입력 */}
          {step === 6 && (
            <div className="transition-all duration-300 ease-in-out">
              <Input
                type="number"
                value={formData.handicap || ""}
                onChange={(e) => updateFormData("handicap", parseInt(e.target.value) || 0)}
                placeholder={stepContent.placeholder}
                min="0"
                max="54"
                className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-3 text-base focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 w-full text-center"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                핸디캡이 없으시면 0을 입력해주세요
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 1}
          className="flex-1 mr-2 bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          이전
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="flex-1 ml-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {step === totalSteps ? "완료" : "다음"}
        </Button>
      </div>

      {/* 요약 모달 */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">입력 정보 확인</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">이름</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">휴대폰번호</span>
                <span className="font-medium">{formData.phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">성별</span>
                <span className="font-medium">{formData.gender}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">생년월일</span>
                <span className="font-medium">{formData.birthDate}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">출생시간</span>
                <span className="font-medium">{formData.birthTime || "모름"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">핸디캡</span>
                <span className="font-medium">{formData.handicap}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowSummaryModal(false)}
                className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                수정
              </Button>
              <Button
                onClick={handleSummaryConfirm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 약관 동의 모달 */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">개인정보 처리 동의</h3>
            <div className="text-sm text-gray-600 mb-6 space-y-2">
              <p>입력하신 개인정보는 골프 운세 생성 목적으로만 사용됩니다.</p>
              <p>• 이름: 개인화된 운세 메시지 작성</p>
              <p>• 생년월일, 출생시간: 사주 분석</p>
              <p>• 핸디캡: 골프 수준별 맞춤 조언</p>
              <p>• 서비스 완료 후 자동 삭제</p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowTermsModal(false)}
                className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                취소
              </Button>
              <Button
                onClick={handleTermsAgree}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                동의하고 시작
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
