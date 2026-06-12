# Wear Clothes Implementation Plan

## 1. 프로젝트 목표
고급 의류 쇼핑몰 MVP를 만든다. 고객은 상품 탐색, 장바구니, 목업 결제, AI 착용 이미지 생성을 사용할 수 있고, admin은 상품/홈 섹션/배너를 관리하며 Agent를 통해 변경안을 만들고 승인 후 반영한다.

## 2. 기술 스택
- Framework: Next.js App Router + TypeScript
- Styling: Tailwind CSS + shadcn/ui + lucide-react
- Backend: Next.js Route Handlers
- Auth/DB/Storage: Supabase
- AI Image: OpenAI Image API, `OPENAI_IMAGE_MODEL=gpt-image-2`
- Admin Agent: OpenAI Agents SDK
- Test: Vitest, React Testing Library, Playwright

## 3. 우선순위
- P0: 프로젝트 실행 기반, 인증, 데이터 모델, 기본 쇼핑 플로우
- P1: AI 상품 이미지 생성, AI 착용 이미지 생성, admin 관리 화면
- P2: Admin Agent 제안/승인 플로우, UI 고급화, E2E 안정화
- Later: 실제 결제, 재고 차감, 배송 추적, 쿠폰, 리뷰, 반품/교환

## 4. Milestone 0: 프로젝트 초기화
목표: 빈 저장소를 실행 가능한 Next.js 앱으로 만든다.

작업:
- Next.js TypeScript 프로젝트 생성
- Tailwind CSS, shadcn/ui, lucide-react 설정
- ESLint, Prettier, 테스트 도구 설정
- `.env.local.example` 작성
- 기본 라우트 `/`, `/products`, `/cart`, `/checkout`, `/admin` 생성
- 공통 레이아웃, 헤더, 푸터, 버튼, 상품 카드 컴포넌트 생성

완료 기준:
- `npm run dev`로 로컬 실행 가능
- `npm test`와 `npm run lint` 통과
- 첫 커밋 가능 상태

## 5. Milestone 1: Supabase 기반 데이터/인증
목표: 고객과 admin을 구분하고 상품/홈 데이터를 저장할 수 있게 한다.

작업:
- Supabase 프로젝트 연결
- `profiles`, `products`, `home_sections`, `cart_items`, `mock_orders`, `ai_jobs`, `agent_proposals` 테이블 설계
- Supabase Storage 버킷 생성: `product-images`, `try-on-results`, `uploads`
- Row Level Security 정책 작성
- 로그인/로그아웃 UI 구현
- admin role 확인 유틸 구현

완료 기준:
- customer는 쇼핑 기능만 접근 가능
- admin만 `/admin` 접근 가능
- 서버 API에서 service role key가 클라이언트로 노출되지 않음

## 6. Milestone 2: 고객 쇼핑 플로우
목표: 쇼핑몰 MVP의 기본 구매 흐름을 완성한다.

작업:
- 홈 페이지: 히어로, 컬렉션, 추천 상품, 룩북 섹션
- 상품 목록: 카테고리, 색상, 사이즈, 가격 필터
- 상품 상세: 이미지 갤러리, 옵션 선택, 장바구니 추가
- 장바구니: 수량 변경, 삭제, 총액 계산
- 체크아웃: 배송지 입력, 목업 결제 완료
- `mock_orders`에 주문 스냅샷 저장

완료 기준:
- 홈 -> 상품 상세 -> 장바구니 -> 목업 결제 완료 플로우가 동작
- 실제 결제 API는 호출하지 않음
- 모바일 화면에서 레이아웃 깨짐 없음

## 7. Milestone 3: 고급 의류 쇼핑몰 UI
목표: 미니멀 럭셔리 브랜드 느낌을 구현한다.

작업:
- ivory, black, charcoal, muted gold 중심의 색상 시스템 적용
- 큰 상품 이미지, 넓은 여백, 얇은 라인, 절제된 타이포그래피 적용
- 상품 카드 비율 고정
- 홈 첫 화면에 브랜드 정체성과 대표 상품 이미지 노출
- 로딩, 빈 상태, 에러 상태 디자인

완료 기준:
- 데스크톱/모바일 모두 고급 쇼핑몰 느낌 유지
- 텍스트와 버튼이 겹치지 않음
- 상품 이미지 비율 변화로 레이아웃이 흔들리지 않음

