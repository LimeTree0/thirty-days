# backend

thirty-days 프로젝트의 백엔드. Spring Boot 4.1 / Java 25 / PostgreSQL 기반의
Q&A 서비스 서버.

## 사전 요구사항

- **Java 25** — `build.gradle.kts`가 toolchain 25로 고정되어 있다. JDK는
  직접 설치해야 한다(Gradle wrapper는 Gradle 자체만 받아온다).
- **Docker** — 로컬 DB 기동용. Docker Desktop 4.x 이상 또는 동등한 엔진.

## 로컬 실행

```bash
# 1. 환경변수 준비
cp .env.example .env
# .env를 열어 POSTGRES_USER / POSTGRES_PASSWORD를 채운다.
# DB 이름(stackoverflow)은 docker-compose.yaml에 고정되어 있어 .env에 넣지 않는다.

# 2. Postgres 기동 (dev: db / test: db-test 두 서비스)
docker compose up -d
docker compose ps          # 두 컨테이너의 STATUS 가 healthy 인지 확인

# 3. 서버 기동 (local 프로파일)
./gradlew bootRun --args='--spring.profiles.active=local'

# 4. 확인
curl http://localhost:8080/actuator/health
# {"status":"UP", ...} 응답이면 성공
```

`.env`는 커밋하지 않는다. DB 자격증명이 `.env`와 `application-local.properties`
두 곳에 나뉘어 있는 이유와 감수한 트레이드오프는 아래 **설정 구조**를 참조.

## 테스트 실행

```bash
./gradlew test
```

테스트는 별도의 Postgres 인스턴스(`db-test`, 포트 **5433**)를 사용한다.
데이터는 tmpfs에 있어 **컨테이너 생명주기 동안만 유지되며, 컨테이너를 내리면
소멸한다**. 컨테이너를 그대로 두고 `./gradlew test`를 여러 번 돌리면 실행 간
상태가 공유된다 — 실행 간 데이터 정리 전략은 첫 테스트를 작성할 때 함께
설계한다. 이슈 #13 참조.

단일 테스트만 돌리려면:

```bash
./gradlew test --tests com.limecoding.backend.BackendApplicationTests
```

## 리셋이 필요할 때

```bash
# 컨테이너만 제거. 볼륨(= dev DB의 데이터)은 보존된다.
docker compose down

# 볼륨까지 파괴. dev DB(db) 데이터가 전멸한다 — 되돌릴 수 없다.
docker compose down -v
```

`-v` 가 필요한 경우: 스키마/시드 데이터가 잘못 들어가 볼륨에 영속화된 채로
남아 있고, 컨테이너 재기동으로는 풀리지 않을 때. 그 외에는 쓰지 않는다.
test DB(`db-test`)는 tmpfs라 `-v` 없이 `down`만으로도 소멸한다.

## 패키지 구조 컨벤션

**최상위는 도메인 패키지**로 나눈다. `controller/`, `service/` 같은 레이어
패키지를 최상위로 두지 않는다.

```
com.limecoding.backend
├── question/           (도메인 예시)
│   ├── QuestionController.java
│   ├── QuestionService.java
│   ├── QuestionRepository.java
│   └── Question.java   (엔티티 / 도메인 모델)
├── answer/
├── vote/
├── member/
├── tag/
├── global/             (도메인에 속하지 않는 것들)
│   ├── config/
│   └── exception/
└── BackendApplication.java
```

### 도메인 패키지 내부

- 클래스는 **플랫하게** 배치한다. `controller/`, `dto/` 같은 하위 패키지를
  선제적으로 만들지 않는다. 파일명 접미사(`*Controller`, `*Service`,
  `*Repository`)로 레이어를 드러낸다.
- 한 도메인의 파일이 늘어나 탐색이 불편해지면 그 시점에 하위 패키지로
  쪼갠다. 임계치는 경험적으로 판단하고, 쪼갠 이유는 커밋 메시지에 남긴다.

### 새 도메인이 생길 때

- 판정 기준: 그 개념이 **자체 엔티티/테이블을 가지는가**. 그렇다면 도메인
  패키지로 승격. 아니라면 기존 도메인의 종속물이거나 `global/` 후보다.
- 파일 이동 커밋은 기능 추가와 분리한다(CONTRIBUTING §1.3의 "타입이 두 개
  필요하면 커밋을 쪼갠다"에 따른다).

### `global/`에 들어갈 수 있는 것

- 도메인 무관한 전역 설정(`WebConfig`, `JpaConfig` 등)
- 공통 예외 처리(`GlobalExceptionHandler`)와 공용 예외 타입
- 두 개 이상 도메인이 공유하는 순수 유틸

들어갈 수 **없는** 것: 특정 도메인에만 쓰이는 코드, "일단 어디 둘지
몰라서" 옮긴 클래스. 이 조건을 벗어난 파일은 도메인 패키지로 되돌린다.
쓰레기장이 되지 않도록 유지하는 것이 이 규칙의 목적이다.

## 설정 구조

프로파일별 설정 파일:

| 프로파일   | 파일                              | 용도                          |
| ------ | ------------------------------- | --------------------------- |
| (기본)   | `application.properties`        | 프로파일 공통 설정                  |
| `local` | `application-local.properties`  | 로컬 개발용 DB(5432) 접속           |
| `test`  | `application-test.properties`   | 테스트 DB(5433) 접속              |

프로파일은 `--spring.profiles.active=<name>` 또는 환경변수
`SPRING_PROFILES_ACTIVE=<name>` 로 지정한다. IntelliJ Run Configuration의
"Active profiles" 필드도 같은 값을 받는다.

### 환경변수 (`.env`)

`.env`는 오직 `docker compose`가 Postgres 컨테이너를 초기화할 때만 읽는다.
애플리케이션(Spring)은 이 값을 직접 참조하지 않는다 — 접속에 쓰는 값은
`application-local.properties` / `application-test.properties`에 별도로 있다.
자격증명이 바뀌면 두 곳을 함께 갱신해야 하며, 어긋나면 조용히 접속 실패한다.

| 이름                  | 용도                        |
| ------------------- | ------------------------- |
| `POSTGRES_USER`     | Postgres 초기 사용자           |
| `POSTGRES_PASSWORD` | Postgres 초기 사용자 비밀번호      |

DB 이름은 `stackoverflow` 로 `docker-compose.yaml`에 고정되어 있어 `.env`에
넣지 않는다.

### 감수한 트레이드오프: 자격증명 이중화

자동 연결 옵션(예: `spring-boot-docker-compose`가 compose 파일을 읽어
DataSource를 자동 구성)을 쓰지 않은 이유는 이슈 #13 코멘트를 참조.
요약: 설정을 명시적으로 이해하며 가는 학습 목적. 이 결정이 뒤집히면
이 섹션과 위의 환경변수 설명 두 곳이 함께 바뀐다.

## 참고

- DB 선택 근거: [ADR-0002](../docs/adr/0002-database.md)
- 스캐폴딩 및 패키지 구조 논의: 이슈 #13
- 커밋 / 브랜치 / PR 규칙: [CONTRIBUTING.md](../CONTRIBUTING.md)
