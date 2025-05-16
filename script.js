document.addEventListener("DOMContentLoaded", function() {
  // ============================================================
  //                PLAYER DE MÚSICA
  // ============================================================
  const playlist = [
        {
      file: "music/song0.mp3",
      track: "Camisa 10",
      artist: "Turma do Pagode",
      album: "Single",
      cover: "images/turma.jpg"
    },
    {
      file: "music/song1.mp3",
      track: "Perdição",
      artist: "L7NNON",
      album: "Single",
      cover: "images/perdição.png"
    },
    {
      file: "music/song2.mp3",
      track: "Vem Cá",
      artist: "Pelé MilFlows",
      album: "Single",
      cover: "images/vmk.jpg"
    },
    {
      file: "music/song3.mp3",
      track: "Pras Damas",
      artist: "Oriente",
      album: "Single",
      cover: "images/oriente.jpg"
    },
       {
      file: "music/song4.mp3",
      track: "Saturno",
      artist: "Bin",
      album: "Single",
      cover: "images/bin.jpg"
    },
    {
      file: "music/song5.mp3",
      track: "Poesia Acústica #12 - Pra Sempre",
      artist: "PineappleStorm Records",
      album: "Single",
      cover: "images/poesia.jpg"
    },
      {
      file: "music/song6.mp3",
      track: "Farol das Estrelas",
      artist: "Soweto",
      album: "Single",
      cover: "images/soweto.jpg"
    },
      {
      file: "music/song7.mp3",
      track: "Dizeres",
      artist: "Sant (feat. Lorena)",
      album: "Single",
      cover: "images/sant.jpg"
    },
      {
      file: "music/song8.mp3",
      track: "Portugal",
      artist: "Kawe (feat. Ananda)",
      album: "Single",
      cover: "images/port.jpg"
    },
      {
      file: "music/song9.mp3",
      track: "Oq Cê Fez?",
      artist: "Derxan (feat. Malu)",
      album: "Single",
      cover: "images/ladobom.jpg"
    }
  ];
  
  let currentSongIndex = 0;
  const audioPlayer = document.getElementById("bgAudio");
  
  // Elementos de controle e exibição do player
  const playPauseButton   = document.getElementById("playPauseMusic");
  const prevButton        = document.getElementById("prevMusic");
  const nextButton        = document.getElementById("nextMusic");
  const volumeSlider      = document.getElementById("volumeSlider");
  const volumeUp          = document.getElementById("volumeUp");
  const volumeDown        = document.getElementById("volumeDown");
  const volumePercent     = document.getElementById("volumePercent");
  
  const currentTimeDisplay = document.querySelector(".current-time");
  const durationDisplay    = document.querySelector(".duration");
  const progressBar        = document.querySelector(".progress");
  const progressKnob       = document.querySelector(".progress-knob");
  
  const trackNameDisplay   = document.querySelector(".track-name");
  const trackArtistDisplay = document.querySelector(".track-artist");
  const albumNameDisplay   = document.querySelector(".album-name");
  const albumArt           = document.querySelector(".album-art");
  
  // Container da barra de progresso
  const progressContainer = document.querySelector(".progress-bar");
  let isDragging = false;
  
  // Atualiza a exibição da porcentagem do volume
  function updateVolumeDisplay() {
    let percent = Math.round(audioPlayer.volume * 100);
    volumePercent.textContent = percent + "%";
  }
  
  // Função para definir a capa do álbum (caso a imagem não carregue, pode-se ajustar aqui)
  function setAlbumCover(url) {
    const img = new Image();
    img.onload = function() {
      albumArt.style.backgroundImage = `url('${url}')`;
    };
    img.onerror = function() {
      albumArt.style.backgroundImage = "url('images/default_album.png')";
    };
    img.src = url;
  }
  
  // Carrega a faixa e atualiza os metadados do player
  function loadSong(index) {
    const song = playlist[index];
    console.log("Carregando faixa:", song.track);
    audioPlayer.src = song.file;
    audioPlayer.load(); // Garante o carregamento do áudio
    trackNameDisplay.textContent = song.track;
    trackArtistDisplay.textContent = song.artist;
    albumNameDisplay.textContent = song.album;
    setAlbumCover(song.cover);
    resetProgress();
  }
  
  // Inicia a reprodução
  function playSong() {
    audioPlayer.muted = false; // Garante que o áudio não está mudo
    console.log("Tentando reproduzir:", audioPlayer.src);
    audioPlayer.play().then(() => {
      console.log("Reprodução iniciada.");
      playPauseButton.innerHTML = "&#x23F8;"; // Ícone de pausa
    }).catch(err => {
      console.error("Erro ao reproduzir:", err);
    });
  }
  
  // Pausa a reprodução
  function pauseSong() {
    audioPlayer.pause();
    playPauseButton.innerHTML = "&#x23F5;"; // Ícone de play
    console.log("Reprodução pausada.");
  }
  
  // Event listener para play/pause
  playPauseButton.addEventListener("click", function() {
    if (audioPlayer.paused) {
      playSong();
    } else {
      pauseSong();
    }
  });
  
  // Botões de próximo e anterior
  nextButton.addEventListener("click", function() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
    playSong();
  });
  
  prevButton.addEventListener("click", function() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    playSong();
  });
  
  // Atualiza a barra de progresso e displays de tempo enquanto a música toca
  audioPlayer.addEventListener("timeupdate", function() {
    if (audioPlayer.duration && !isDragging) {
      const progressPercentValue = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBar.style.width = progressPercentValue + "%";
      progressKnob.style.left = progressPercentValue + "%";
      currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
      durationDisplay.textContent = formatTime(audioPlayer.duration);
    }
  });
  
  audioPlayer.addEventListener("ended", function() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
    playSong();
  });
  
  // Controle de volume pelo slider
  volumeSlider.addEventListener("input", function() {
    audioPlayer.volume = volumeSlider.value;
    updateVolumeDisplay();
  });
  
  // Botões para ajustar o volume
  volumeDown.addEventListener("click", function() {
    let newVolume = Math.max(0, audioPlayer.volume - 0.1);
    audioPlayer.volume = newVolume;
    volumeSlider.value = newVolume;
    updateVolumeDisplay();
  });
  
  volumeUp.addEventListener("click", function() {
    let newVolume = Math.min(1, audioPlayer.volume + 0.1);
    audioPlayer.volume = newVolume;
    volumeSlider.value = newVolume;
    updateVolumeDisplay();
  });
  
  function resetProgress() {
    progressBar.style.width = "0%";
    progressKnob.style.left = "0%";
    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = "0:00";
  }
  
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }
  
  // Permite marcar um ponto na música ao clicar na barra de progresso
  progressContainer.addEventListener("click", function(e) {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    if (audioPlayer.duration) {
      audioPlayer.currentTime = ratio * audioPlayer.duration;
    }
  });
  
  // Permite arrastar o knob da barra de progresso
  progressKnob.addEventListener("mousedown", function(e) {
    isDragging = true;
    e.stopPropagation();
  });
  
  document.addEventListener("mousemove", function(e) {
    if (isDragging && audioPlayer.duration) {
      const rect = progressContainer.getBoundingClientRect();
      let newX = e.clientX - rect.left;
      newX = Math.max(0, Math.min(rect.width, newX));
      let ratio = newX / rect.width;
      progressBar.style.width = (ratio * 100) + "%";
      progressKnob.style.left = (ratio * 100) + "%";
      currentTimeDisplay.textContent = formatTime(ratio * audioPlayer.duration);
    }
  });
  
  document.addEventListener("mouseup", function(e) {
    if (isDragging && audioPlayer.duration) {
      const rect = progressContainer.getBoundingClientRect();
      let newX = e.clientX - rect.left;
      newX = Math.max(0, Math.min(rect.width, newX));
      let ratio = newX / rect.width;
      audioPlayer.currentTime = ratio * audioPlayer.duration;
      isDragging = false;
    }
  });
  
  // Define o volume inicial para 10%
  audioPlayer.volume = 0.1;
  volumeSlider.value = 0.1;
  updateVolumeDisplay();
  
  // Carrega a primeira faixa (a reprodução inicia com o clique do usuário)
  loadSong(currentSongIndex);
  
  // ============================================================
  //                CONTADOR DE TEMPO
  // ============================================================
  const tempoContadorDisplay = document.getElementById("tempoContador");
  // Data de início: 3 de dezembro de 2024, às 16:29 (lembre: dezembro é 11)
  const inicioData = new Date(2024, 11, 3, 16, 29, 0);
  
  function atualizarContador() {
    const agora = new Date();
    let diff = agora.getTime() - inicioData.getTime();
    if (diff < 0) { diff = 0; }
    const segundosTotais = Math.floor(diff / 1000);
    const dias = Math.floor(segundosTotais / 86400);
    const horas = Math.floor((segundosTotais % 86400) / 3600);
    const minutos = Math.floor((segundosTotais % 3600) / 60);
    const segundos = segundosTotais % 60;
    tempoContadorDisplay.textContent = `${dias} dias, ${horas} horas, ${minutos} minutos, ${segundos} segundos ❤️`;
  }
  
  atualizarContador();
  setInterval(atualizarContador, 1000);
  
  // ============================================================
  //                GALERIA DE MOMENTOS (SLIDER)
  // ============================================================
  // Array com 2 fotos e 2 vídeos
  const galleryItems = [
    { type: "image", src: "images/nos1.png" },
    { type: "video", src: "videos/video1.mp4" },
    { type: "video", src: "videos/video2.mp4" },
     { type: "video", src: "videos/video3.mp4" }
  ];
  
  let currentGalleryIndex = 0;
  let galleryTimeout = null;
  const mediaSlider = document.getElementById("mediaSlider");
  
  // Configura o container para receber slides com posicionamento absoluto
  mediaSlider.style.position = "relative";
  mediaSlider.style.overflow = "hidden";
  
 function showGalleryItem(index) {
  const itemData = galleryItems[index];
  let newItem;
  
  if (itemData.type === "image") {
    newItem = document.createElement("img");
    newItem.src = itemData.src;
    newItem.style.width = "100%";
    newItem.style.height = "100%";
    newItem.style.objectFit = "cover";
  } else if (itemData.type === "video") {
    newItem = document.createElement("video");
    newItem.src = itemData.src;
    newItem.style.width = "100%";
    newItem.style.height = "100%";
    newItem.style.objectFit = "cover";
    newItem.setAttribute("playsinline", "");
    newItem.setAttribute("webkit-playsinline", "");
    newItem.autoplay = true;
    newItem.muted = true; // Silencia o vídeo por padrão
    newItem.controls = false; // Remove controles padrão
  }

  newItem.classList.add("gallery-item");
  newItem.style.position = "absolute";
  newItem.style.top = "0";
  newItem.style.left = "0";
  newItem.style.width = "100%";
  newItem.style.height = "100%";
  newItem.style.transition = "transform 0.5s ease-in-out";
  newItem.style.transform = "translateX(100%)";
  mediaSlider.appendChild(newItem);
  
  newItem.offsetHeight;
  newItem.style.transform = "translateX(0%)";
  
  if (itemData.type === "image") {
    galleryTimeout = setTimeout(() => {
      nextGalleryItem();
    }, 5000); // Exibição de 5 segundos para imagens
  } else if (itemData.type === "video") {
    newItem.addEventListener("ended", function() {
      nextGalleryItem();
    });
  }
}
  
  // Função para passar para o próximo item com efeito de slide
  function nextGalleryItem() {
    if (mediaSlider.firstElementChild) {
      const currentItem = mediaSlider.firstElementChild;
      // Anima o item atual saindo para a esquerda
      currentItem.style.transform = "translateX(-100%)";
      setTimeout(() => {
        if (currentItem.parentNode) {
          currentItem.parentNode.removeChild(currentItem);
        }
      }, 500); // tempo correspondente à transição
    }
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    if (galleryTimeout) {
      clearTimeout(galleryTimeout);
      galleryTimeout = null;
    }
    showGalleryItem(currentGalleryIndex);
  }
  
  // Inicia a galeria com o primeiro item
  showGalleryItem(currentGalleryIndex);
});