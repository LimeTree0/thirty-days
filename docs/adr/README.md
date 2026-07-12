# Architecture Decision Records

이 디렉토리는 프로젝트의 주요 결정과 그 근거를 기록한다.
형식은 [Michael Nygard의 ADR](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)을 따른다.

## 운용 규칙

- **작성 기준**: 바꾸기 비싸거나, 나중에 "왜?"라고 물을 것 같은 결정.
변수명 컨벤션 급은 쓰지 않는다.
- **번호**: 0001부터 순차 증가. 파일명은 `NNNN-kebab-case-요약.md`.
- **불변성**: 승인된 ADR은 수정하지 않는다. 결정이 뒤집히면 새 ADR을 쓰고,
기존 ADR의 상태를 `대체됨 → ADR-NNNN`으로만 갱신한다.
결정의 역사가 남는 것이 목적이다.
- **절차**: Draft PR로 제안 → 논의 → 머지 = 확정 (CONTRIBUTING.md 3.1 참조)
- 새 ADR은 [template.md](template.md)를 복사해서 시작한다.

## 목록


| 번호   | 제목                                       | 상태  |
| ---- | ---------------------------------------- | --- |
| 0001 | [머지 방식 선택](0001-merge-strategy.md)       | 승인됨 |
| 0002 | [메인 DB로 PostgreSQL 채택](0002-database.md) | 승인됨 |


