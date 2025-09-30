const STORAGE_KEY = "locations";
let map;
let markers = {};
let currentAudio = null;
let currentPlayButton = null;

// 로컬스토리지에서 데이터 가져오기
function getLocations() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// 로컬스토리지 저장
function saveLocations(locations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
}

// 카드 렌더링
function renderLocations() {
  const $list = $(".location-list");
  $list.empty();

  const locations = getLocations();
  $.each(locations, function (_, loc) {
    const $item = $(`
      <div class="location-item">
        <div class="location-icon">📍</div>
        <div class="location-info">
          <div class="location-name" data-location="${loc.name}">${loc.name}</div>
          <div class="location-details">${loc.details}</div>
          <div class="location-track">Last played: ${loc.track}</div>
        </div>
        <div class="track-count">🎵 ${loc.plays}</div>
      </div>
    `);
    $list.append($item);
  });
}

function initMap() {
  const locations = getLocations();
  const defaultCenter = locations.length
    ? new naver.maps.LatLng(locations[0].lat, locations[0].lng)
    : new naver.maps.LatLng(37.5665, 126.978);

  map = new naver.maps.Map("map", {
    center: defaultCenter,
    zoom: 13,
  });

  markers = {};

  $.each(locations, function (_, loc) {
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(loc.lat, loc.lng),
      map: map,
      title: loc.name,
      icon: {
        content: `<div style="background:#1db954;width:16px;height:16px;border-radius:50%;"></div>`,
      },
    });

    markers[loc.name] = marker;

    naver.maps.Event.addListener(marker, "click", function () {
      selectLocationByName(loc.name);
    });
  });

  // 지도 클릭 → 모달 + 좌표 자동 입력
  naver.maps.Event.addListener(map, "click", function (e) {
    const lat = e.coord.y;
    const lng = e.coord.x;

    $("#addLocationModal").modal("show");
    $("#locationLat").val(lat);
    $("#locationLng").val(lng);
  });
}

// 선택된 위치 처리
function selectLocationByName(name) {
  const locations = getLocations();
  const loc = locations.find(l => l.name === name);
  if (!loc) return;

  // 카드 active
  $(".location-item").removeClass("active");
  $(`.location-name[data-location='${name}']`).closest(".location-item").addClass("active");

  // 마커 색상
  Object.keys(markers).forEach(key => {
    if (key === name) {
      markers[key].setIcon({
        content: `<div style="background:red;width:20px;height:20px;border-radius:50%;"></div>`,
      });
    } else {
      markers[key].setIcon({
        content: `<div style="background:#1db954;width:16px;height:16px;border-radius:50%;"></div>`,
      });
    }
  });

  // 오른쪽 패널 업데이트
  $("#selectedLocationName").text(loc.name);
  $("#selectedLocationDetails").text(loc.details);
  $("#currentTrackTitle").text(loc.track);
  $("#currentTrackArtist").text(loc.artist);
  $("#playStats").text(`Played ${loc.plays} times here`);

  map.setCenter(new naver.maps.LatLng(loc.lat, loc.lng));

  // iTunes API 노래 재생
  loadSongs(loc.track, loc.artist);
}

// iTunes API 호출 및 재생
async function loadSongs(songName, artistName) {
  if (!songName) return;

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        songName + " " + artistName
      )}&limit=1&entity=song`
    );
    const data = await response.json();
    const song = data.results[0];
    if (!song || !song.previewUrl) return;

    if (currentAudio) currentAudio.pause();
    if (currentPlayButton) currentPlayButton.text("▶️");

    currentAudio = new Audio(song.previewUrl);
    currentAudio.play();

    $("#currentTrackTitle2").text(song.trackName);
    $("#currentTrackArtist2").text(song.artistName);

    $(".control-btn")
      .text("⏸️")
      .off("click")
      .on("click", function () {
        if (currentAudio.paused) {
          currentAudio.play();
          $(this).text("⏸️");
        } else {
          currentAudio.pause();
          $(this).text("▶️");
        }
      });
  } catch (err) {
    console.error("iTunes API Error:", err);
  }
}

$(document).ready(function () {
  // 초기 렌더링
  renderLocations();
  initMap();

  // 기본 선택
  const locations = getLocations();
  if (locations.length) {
    selectLocationByName(locations[0].name);
  }

  // 카드 클릭
  $(document).on("click", ".location-item", function () {
    const key = $(this).find(".location-name").data("location");
    selectLocationByName(key);
  });

  // + 아이콘 클릭 → 모달
  $("#searchIcon").on("click", function () {
    $("#addLocationModal").modal("show");
  });

  // 모달 폼 제출
  $("#addLocationForm").on("submit", function (e) {
    e.preventDefault();

    const newLocation = {
      name: $("#locationName").val(),
      details: $("#locationDetails").val(),
      track: $("#locationTrack").val(),
      artist: $("#locationArtist").val(),
      plays: $("#locationPlays").val(),
      lat: parseFloat($("#locationLat").val()),
      lng: parseFloat($("#locationLng").val()),
    };

    const savedLocations = getLocations();
    savedLocations.push(newLocation);
    saveLocations(savedLocations);

    $("#addLocationModal").modal("hide");
    $("#addLocationForm")[0].reset();

    renderLocations();
    initMap();
    selectLocationByName(newLocation.name);
  });
});
