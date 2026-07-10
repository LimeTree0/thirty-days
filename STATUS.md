# STATUS.md

> PL 세션 싱크의 기준 파일. 세션 종료 시 갱신한다.
> 갱신에 1분 이상 걸리면 이 문서가 너무 무거워진 것이다.

**최종 갱신**: 2026-07-10

---

## 현재 단계

**0막 — 준비** (Git 워크플로 리허설 진행 중)

## 최근 결정

- 리포 이름 `thirty-days`, GitHub 공개 리포로 진행
- main 브랜치 Ruleset 보호 (PR 필수, bypass 없음)
- 커밋: Conventional Commits, 영어. 본문은 하루 1~2개만 연습 (과부하 방지)
- 머지 방식: **미정** — 머지 3종 실험 후 ADR-001에서 결정
- 킥오프 문서 체계 확정: PROJECT.md(헌장) / STATUS.md(상태) / CONTRIBUTING.md(Git 규칙)

## 진행 중

- [x] Git 리허설: Conventional Commits로 킥오프 문서 커밋 쌓기
- [x] Git 리허설: 머지 3종 실험 (merge / squash / rebase)
- [x] Git 리허설: 충돌 재현과 해소 3회 (merge / rebase / abort)

## 다음 할 일

- [x] ADR-001: 머지 전략 결정
- [x] ADR 템플릿 + `docs/adr/` 디렉토리 추가
- [x] `.gitignore` 추가 (시크릿 패턴 포함)
- [x] `frontend/CLAUDE.md` 페르소나 초안
- [x] `docs/requirements.md` 초안 — **maintainer 작성** 영역
- [x] `docs/slo.md` 초안 — **maintainer 작성** 영역

## 미결 사항 (열린 질문)

- DB 선택 (PostgreSQL vs MySQL) → ADR-002 예정
- CONTRIBUTING.md 4장: API 계약 변경 PR의 리뷰어를 Claude Code로 명시했는데,
  실제 운용(공식 승인 불가)에 맞춰 문구를 낮출지 여부

## 세션 로그

| 날짜 | 요약 |
|------|------|
| 2026-07-10 | 킥오프. 프로젝트 구조/역할/규칙 합의, 리포 생성, Git 리허설 시작 |
