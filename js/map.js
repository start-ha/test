const locationData = {
  경복궁: {
    name: "경복궁",
    details: "Seoul, Korea",
    track: "Supernova",
    artist: "aespa",
    plays: "20",
    lat: 37.5784301,
    lng: 126.976889,
  },
  잠수교: {
    name: "잠수교",
    details: "Seoul, Korea",
    track: "aenergy",
    artist: "aespa",
    plays: "15",
    lat: 37.5141892,
    lng: 126.9965871,
  },
  "신세계 강남": {
    name: "신세계 강남",
    details: "Seoul, Korea",
    track: "Gee",
    artist: "SNSD",
    plays: "50",
    lat: 37.5043508,
    lng: 127.0043655,
  },
  "SM Entertainment": {
    name: "SM Entertainment",
    details: "Seoul, Korea",
    track: "Sherlock",
    artist: "SHINee",
    plays: "30",
    lat: 37.5443374,
    lng: 127.0440158,
  },
};

$(".control-btn").hover(
  function () {
    $(this).css("transform", "translateY(-2px)");
  },
  function () {
    $(this).css("transform", "translateY(0)");
  }
);

function selectLocation(element, locationName) {
  $(".location-item").removeClass("active");

  $(element).addClass("active");

  const location = locationData[locationName];

  if (location) {
    $("#selectedLocationName").text(location.name);
    $("#selectedLocationDetails").text(location.details);
    $("#currentTrackTitle").text(location.track);
    $("#currentTrackArtist").text(location.artist);
    $("#playStats").text(`Played ${location.plays} times here`);
  }
}

const defaultLocation = $(".location-item").first();
if (defaultLocation.length) {
  selectLocation(defaultLocation, "경복궁");
}

// map
let mapOptions = {
  center: new naver.maps.LatLng(37.5784301, 126.976889),
  zoom: 10,
};

let map = new naver.maps.Map("map", {
  center: new naver.maps.LatLng(37.5784301, 126.976889),
  zoom: 10,
});
let markers = [];
Object.keys(locationData).forEach(key => {
  const loc = locationData[key];
  const marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(loc.lat, loc.lng),
    map: map,
    title: loc.name,
  });

  naver.maps.Event.addListener(marker, "click", function () {
    $(".location-item").removeClass("active");
    $(`.location-name[data-location='${key}']`)
      .closest(".location-item")
      .addClass("active")
      .siblings()
      .removeClass("active");

    $("#selectedLocationName").text(loc.name);
    $("#selectedLocationDetails").text(loc.details);
    $("#currentTrackTitle").text(loc.track);
    $("#currentTrackArtist").text(loc.artist);
    $("#playStats").text(`Played ${loc.plays} times here`);
  });
});
// let marker = new naver.maps.Marker({
//   position: new naver.maps.LatLng(37.5784301, 126.976889),
//   map: map,
// });

let defaultIcon = {
  content: `<div style="background:#1db954;width:16px;height:16px;border-radius:50%;"></div>`,
};
let activeIcon = {
  content: `<div style="background:red;width:20px;height:20px;border-radius:50%;"></div>`,
};

// 마커 생성
Object.keys(locationData).forEach(key => {
  const loc = locationData[key];

  let marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(loc.lat, loc.lng),
    map: map,
    title: loc.name,
    icon: defaultIcon,
  });

  markers[key] = marker;

  naver.maps.Event.addListener(marker, "click", function () {
    $(`.location-name[data-location='${key}']`)
      .closest(".location-item")
      .addClass("active")
      .siblings()
      .removeClass("active");

    setActiveMarker(key);

    $("#selectedLocationName").text(loc.name);
    $("#selectedLocationDetails").text(loc.details);
    $("#currentTrackTitle").text(loc.track);
    $("#currentTrackArtist").text(loc.artist);
    $("#playStats").text(`Played ${loc.plays} times here`);
  });
});

// 공통 함수: 마커 색상 토글
function setActiveMarker(activeKey) {
  Object.keys(markers).forEach(key => {
    if (key === activeKey) {
      markers[key].setIcon({
        content: `<div style="background:red;width:20px;height:20px;border-radius:50%;"></div>`,
      });
    } else {
      markers[key].setIcon({
        content: `<div style="background:#1db954;width:16px;height:16px;border-radius:50%;"></div>`,
      });
    }
  });
}

$(document).on("click", ".location-item", function () {
  // 1) 어떤 장소인지 key 가져오기
  const key = $(this).find(".location-name").data("location");

  // 2) 카드 하이라이트
  $(this).addClass("active").siblings().removeClass("active");

  // 3) 마커 강조
  setActiveMarker(key);

  // 4) 오른쪽 사이드바 업데이트
  const loc = locationData[key];
  if (loc) {
    $("#selectedLocationName").text(loc.name);
    $("#selectedLocationDetails").text(loc.details);
    $("#currentTrackTitle").text(loc.track);
    $("#currentTrackArtist").text(loc.artist);
    $("#playStats").text(`Played ${loc.plays} times here`);
  }

  // 5) 지도 중심 이동 (옵션)
  map.setCenter(new naver.maps.LatLng(loc.lat, loc.lng));
});
