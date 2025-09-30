$(function () {
  let audioCtx, analyser, source, dataArray, bufferLength, animationId;

  const audio = $("#player")[0];
  const canvas = document.getElementById("waveform");
  const ctx = canvas.getContext("2d");

  const searchUrl =
    "https://itunes.apple.com/search?term=blinding+lights&entity=musicTrack&limit=1";

  $("#loadSong").on("click", function () {
    $("#playPause").text("⏸️");

    $.getJSON(searchUrl, function (res) {
      if (res.results && res.results.length > 0) {
        const song = res.results[0];
        const previewUrl = song.previewUrl;

        audio.crossOrigin = "anonymous";
        audio.src = previewUrl;

        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          source = audioCtx.createMediaElementSource(audio);

          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 2048;
          bufferLength = analyser.frequencyBinCount;
          dataArray = new Uint8Array(bufferLength);

          source.connect(analyser);
          analyser.connect(audioCtx.destination);

          console.log("AudioContext, AnalyserNode 생성 완료 ✅");
        }

        if (audioCtx.state === "suspended") {
          audioCtx.resume().then(() => {
            audio.play();
          });
        } else {
          audio.play();
        }

        if (animationId) cancelAnimationFrame(animationId);
        draw();
      } else {
        console.warn("검색 결과 없음:", res);
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

  $("#playPause").on("click", function () {
    if (audio.paused) {
      if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
      audio.play();
      $(this).text("⏸️");

      if (!animationId) draw();
    } else {
      audio.pause();
      $(this).text("▶️");
    }
  });

  $(audio).on("timeupdate", function () {
    $("#seekBar").val(audio.currentTime);
    $("#currentTime").text(formatTime(audio.currentTime));
  });

  $("#seekBar").on("input change", function () {
    audio.currentTime = Number($(this).val());
  });

  $(audio).on("loadedmetadata", function () {
    $("#seekBar").attr({ max: audio.duration, value: 0 });
    $("#duration").text(formatTime(audio.duration));
    $("#currentTime").text("0:00");
  });

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
