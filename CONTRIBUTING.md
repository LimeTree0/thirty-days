# Contributing Guide

이 문서는 thirty-days 프로젝트의 Git 워크플로 규칙을 정의한다.
기여자는 사람(maintainer)과 AI(Claude Code, 프론트엔드 담당) 둘뿐이지만,
오픈소스 관행을 따르는 것 자체가 이 프로젝트의 훈련 목표 중 하나이므로
실제 오픈소스 프로젝트에 준하는 규칙을 적용한다.

> 관련 원칙: **문서화되지 않은 합의는 존재하지 않는 것으로 간주한다.**
> 규칙이 바뀌면 이 문서를 먼저 고친다.

---

## 1. 커밋 컨벤션

### 1.1 형식 — Conventional Commits

```
<type>(<scope>): <subject>
                              ← 빈 줄 (필수)
<body>                        ← 선택, 단 "왜"가 자명하지 않으면 작성
                              ← 빈 줄
<footer>                      ← 선택
```

### 1.2 언어

- **커밋 메시지는 영어로 작성한다.**
- 제목은 명령형(imperative mood)으로 시작한다: `Add`, `Fix`, `Rewrite` (not `Added`, `Fixes`)
- 판별법: "If applied, this commit will ___" 에 넣어 문장이 성립해야 한다.
- 제목은 50자 안팎, 마침표 없이, 관사(a/the)는 생략 가능.
- 본문은 정상적인 문장으로 쓴다. 문법 완벽주의는 금지 — 일단 쓰고 리뷰에서 다듬는다.

### 1.3 타입

| 타입 | 용도 |
|------|------|
| `feat` | 사용자 관점의 새 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서만 변경 |
| `refactor` | 동작 변화 없는 구조 변경 (feat도 fix도 아닌 코드 변경) |
| `test` | 테스트 추가/수정만 |
| `chore` | 빌드, 의존성, 설정 등 잡무 |
| `ci` | CI 파이프라인 설정 |

**타입이 두 개 필요하면 커밋을 쪼갠다.** 이것이 커밋 단위의 기준이다.

### 1.4 스코프

| 스코프 | 범위 |
|--------|------|
| `backend` | backend/ 하위 |
| `frontend` | frontend/ 하위 |
| `simulator` | simulator/ 하위 |
| `adr` | docs/adr/ 하위 |
| `project` | 루트 문서 (README, STATUS.md, PROJECT.md 등) |
| `ci` | CI/CD 설정 |

백엔드 규모가 커지면 도메인 단위 스코프(`question`, `reputation` 등)로
세분화를 검토한다. 그 시점에 이 표를 갱신한다.

### 1.5 본문 — "왜"를 쓴다

diff가 이미 말해주는 "무엇을"은 반복하지 않는다. 본문에는 diff에 없는
맥락(왜 필요한가, 무엇을 포기했나, 주의점)을 쓴다. 상용 패턴:

- `This allows ~ / This ensures ~ / This prevents ~`
- `Previously, ~. Now, ~.` (변경 전후 대비, fix에 적합)
- `Without this, ~`
- `Note that ~` (리뷰어가 알아야 할 주의점)

### 1.6 푸터

- 이슈 참조: `Refs: #12`
- 이슈 자동 닫기: `Closes: #12` (PR 머지 시 해당 이슈가 닫힘)
- 파괴적 변경: `BREAKING CHANGE: <설명>` (API 계약 변경 시 필수)

### 1.7 예시

```
docs(project): rewrite README as project manifesto

Previously, the README contained a placeholder note.
Now, it declares the project goal, rules, and roles.
```

```
feat(backend): add reputation calculation on answer acceptance

Accepting an answer grants +15 to the answerer and +2 to
the accepter, following the Stack Overflow model.

Note that un-acceptance must reverse both grants — covered
by ReputationServiceTest.

Refs: #23
```

---

## 2. 브랜치 전략

### 2.1 main 브랜치

- `main`은 Ruleset으로 보호된다: **직접 push 금지, PR을 통해서만 변경 가능.**
- Bypass list는 비워둔다. maintainer 본인에게도 규칙이 적용된다.
- `main`은 항상 배포 가능한 상태를 유지한다 (2막부터 실질 효력 발생).

### 2.2 작업 브랜치 네이밍

```
<영역>/<작업-요약(kebab-case)>
```

| 프리픽스 | 사용자 | 예시 |
|----------|--------|------|
| `backend/` | maintainer | `backend/reputation-system` |
| `frontend/` | Claude Code | `frontend/question-list-page` |
| `simulator/` | maintainer | `simulator/persona-agent-loop` |
| `docs/` | maintainer | `docs/kickoff-documents` |
| `infra/` | maintainer | `infra/vps-setup` |

