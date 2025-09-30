🎵 SoundWave (2차 프로젝트)
📌 프로젝트 개요

SoundWave는 음악을 기반으로 한 플레이리스트/지도 연동 웹 애플리케이션입니다.
사용자는 곡 검색, 플레이리스트 재생, 지도 기반 위치 연동 기능을 통해 음악 경험을 확장할 수 있습니다.

🚀 주요 기능

홈 화면(index.html)

서비스 소개 및 진입점 제공

플레이리스트(playlist.html)

곡 목록 조회 및 재생

파형 시각화 및 UI 인터랙션

지도(map.html)

위치별 플레이리스트 연동

Naver Maps API 활용

사용자별 플레이 기록 및 정보 제공

🛠 기술 스택

Frontend: HTML5, CSS3, JavaScript (Vanilla JS, jQuery 일부)

지도 API: Naver Maps API

스타일링: Custom CSS, Reset CSS

개발환경: Git, Prettier

📂 디렉토리 구조
.
├── index.html          # 홈
├── playlist.html       # 플레이리스트 화면
├── map.html            # 지도 연동 화면
├── css/                # 스타일 시트
├── js/                 # 자바스크립트 로직
├── .gitignore
└── .prettierrc

⚙️ 실행 방법

저장소 클론

git clone <repository-url>
cd 2차sound


Live Server(또는 단순히 브라우저에서) index.html 실행

지도 기능을 위해 Naver Maps API Key 필요

📌 향후 개선 방향

음악 검색 API (예: iTunes, Spotify)와 완전한 연동

사용자 로그인/회원가입 시스템 구현

DB 연동을 통한 플레이리스트 저장 기능

반응형 UI 개선
