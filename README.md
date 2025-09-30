  <h1>🎵 SoundWave (2차 프로젝트)</h1>

  <h2>📌 프로젝트 개요</h2>
  <p><strong>SoundWave</strong>는 음악을 기반으로 한 플레이리스트/지도 연동 웹 애플리케이션입니다.<br>
  사용자는 곡 검색, 플레이리스트 재생, 지도 기반 위치 연동 기능을 통해 음악 경험을 확장할 수 있습니다.</p>

  <h2>🚀 주요 기능</h2>
  <ul>
    <li><strong>홈 화면(index.html)</strong><br>서비스 소개 및 진입점 제공</li>
    <li><strong>플레이리스트(playlist.html)</strong><br>곡 목록 조회 및 재생, 파형 시각화 및 UI 인터랙션</li>
    <li><strong>지도(map.html)</strong><br>위치별 플레이리스트 연동, Naver Maps API 활용</li>
  </ul>

  <h2>🛠 기술 스택</h2>
  <ul>
    <li><strong>Frontend</strong>: HTML5, CSS3, JavaScript (Vanilla JS, jQuery 일부)</li>
    <li><strong>지도 API</strong>: Naver Maps API</li>
    <li><strong>스타일링</strong>: Custom CSS, Reset CSS</li>
    <li><strong>개발환경</strong>: Git, Prettier</li>
  </ul>

  <h2>📂 디렉토리 구조</h2>
  <pre>
.
├── index.html          # 홈
├── playlist.html       # 플레이리스트 화면
├── map.html            # 지도 연동 화면
├── css/                # 스타일 시트
├── js/                 # 자바스크립트 로직
├── .gitignore
└── .prettierrc
  </pre>

  <h2>⚙️ 실행 방법</h2>
  <ol>
    <li>저장소 클론
      <pre><code>git clone &lt;repository-url&gt;
cd 2차sound</code></pre>
    </li>
    <li>Live Server(또는 단순히 브라우저에서) <code>index.html</code> 실행</li>
    <li>지도 기능을 위해 <strong>Naver Maps API Key</strong> 필요</li>
  </ol>

  <h2>📌 향후 개선 방향</h2>
  <ul>
    <li>음악 검색 API (예: iTunes, Spotify)와 완전한 연동</li>
    <li>사용자 로그인/회원가입 시스템 구현</li>
    <li>DB 연동을 통한 플레이리스트 저장 기능</li>
    <li>반응형 UI 개선</li>
  </ul>