- Claude Code는 `frontend/` 프리픽스 브랜치만 생성할 수 있다.
- 브랜치는 머지 후 삭제한다 (GitHub 설정: Automatically delete head branches 권장).

### 2.3 작업 디렉토리 분리

- maintainer와 Claude Code는 **서로 다른 로컬 디렉토리**(별도 클론 또는
  git worktree)에서 작업한다. 같은 작업 디렉토리를 공유하지 않는다.
- 동기화는 오직 원격(GitHub)의 push/pull로만 일어난다.

---

## 3. Pull Request 등급제

프로세스 비용은 매일 지불하는 세금이므로, 마찰이 훈련 가치가 있는 지점에만
정식 절차를 적용한다.

### 3.1 정식 PR — 리뷰 필수

다음은 반드시 리뷰를 거쳐 머지한다:

| 대상 | 작성자 | 리뷰어 |
|------|--------|--------|
| 프론트엔드 변경 전체 | Claude Code | maintainer |
| API 계약 변경 (openapi.json에 영향) | maintainer | Claude Code(프론트 영향 검토) |
| ADR (결정 제안) | maintainer | PL 세션에서 논의 후 머지 |

- PR 본문에는 **무엇을 / 왜 / 리뷰 포인트** 세 가지를 쓴다.
- 프론트 PR은 스크린샷을 포함한다.
- 리뷰 코멘트에는 수정 커밋 또는 반론으로 응답한다. 무응답 머지 금지.

### 3.2 셀프 머지 PR — 경량

- 1막의 백엔드 작업이 기본 대상.
- PR은 만들되(변경 단위 기록 + CI 통과 확인), 리뷰 대기 없이 maintainer가 머지.
- 설계가 갈리는 지점에서는 선택적으로 PL에게 PR URL을 공유해 리뷰 의견을
  받을 수 있다. 반영 여부는 maintainer가 결정한다.

### 3.3 경량 변경

- 문서 오타, STATUS.md 갱신, 설정 미세조정 등.
- main이 보호되어 있으므로 이들도 PR을 거치지만, 본문은 제목으로 갈음할 수 있고
  즉시 셀프 머지한다. 가능하면 진행 중인 다른 PR에 편승시킨다.

### 3.4 머지 방식

- **미정.** Git 워크플로 리허설(머지 3종 실험) 후 ADR-001에서 결정한다.
- 결정 후 GitHub Ruleset의 Allowed merge methods를 좁혀 설정으로 강제한다.
- <!-- ADR-001 확정 시 이 섹션을 갱신할 것 -->

---

## 4. 파일 소유권

충돌 방지를 위해 공유 파일에는 단일 작성자 원칙을 적용한다.

| 경로 | 소유자 | 규칙 |
|------|--------|------|
| `backend/**` | maintainer | Claude Code 수정 금지 |
| `frontend/**` | Claude Code | maintainer는 리뷰로만 개입 |
| `openapi.json` | maintainer (백엔드) | springdoc 생성 산출물. 프론트는 읽기 전용.<br>계약 변경 요청은 파일 수정이 아니라 **이슈로** 제기한다 |
| `STATUS.md` | maintainer | PL 세션 종료 시 갱신 |
| `docs/adr/**` | maintainer | 결정 확정 후에만 머지 |
| `frontend/CLAUDE.md` | 공동 | 페르소나 정의부: maintainer / 합의 누적부: Claude Code |

---

## 5. 동기화 규칙

- **계약 변경이 머지되면**, 프론트는 다음 작업 시작 전에 반드시:
  1. `main`을 pull (또는 rebase)
  2. orval 재생성으로 클라이언트 코드 갱신
- 백엔드 브랜치가 오래 살아 있으면 주기적으로 `main`을 rebase해서
  머지 시점의 충돌을 예방한다.

---

## 6. 시크릿

- `.env`, 키 파일(`*.pem` 등), VPS IP 등은 **절대 커밋하지 않는다.**
- 공개 리포에 한 번 올라간 시크릿은 히스토리에 영구히 남는다.
  유출 시 삭제가 아니라 **즉시 rotate**가 대응이다.
- `.gitignore`에 시크릿 패턴을 선제적으로 등록한다.

---

## 변경 이력

| 날짜 | 변경 |
|------|------|
| 2026-07-10 | 최초 작성 (킥오프 합의 사항 정리) |
