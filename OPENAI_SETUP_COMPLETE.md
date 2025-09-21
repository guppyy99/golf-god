# OpenAI API 완벽 설정 가이드

## 🔑 1. OpenAI 계정 생성 및 로그인
1. [OpenAI Platform](https://platform.openai.com/) 접속
2. "Sign up" 또는 "Log in" 클릭
3. 계정 생성 또는 로그인 완료

## 💳 2. 결제 수단 등록 (필수!)
1. [Billing](https://platform.openai.com/account/billing) 페이지로 이동
2. "Add payment method" 클릭
3. 신용카드 또는 결제 수단 등록
4. **중요**: 결제 수단 없으면 API 사용 불가!

## 💰 3. 크레딧 구매
1. "Add credits" 클릭
2. 권장 금액: **$20-50** (테스트용)
3. 결제 완료
4. 크레딧 잔액 확인

## 🔐 4. API 키 생성
1. [API Keys](https://platform.openai.com/account/api-keys) 페이지로 이동
2. "Create new secret key" 클릭
3. 키 이름 입력: "golf-fortune-app"
4. **API 키 복사** (한 번만 표시됨!)
5. 안전한 곳에 저장

## ⚙️ 5. Vercel 환경변수 설정
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. "golf-god" 프로젝트 선택
3. Settings > Environment Variables 클릭
4. "Add New" 클릭
5. 설정값 입력:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-proj-...` (복사한 API 키)
   - **Environment**: Production, Preview, Development 모두 체크
6. "Save" 클릭

## 🧪 6. 테스트 및 확인
1. Vercel 자동 재배포 대기 (2-3분)
2. `/api/test-env` 접속하여 환경변수 확인
3. 골프 운세 앱에서 실제 테스트

## 📊 7. 사용량 모니터링
1. [Usage Dashboard](https://platform.openai.com/usage)에서 실시간 사용량 확인
2. 월간 사용량 한도 설정
3. 비용 알림 설정

## ❌ 자주 발생하는 문제들
- **401 Unauthorized**: API 키 잘못됨
- **429 Too Many Requests**: Rate limit 초과
- **402 Payment Required**: 크레딧 부족
- **환경변수 인식 안됨**: Vercel 재배포 필요

## ✅ 성공 확인 방법
- `/api/test-env`에서 "openai_api_key: 설정됨" 표시
- 골프 운세 생성 시 GPT 응답 받음
- Vercel Functions 로그에서 "OpenAI GPT로 운세 생성 완료" 메시지
