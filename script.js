let playlist = [];
let currentTrackIndex = null;
let isPlaying = false;
let loop = false;

const audio = new Audio();

async function importFolder() {
  // Check if the browser supports the File System Access API
  if (!window.showDirectoryPicker) {
    alert("Folder importing is not supported in your browser.");
    return;
  }

  const dirHandle = await window.showDirectoryPicker();
  playlist = [];

  // Iterate through the directory and find audio files
  for await (const entry of dirHandle.values()) {
    if (entry.kind === "file" && /\.(mp3|m4a|mp4)$/i.test(entry.name)) {
      const file = await entry.getFile();
      playlist.push({ title: file.name, src: URL.createObjectURL(file) });
    }
  }

  if (playlist.length === 0) {
    alert("No audio files found in the selected folder.");
    return;
  }

  renderPlaylist();
}

function renderPlaylist() {
  const playlistEl = document.getElementById("playlist");
  playlistEl.innerHTML = ""; // Clear the current playlist

  playlist.forEach((track, index) => {
    const trackEl = document.createElement("div");
    trackEl.classList.add("track");
    trackEl.textContent = track.title;
    trackEl.onclick = () => selectTrack(index); // Select the clicked track
    playlistEl.appendChild(trackEl);
  });
}

function filterTracks() {
  const query = document.getElementById("searchBar").value.toLowerCase();
  const filteredTracks = playlist.filter((track) =>
    track.title.toLowerCase().includes(query)
  );

  const playlistEl = document.getElementById("playlist");
  playlistEl.innerHTML = "";

  filteredTracks.forEach((track, index) => {
    const trackEl = document.createElement("div");
    trackEl.classList.add("track");
    trackEl.textContent = track.title;
    trackEl.onclick = () => selectTrack(index);
    playlistEl.appendChild(trackEl);
  });
}

function selectTrack(index) {
  currentTrackIndex = index;
  loadTrack();
  playTrack();
}

function loadTrack() {
  if (currentTrackIndex === null || playlist.length === 0) return;

  const track = playlist[currentTrackIndex];
  audio.src = track.src;

  document.getElementById("trackTitle").textContent = track.title;
}

function playTrack() {
  if (!audio.src) return;

  audio.play();
  isPlaying = true;
  document.getElementById("playPause").textContent = "⏸";
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  document.getElementById("playPause").textContent = "▶️";
}

function togglePlayPause() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function nextTrack() {
  if (currentTrackIndex === null || currentTrackIndex + 1 >= playlist.length) {
    if (loop) currentTrackIndex = 0;
    else return;
  } else {
    currentTrackIndex++;
  }

  loadTrack();
  playTrack();
}

function previousTrack() {
  if (currentTrackIndex === null || currentTrackIndex - 1 < 0) return;

  currentTrackIndex--;
  loadTrack();
  playTrack();
}

function toggleLoop() {
  loop = !loop;
  document.getElementById("loopToggle").style.color = loop ? "green" : "white";
}

