$(function () {
  let audioCtx, analyser, source, dataArray, bufferLength, animationId;

  // ✅ 오디오 엘리먼트: 한 번만 참조
  const audio = $("#player")[0];

  // 캔버스
  const canvas = document.getElementById("waveform");
  const ctx = canvas.getContext("2d");

  const searchUrl =
    "https://itunes.apple.com/search?term=blinding+lights&entity=musicTrack&limit=1";

  // 곡 불러오기 + 재생
  $("#loadSong").on("click", function () {
    $("#playPause").text("⏸️");
    $.getJSON(searchUrl, function (res) {
      if (res.results && res.results.length > 0) {
        const song = res.results[0];
        const previewUrl = song.previewUrl;

        // ✅ CORS는 src 설정 전에
        audio.crossOrigin = "anonymous";
        audio.src = previewUrl;

        // 오디오 컨텍스트 초기화 (최초 1회)
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          source = audioCtx.createMediaElementSource(audio);

          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 2048;
          bufferLength = analyser.frequencyBinCount;
          dataArray = new Uint8Array(bufferLength);

          source.connect(analyser);
          analyser.connect(audioCtx.destination);
        }

        if (audioCtx.state === "suspended") audioCtx.resume();

        // 재생
        audio.play().catch(() => {});

        // ✅ 중복 드로잉 방지
        cancelAnimationFrame(animationId);
        draw();
      }
    });
  });

  function draw() {
    animationId = requestAnimationFrame(draw);

    if (!analyser || !dataArray) return;

    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1db954";
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  // ▶️/⏸️
  $("#playPause").on("click", function () {
    if (audio.paused) {
      if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
      audio.play();
      $(this).text("⏸️");

      // 파형이 멈춰있다면 재개
      if (!animationId) draw();
    } else {
      audio.pause();
      $(this).text("▶️");
      // 필요하면 일시정지 시에도 파형 그려둠(원하면 여기서 cancelAnimationFrame 가능)
    }
  });

  // 진행바 업데이트
  $(audio).on("timeupdate", function () {
    $("#seekBar").val(audio.currentTime);
    $("#currentTime").text(formatTime(audio.currentTime));
  });

  // 진행바로 시크
  $("#seekBar").on("input change", function () {
    audio.currentTime = Number($(this).val());
  });

  // 메타데이터 로드 시 길이 세팅
  $(audio).on("loadedmetadata", function () {
    $("#seekBar").attr({ max: audio.duration, value: 0 });
    $("#duration").text(formatTime(audio.duration));
    $("#currentTime").text("0:00");
  });

  // 볼륨
  $("#volumeBar").on("input change", function () {
    audio.volume = Number($(this).val());
  });

  function formatTime(sec) {
    const min = Math.floor(sec / 60);
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${min}:${s}`;
  }
});
