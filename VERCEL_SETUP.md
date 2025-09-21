# Vercel 배포 및 OpenAI API 설정 가이드

## 1. OpenAI API 키 설정

### OpenAI 계정에서 API 키 발급
1. [OpenAI Platform](https://platform.openai.com/)에 로그인
2. [API Keys](https://platform.openai.com/account/api-keys) 페이지로 이동
3. "Create new secret key" 클릭
4. API 키 복사 및 안전하게 보관

### 크레딧 구매 및 설정
1. [Billing](https://platform.openai.com/account/billing) 페이지로 이동
2. "Add payment method" 클릭하여 결제 수단 등록
3. 크레딧 구매 (권장: $20-50)
4. 사용량 모니터링 설정

## 2. Vercel 환경변수 설정

### Vercel 대시보드에서 설정
1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. golf-god 프로젝트 선택
3. Settings > Environment Variables로 이동
4. 다음 환경변수 추가:

```
OPENAI_API_KEY=sk-proj-your-api-key-here
```

### 환경변수 설정 옵션
- **Environment**: Production, Preview, Development 모두 선택
- **Value**: OpenAI API 키 입력
- "Save" 클릭

## 3. OpenAI Usage Policies 준수

### 현재 앱이 준수하는 정책
✅ **엔터테인먼트 목적**: 골프 운세는 재미를 위한 것임을 명시
✅ **개인정보 보호**: 사용자 정보는 골프 운세 생성 목적으로만 사용
✅ **안전한 콘텐츠**: 긍정적이고 건전한 골프 조언만 제공
✅ **투명성**: AI가 생성한 콘텐츠임을 명확히 표시

### 금지된 사용 사례 (현재 앱은 해당 없음)
❌ 실제 운세나 미래 예측
❌ 의학적 조언
❌ 금융 투자 조언
❌ 개인정보 수집 및 저장
❌ 유해하거나 부적절한 콘텐츠

## 4. 배포 확인

### 배포 후 확인사항
1. Vercel 배포 URL 접속
2. 골프 운세 앱 정상 작동 확인
3. OpenAI API 호출 성공 확인
4. 개인정보 수집 및 처리 정상 작동 확인

### 문제 해결
- API 키 오류: 환경변수 설정 확인
- 크레딧 부족: OpenAI 계정에서 크레딧 추가
- 배포 실패: GitHub 연동 및 빌드 로그 확인

## 5. 모니터링 및 관리

### OpenAI 사용량 모니터링
- [Usage Dashboard](https://platform.openai.com/usage)에서 실시간 사용량 확인
- 월간 사용량 한도 설정
- 비용 알림 설정

### Vercel 모니터링
- 배포 상태 확인
- 에러 로그 모니터링
- 성능 지표 확인
