function selectLocation(element, locationName) {
  // Remove active class from all items
  document.querySelectorAll(".location-item").forEach(item => {
    item.classList.remove("active");
  });

  // Add active class to selected item
  element.classList.add("active");

  // Update selected location info
  const locationData = {
    "Central Park": {
      name: "Central Park",
      details: "New York, NY",
      track: "Midnight City",
      artist: "M83",
      plays: "12",
    },
    "Golden Gate Bridge": {
      name: "Golden Gate Bridge",
      details: "San Francisco, CA",
      track: "Blinding Lights",
      artist: "The Weeknd",
      plays: "8",
    },
    "Times Square": {
      name: "Times Square",
      details: "New York, NY",
      track: "Good 4 U",
      artist: "Olivia Rodrigo",
      plays: "15",
    },
    "Hollywood Sign": {
      name: "Hollywood Sign",
      details: "Los Angeles, CA",
      track: "As It Was",
      artist: "Harry Styles",
      plays: "21",
    },
  };

  const location = locationData[locationName];
  if (location) {
    document.getElementById("selectedLocationName").textContent = location.name;
    document.getElementById("selectedLocationDetails").textContent = location.details;
    document.getElementById("currentTrackTitle").textContent = location.track;
    document.getElementById("currentTrackArtist").textContent = location.artist;
    document.getElementById("playStats").textContent = `Played ${location.plays} times here`;
  }
}

// Add hover effects for interactive elements
document.querySelectorAll(".control-btn").forEach(btn => {
  btn.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)";
  });

  btn.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });
});
