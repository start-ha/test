let currentAudio = null;
let currentPlayButton = null;

async function loadSongs() {
  try {
    const response = await fetch(
      "https://itunes.apple.com/search?term=summer&country=us&entity=song&limit=10"
    );
    const data = await response.json();
    const songList = data.results;

    songList.forEach(song => {
      if (!song.previewUrl) return;

      $(document)
        .find(".control-btn")
        .on("click", function () {
          const $btn = $(this);
          if (currentAudio && currentAudio.src === song.previewUrl) {
            if (currentAudio.paused) {
              currentAudio.play();
              $btn.text("⏸️");
            } else {
              currentAudio.pause();
              $btn.text("▶️");
            }
            return;
          }

          if (currentAudio) {
            currentAudio.pause();
          }
          if (currentPlayButton) {
            currentPlayButton.text("▶️");
          }

          currentAudio = new Audio(song.previewUrl);
          currentAudio.play();
          currentPlayButton = $btn;
          $btn.text("⏸️");

          $("#currentTrackTitle2").text(song.trackName);
          $("#currentTrackArtist2").text(song.artistName);
        });
    });
  } catch (err) {
    console.error("Error fetching songs:", err);
    $("#song-container").text("Failed to load songs.");
  }
}

$(document).ready(() => {
  loadSongs();
});
