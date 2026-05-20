# Desian GM Parking Auto Search MVP

차량번호 4자리를 저장한 뒤 다음 접속부터 자동으로 주차 위치를 검색하는 모바일 웹 MVP입니다.

## 구조

- `server.js`: Express 정적 서버와 `/api/search` 프록시 API
- `public/index.html`: 모바일 웹 UI와 LocalStorage 자동검색 로직
- `package.json`: 실행 스크립트와 의존성

## 실행 방법

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

`public/index.html` 파일을 직접 열면 `/api/search` 프록시가 없어서 검색할 수 없습니다. 반드시 위 `localhost` 주소로 접속해야 합니다.

## 동작 방식

프론트엔드는 외부 API를 직접 호출하지 않고 내부 API만 호출합니다.

```text
GET /api/search?plateNo=8111
```

`server.js`는 `siteId=S_DESIAN_GM`을 고정해서 외부 주차 위치 검색 API를 호출합니다. 서버 콘솔에는 외부 API 요청 URL과 응답 상태 코드가 출력됩니다.

외부 API 기본값은 기존 서비스 번들에서 확인된 아래 주소입니다.

```text
https://skt.binzary.com:9931/v1/guidance/location/search
```

다른 주소로 테스트해야 하면 서버 실행 시 `EXTERNAL_API_URL` 환경변수로 바꿀 수 있습니다.

## 테스트 방법

1. `http://localhost:3000`에 접속합니다.
2. 차량번호 4자리 숫자를 입력하고 검색합니다.
3. 결과가 1건이면 상세 화면으로 바로 이동하는지 확인합니다.
4. 결과가 여러 건이면 리스트가 표시되고, `이 차량 선택` 버튼을 눌렀을 때 상세 화면에 `등록되었습니다.` 메시지가 보이는지 확인합니다.
5. 상세 화면에서 `다른 차량 추가`를 눌러 다른 차량번호 4자리를 추가 등록합니다.
6. 브라우저를 새로고침하거나 다시 접속해서 등록된 차량들이 자동 검색되는지 확인합니다.
7. 상세 화면에서 `등록 삭제`를 눌렀을 때 입력 화면이 아니라 결과 화면에 `삭제되었습니다.` 메시지가 보이는지 확인합니다.
8. 개발자 도구 LocalStorage에 `desianGmParkingVehicle` 값이 배열로 저장되며, 전체 차량번호 `carNumber`가 저장되지 않는지 확인합니다.

## 이미지 Base URL 수정 위치

차량 사진 URL은 `public/index.html`의 `IMG_BASE_URL` 상수에서 수정합니다.

```js
const IMG_BASE_URL = 'https://skt.binzary.com:9932/';
```

외부 검색 API 주소는 프론트에 넣지 않고 `server.js`의 `EXTERNAL_API_URL`에서만 관리합니다.
