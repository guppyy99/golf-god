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
    birthTime: '12:00', // 정오 기본값
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

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 11) {
      let formatted = value
      if (value.length >= 3) {
        formatted = value.replace(/(\d{3})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3) => {
          if (p3) return `${p1}-${p2}-${p3}`
          if (p2) return `${p1}-${p2}`
          return p1
        })
      }
      updateFormData("phoneNumber", formatted)
    }
  }

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBirthDate(e.target.value)
    updateFormData("birthDate", formatted)
  }

  // 휴대폰 번호 유효성 검사
  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/
    return phoneRegex.test(phone)
  }

  // 생년월일 유효성 검사
  const isValidBirthDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 10) return false
    
    const [year, month, day] = dateStr.split('.').map(Number)
    const date = new Date(year, month - 1, day)
    
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day &&
           year >= 1900 && year <= new Date().getFullYear()
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.name.trim() !== ""
      case 2:
        return formData.phoneNumber && isValidPhoneNumber(formData.phoneNumber)
      case 3:
        return formData.gender
      case 4:
        return formData.birthDate && isValidBirthDate(formData.birthDate)
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
          title: "골신에게 운세를 볼\n당신의 이름은?",
          subtitle: "이름",
          placeholder: "이름을 입력해주세요",
        }
      case 2:
        return {
          title: `${formData.name || "김선우"}님의\n휴대폰 번호를 알려주세요.`,
          subtitle: "휴대폰 번호",
          placeholder: "010-1234-5678",
        }
      case 3:
        return {
          title: `${formData.name || "김선우"}님의\n성별을 알려주세요.`,
          subtitle: "성별",
        }
      case 4:
        return {
          title: `${formData.name || "김선우"}님의\n생년월일을 알려주세요.`,
          subtitle: "생년월일",
          placeholder: "1999.10.24",
        }
      case 5:
        return {
          title: `${formData.name || "김선우"}님의\n출생시간을 알려주세요.`,
          subtitle: "출생시간",
          placeholder: "00:00",
        }
      case 6:
        return {
          title: `${formData.name || "김선우"}님의\n평균 핸디캡을 알려주세요.`,
          subtitle: "핸디캡",
          helper: "기본값 28에서 조절하세요",
        }
      default:
        return { title: "", subtitle: "", placeholder: "" }
    }
  }

  const stepContent = getStepContent()

  return (
    <>
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[600px]">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 h-16 flex-shrink-0">
          {step > 1 && (
            <button onClick={handlePrevious} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {step === 1 && <div className="w-10" />}
          <h1 className="text-lg font-semibold text-gray-800">골프 운세 정보</h1>
          <div className="w-10" />
        </div>

        <div className="p-4 h-12 flex-shrink-0">
          <div className="w-10" />
        </div>

        <div className="flex-1 px-6 py-6 flex flex-col justify-start">
          <div className="w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight whitespace-pre-line">
                {stepContent.title}
              </h2>
            </div>

            <div className="flex flex-col justify-start">
              {step === 1 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-2 block">{stepContent.subtitle}</Label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder={stepContent.placeholder}
                    className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-3 text-base focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 w-full"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-2 block">{stepContent.subtitle}</Label>
                  <Input
                    value={formData.phoneNumber || ""}
                    onChange={handlePhoneNumberChange}
                    placeholder={stepContent.placeholder}
                    className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-3 text-base focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 w-full"
                  />
                  {formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber) && (
                    <p className="text-red-500 text-sm mt-2">
                      {formData.phoneNumber.length > 0 && !formData.phoneNumber.startsWith('010') 
                        ? "010으로 시작하는 번호를 입력해주세요" 
                        : "올바른 휴대폰 번호 형식이 아닙니다 (예: 010-1234-5678)"}
                    </p>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-4 block">{stepContent.subtitle}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={formData.gender === "남성" ? "default" : "outline"}
                      onClick={() => updateFormData("gender", "남성")}
                      className={`h-12 text-base font-medium ${
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
                      className={`h-12 text-base font-medium ${
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

              {step === 4 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-2 block">{stepContent.subtitle}</Label>
                  <Input
                    value={formData.birthDate || ""}
                    onChange={handleBirthDateChange}
                    placeholder={stepContent.placeholder}
                    maxLength={10}
                    className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-3 text-base focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 w-full"
                  />
                  {formData.birthDate && !isValidBirthDate(formData.birthDate) && (
                    <p className="text-red-500 text-sm mt-2">
                      올바른 생년월일을 입력해주세요 (예: 1990.05.15)
                    </p>
                  )}
                </div>
              )}

              {step === 5 && (
                <div className="transition-all duration-300 ease-in-out space-y-4">
                  <Label className="text-sm text-gray-500 mb-4 block">{stepContent.subtitle}</Label>
                  
                  {/* 모르겠어요 체크박스 */}
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      id="noBirthTime"
                      checked={noBirthTime}
                      onChange={(e) => {
                        setNoBirthTime(e.target.checked)
                        if (e.target.checked) {
                          updateFormData("birthTime", "모름")
                        } else {
                          updateFormData("birthTime", "12:00")
                        }
                      }}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="noBirthTime" className="text-sm text-gray-700 cursor-pointer">
                      출생시간을 모르겠어요
                    </label>
                  </div>

                  {!noBirthTime && (
                    <div className="space-y-4">
                      {/* 시간/분 롤링 선택기 */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <Label className="text-sm font-bold text-gray-700 mb-3 block text-center">태어난 시간을 선택해주세요!</Label>
                        
                        <div className="flex items-center justify-center space-x-4">
                          {/* 시 선택 */}
                          <div className="flex flex-col items-center">
                            <Label className="text-xs text-gray-500 mb-2">시</Label>
                            <select
                              value={formData.birthTime?.split(':')[0] || '12'}
                              onChange={(e) => {
                                const hour = e.target.value
                                const minute = formData.birthTime?.split(':')[1] || '00'
                                updateFormData("birthTime", `${hour}:${minute}`)
                              }}
                              className="w-16 h-12 text-center text-lg font-bold bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                            >
                              {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={i.toString().padStart(2, '0')}>
                                  {i.toString().padStart(2, '0')}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="text-2xl font-bold text-gray-400">:</div>

                          {/* 분 선택 (10분 단위) */}
                          <div className="flex flex-col items-center">
                            <Label className="text-xs text-gray-500 mb-2">분</Label>
                            <select
                              value={formData.birthTime?.split(':')[1] || '00'}
                              onChange={(e) => {
                                const hour = formData.birthTime?.split(':')[0] || '12'
                                const minute = e.target.value
                                updateFormData("birthTime", `${hour}:${minute}`)
                              }}
                              className="w-16 h-12 text-center text-lg font-bold bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                            >
                              {Array.from({ length: 6 }, (_, i) => {
                                const minute = i * 10
                                return (
                                  <option key={minute} value={minute.toString().padStart(2, '0')}>
                                    {minute.toString().padStart(2, '0')}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {noBirthTime && (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl">😢</span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        출생시간을 모르셔도 괜찮아요!<br />
                        정오로 진행할게요
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 6 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-4 block">{stepContent.helper}</Label>
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      onClick={() => updateFormData("handicap", Math.max(0, (formData.handicap || 28) - 1))}
                      className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl font-bold"
                    >
                      -
                    </Button>
                    <div className="text-4xl font-bold text-gray-800 min-w-[80px] text-center">
                      {formData.handicap || 28}
                    </div>
                    <Button
                      onClick={() => updateFormData("handicap", Math.min(54, (formData.handicap || 28) + 1))}
                      className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl font-bold"
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-white flex-shrink-0">
          {/* 진행률 표시 */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index < step 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-blue-600">
              {step}/{totalSteps}
            </span>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black disabled:opacity-50 h-12 text-base font-medium"
          >
            {step === totalSteps ? "완료" : "다음"}
          </Button>
        </div>
      </div>

      {showSummaryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-center mb-6">입력한 정보를 확인하세요!</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">이름</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">휴대폰 번호</span>
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
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowSummaryModal(false)}
                variant="outline"
                className="h-12 text-base font-medium border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                수정하기
              </Button>
              <Button
                onClick={handleSummaryConfirm}
                className="h-12 text-base font-medium bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}

      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-center mb-6">약관 동의</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-80 overflow-y-auto">
              <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">서비스 이용약관</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    본 서비스는 (주)메가존에서 제공하는 골프 운세 서비스입니다. 서비스 이용 시 다음 사항에 동의하는 것으로 간주됩니다:
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1 ml-4">
                    <li>• 서비스는 참고용이며, 실제 골프 실력 향상을 보장하지 않습니다</li>
                    <li>• 서비스 이용 중 발생하는 모든 결과에 대해 (주)메가존은 책임지지 않습니다</li>
                    <li>• 서비스 내용의 무단 복제, 배포, 수정을 금지합니다</li>
                    <li>• 서비스 이용 시 관련 법규를 준수해야 합니다</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">개인정보 처리방침</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    (주)메가존은 개인정보보호법에 따라 다음과 같이 개인정보를 처리합니다:
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1 ml-4">
                    <li>• <u>수집항목</u>: 이름, 생년월일, 생시, 성별, 핸디캡</li>
                    <li>• <u>수집목적</u>: 골프 운세 서비스 제공</li>
                    <li>• <u>보유기간</u>: 서비스 제공 완료 후 즉시 삭제</li>
                    <li>• <u>제3자 제공</u>: 제공하지 않음</li>
                    <li>• <u>개인정보보호책임자</u>: (주)메가존 개인정보보호팀</li>
                  </ul>
                </div>
                
                <div className="text-xs text-gray-500 border-t pt-2">
                  <p>
                    <u>서비스 이용약관</u> 및 <u>개인정보 처리방침</u>에 동의하는 것으로 간주합니다.
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleTermsAgree}
              className="w-full h-12 text-base font-medium bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              동의하고 운세보기
            </Button>
          </div>
        </div>
      )}
    </>
  )
}