## 8. Milestone 4: Admin 상품/홈 관리
목표: admin이 상품과 홈 화면을 직접 관리할 수 있게 한다.

작업:
- `/admin/products`: 상품 생성, 수정, 공개/비공개, 이미지 관리
- `/admin/home`: 히어로 배너, 컬렉션 섹션, 추천 상품 섹션 관리
- 상품 이미지 업로드/삭제
- 홈 섹션 정렬 순서 관리
- admin 전용 API 보호

완료 기준:
- admin이 상품을 등록하면 고객 상품 목록에 반영
- 홈 섹션 변경이 고객 홈에 반영
- customer는 admin API 접근 불가

## 9. Milestone 5: GPT Image 상품 사진 생성
목표: admin이 상품 설명으로 상품 이미지를 생성할 수 있게 한다.

작업:
- `POST /api/ai/product-image` 구현
- 입력값: product id, 상품명, 설명, 카테고리, 스타일 프롬프트
- OpenAI Image API에서 `gpt-image-2` 사용
- 생성 결과를 Supabase Storage에 저장
- `ai_jobs`에 요청/결과/상태 기록
- admin 상품 편집 화면에 "AI 이미지 생성" 버튼 추가

완료 기준:
- admin만 상품 이미지 생성 가능
- 생성 성공 시 상품 이미지로 선택 가능
- 실패 시 에러 메시지와 `ai_jobs.status=error` 기록

## 10. Milestone 6: 고객 AI 착용 이미지 생성
목표: 고객이 본인 사진을 업로드해 상품 착용 이미지를 생성할 수 있게 한다.

작업:
- 상품 상세에 "AI 착용 이미지 만들기" 영역 추가
- 사용자 사진 업로드, 동의 체크, 파일 크기/타입 검증
- `POST /api/ai/try-on` 구현
- 사용자 사진과 상품 이미지를 OpenAI Image API에 전달
- 생성 결과를 사용자별 Storage 경로에 저장
- 결과 화면에 생성 이미지, 다시 생성, 삭제 기능 제공

완료 기준:
- 로그인 고객만 사용 가능
- 원본 사용자 사진은 공개 URL로 노출하지 않음
- 생성 결과는 본인만 조회 가능
- 실패/진행 중 상태가 명확히 표시됨

## 11. Milestone 7: Admin Agent 제안/승인
목표: admin이 자연어로 홈페이지 변경안을 만들고 승인 후 반영하게 한다.

작업:
- Agents SDK 기반 admin agent 구성
- Agent 도구: 상품 조회, 홈 섹션 조회, 변경안 검증, 제안 저장
- `POST /api/admin/agent/propose` 구현
- `POST /api/admin/agent/approve` 구현
- 제안 JSON 구조 정의: products changes, home_sections changes, summary
- `/admin/agent` 화면 구현: 프롬프트 입력, 제안 미리보기, 승인/거절
- Agent는 DB를 직접 수정하지 않고 `agent_proposals`에 pending 상태로만 저장

완료 기준:
- admin 명령으로 변경안 생성 가능
- 승인 전 실제 상품/홈 데이터는 바뀌지 않음
- 승인 후에만 DB 반영
- 제안/승인/거절 이력이 남음

## 12. Milestone 8: 테스트와 품질 검증
목표: 핵심 플로우가 회귀 없이 유지되게 한다.

작업:
- 권한 테스트: customer/admin 접근 제어
- API 테스트: 상품 이미지 생성, 착용 이미지 생성, agent proposal 승인
- UI 테스트: 쇼핑 플로우, admin 상품 등록, 목업 체크아웃
- Playwright E2E: 홈 -> 상품 -> 장바구니 -> 체크아웃
- 반응형 스크린샷 검증

완료 기준:
- `npm test` 통과
- `npm run lint` 통과
- Playwright 핵심 플로우 통과
- 모바일/데스크톱에서 주요 화면 깨짐 없음

## 13. 환경변수
- `OPENAI_API_KEY`
- `OPENAI_IMAGE_MODEL=gpt-image-2`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 14. 참고 문서
- OpenAI Image generation: https://developers.openai.com/api/docs/guides/image-generation
- OpenAI Agents SDK quickstart: https://developers.openai.com/api/docs/guides/agents/quickstart
