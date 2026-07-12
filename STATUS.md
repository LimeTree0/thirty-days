# STATUS.md

> PL 세션 싱크의 기준 파일. 세션 종료 시 갱신한다.
> 갱신에 1분 이상 걸리면 이 문서가 너무 무거워진 것이다.

**최종 갱신**: 2026-07-12

---

## 현재 단계

**1막 — 백엔드/프론트 병렬 개발** (0막 종료: 2026-07-12)

- 백엔드: maintainer 단독, AI 코드 작성 없음
- 프론트: Claude Code(전용 계정), OpenAPI 계약 발행 후 착수
- 범위: 마일스톤 `v0.1` — 이슈 #12~#23

## 최근 결정

- **ADR-0002: 메인 DB로 PostgreSQL 채택** (승인 2026-07-12, #12 종결).
  결정 축은 기능이 아니라 학습 투자의 회수처 — 상세는 ADR 본문.
- **백엔드 스캐폴딩 완료** (#13, PR #30). 확정 사항: Gradle Kotlin DSL /
  Java 25 + Spring Boot 4.1 / 도메인 우선 패키지(근거는 #13 코멘트) /
  Docker Compose로 dev(5432, 영속)·test(5433, tmpfs 휘발) DB 분리 /
  테스트는 진짜 PostgreSQL 대상(H2·Testcontainers 기각, #13 코멘트) /
  Actuator 포함(health로 DB 연결 검증, 2막 모니터링 기반)
- **자격증명 3단 정책.** test: 고정값 커밋 / local: 기본값 placeholder /
  prod: 환경변수 주입 only. 판정 기준은 "유출 시 피해"
- **GitGuardian 오탐 처리 방식 확정.** 인시던트 단위 ignore(사유 기록)
  우선, 경로 제외는 최후 수단. `.gitguardian.yaml`은 ignored_matches로
  운용 — 발효는 간막 CI부터

## 진행 중

없음. 다음 세션은 OpenAPI 계약 전략 결정부터.

## 다음 할 일

- [ ] **OpenAPI contract-first vs code-first 결정** — 프론트(Claude Code)
      착수 시점의 블로커. Boot 4.x와 도구(springdoc 등) 호환성 확인 포함
- [ ] 첫 도메인 구현 착수 (구현 순서는 이슈 「선행」 참조)
- [ ] CONTRIBUTING §6 보강: 시크릿 판정 기준("유출 시 피해") 및
      스캐너 경보 트리아지 절차 1줄 추가

## 미결 사항 (열린 질문)

- **스키마 관리 방식** (ddl-auto 배제, Flyway 등 마이그레이션 도구)
  → 첫 엔티티 작성 시 정식 결정 (ADR 여부 포함)
- **테스트 간 데이터 정리 전략** (compose test DB는 컨테이너 생존 중
  상태 공유) → 첫 테스트 작성 시 설계
- **목록 페이지네이션 방식** (offset vs cursor) → #17 착수 시 ADR
- **검색 · 태그 필터 조합** → #23 착수 시 이슈 등록
- CONTRIBUTING.md 4장: API 계약 변경 PR의 리뷰어 문구 — Claude Code
  전용 계정 도입으로 공식 승인이 가능해져 전제가 바뀜. 승인을 필수로
  걸지(계정 운용 부담) 권고로 둘지 재판단 필요

## 세션 로그

| 날짜 | 요약 |
|------|------|
| 2026-07-10 | 킥오프. 프로젝트 구조/역할/규칙 합의, 리포 생성, Git 리허설 시작 |
| 2026-07-11 | Git 리허설 마무리(머지 3종, 충돌 3회). ADR-001 머지 전략 확정, PR 템플릿 도입, 요구사항 v0.1 확정 및 `docs/` 이동, SLO를 간막으로 연기 |
| 2026-07-12 | CLAUDE.md·requirements 머지, .gitignore 도입, Claude Code 전용 계정 분리, 마일스톤 v0.1 + 이슈 12개(#12~#23) 등록. **0막 종료, 1막 개막** |
| 2026-07-12 | ADR-0002(PostgreSQL) 승인·머지, #12 종결. #13 스캐폴딩 완주(PR #30): compose dev/test DB, 프로파일·Actuator, README·패키지 컨벤션. GitGuardian 첫 경보 트리아지(오탐 판정·기록). 잡무 3건 정리 |