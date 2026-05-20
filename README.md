# 광명유플래닛데시앙 주차 위치 자동 검색 서비스

차량번호 4자리를 한 번 등록하면 다음 접속부터 자동으로 주차 위치를 검색해주는 모바일 웹서비스입니다.

포트폴리오 목적의 MVP이며, 브라우저에서 직접 호출하기 어려운 외부 주차 위치 API를 Express 프록시 서버를 통해 호출하도록 구성했습니다.

## Demo

- 배포 URL: https://desian-parking-demo.onrender.com/
- 테스트 차량번호: 8111

예시:

```text
Demo: https://desian-parking-demo.onrender.com/
Test: 8111
```

Render 무료 인스턴스는 일정 시간 사용하지 않으면 잠들 수 있어 첫 접속 시 로딩이 지연될 수 있습니다.

## 주요 기능

- 차량번호 4자리 검색
- 최초 등록 후 다음 접속부터 자동 검색
- LocalStorage 기반 차량 등록 정보 저장
- 다중 차량 등록 및 삭제
- 검색 결과 1건일 때 상세 화면 표시
- 검색 결과 여러 건일 때 차량 리스트 표시
- 차량 사진, 촬영시각, 주차장명, 주차층, 기둥번호 표시
- 모바일 화면 기준 반응형 UI
- Express 프록시 서버를 통한 CORS 문제 해결

## 기술 스택

- HTML
- CSS
- JavaScript
- Node.js
- Express
- Render 배포

## 프로젝트 구조

```text
desian-parking-demo/
├─ package.json
├─ package-lock.json
├─ server.js
├─ README.md
└─ public/
   └─ index.html
```

## 동작 방식

프론트엔드는 외부 주차 API를 직접 호출하지 않고 내부 API만 호출합니다.

```text
GET /api/search?plateNo=8111
```

`server.js`는 `siteId=S_DESIAN_GM`을 고정해 외부 주차 위치 검색 API를 호출합니다.

```text
GET https://skt.binzary.com:9931/v1/guidance/location/search?siteId=S_DESIAN_GM&plateNo={plateNo}
```

이 구조를 사용한 이유는 브라우저에서 외부 API를 직접 호출하면 CORS 정책에 의해 요청이 차단될 수 있기 때문입니다.

## 개인정보 처리

이 서비스는 전체 차량번호를 LocalStorage에 저장하지 않습니다.

브라우저에 저장하는 값은 아래 항목만 사용합니다.

- siteId
- plateNo
- guidanceCurrentPk
- guidanceEventPk
- slotId
- registeredAt

전체 차량번호인 `carNumber`는 LocalStorage에 저장하지 않도록 설계했습니다.

## 로컬 실행 방법

프로젝트 폴더에서 아래 명령을 실행합니다.

```bash
npm install
npm start
```

Windows PowerShell에서 `npm.ps1` 실행 정책 오류가 나면 아래처럼 실행합니다.

```powershell
npm.cmd install
npm.cmd start
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:3000
```

`public/index.html` 파일을 직접 열면 `/api/search` 프록시 서버가 없어서 검색할 수 없습니다. 반드시 `localhost` 또는 배포된 Render 주소로 접속해야 합니다.

## 테스트 방법

1. `http://localhost:3000` 또는 Render 배포 URL에 접속합니다.
2. 차량번호 4자리 숫자를 입력하고 검색합니다.
3. 결과가 1건이면 상세 화면이 표시되는지 확인합니다.
4. 결과가 여러 건이면 차량 리스트가 표시되는지 확인합니다.
5. `이 차량 등록` 버튼으로 차량을 등록합니다.
6. 브라우저를 새로고침하거나 다시 접속해 자동 검색이 동작하는지 확인합니다.
7. `다른 차량 추가`로 차량을 추가 등록합니다.
8. 각 차량 카드의 `삭제` 버튼으로 등록 차량을 삭제합니다.
9. 등록된 차량이 모두 삭제되면 처음 검색 화면으로 돌아가는지 확인합니다.

## 주요 구현 포인트

- CORS 문제를 피하기 위해 Express 프록시 API 구현
- `process.env.PORT`를 사용해 Render 배포 환경 대응
- `LocalStorage`에 저장된 차량 정보를 기준으로 다음 접속 시 자동 검색
- 등록된 차량이 여러 대일 때 각 차량을 다시 조회해 최신 주차 위치 표시
- 차량 등록/삭제 후 저장된 차량 목록을 기준으로 재검색
- 모바일 화면에서 잘리지 않도록 `100dvh`, safe-area, 반응형 여백 적용

## 배포

Render Web Service 기준 설정값:

```text
Build Command: npm install
Start Command: npm start
```

Render에서 Start Command를 `node start`로 입력하면 `Cannot find module 'start'` 오류가 발생합니다. 반드시 `npm start` 또는 `node server.js`를 사용해야 합니다.

## 이미지 URL 설정

차량 사진 URL의 기본 주소는 `public/index.html`의 `IMG_BASE_URL` 상수에서 관리합니다.

```js
const IMG_BASE_URL = 'https://skt.binzary.com:9932/';
```

## 향후 개선 아이디어

- 포트폴리오용 데모 모드 추가
- 테스트 차량번호 샘플 데이터 제공
- PWA 설정 추가
- 홈 화면 아이콘 추가
- API 장애 시 대체 안내 화면 개선
