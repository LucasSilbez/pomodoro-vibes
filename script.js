const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const timeDisplay = document.getElementById("time-display");
const pomodoroInput = document.getElementById("pomodoro-input");
const breakInput = document.getElementById("break-input");
const longBreakInput = document.getElementById("long-break-input");
const updateButton = document.getElementById("update-btn");
const audioPlayer = document.getElementById("audio-player");
const songName = document.getElementById("song-name");
const previousButton = document.getElementById("previous-btn");
const nextButton = document.getElementById("next-btn");
const sessionInfo = document.getElementById("session-info");
const backgroundVideo = document.getElementById("background-video");
const previouVideoButton = document.getElementById("previous-video-button");
const nextVideoButton = document.getElementById("next-video-button");
const todo__list = document.querySelector(".todo__list");
const timerContainer = document.querySelector(".timerContainer");



'use strict';

let banco = [];

const getBanco = () => JSON.parse(localStorage.getItem('todoList')) ?? [];
const setBanco = (banco) => localStorage.setItem('todoList', JSON.stringify(banco));

const criarItem = (tarefa, status, indice) => {
  const item = document.createElement('label');
  item.classList.add('todo__item');
  item.innerHTML = ` <input type="checkbox" ${status} data-indice=${indice}>
  <div>${tarefa}</div>
  <input type="button" value="✗" data-indice=${indice}>`;
  document.getElementById('todoList').appendChild(item);
};

const limparTarefas = () => {
  const todoList = document.getElementById('todoList');
  while (todoList.firstChild) {
    todoList.removeChild(todoList.lastChild);
  }
};

const atualizarTela = () => {
  limparTarefas();
  const banco = getBanco();
  banco.forEach((item, indice) => criarItem(item.tarefa, item.status, indice));
};

const inserirItem = (evento) => {
  const tecla = evento.key;
  const texto = evento.target.value;

  if (tecla === 'Enter') {
    const banco = getBanco();

    if (banco.length < 7) {
      banco.push({ 'tarefa': texto, 'status': '' });
      setBanco(banco);
      atualizarTela();
    } else {
      if (confirm('Limite de tarefas alcançado. Deseja remover a tarefa mais antiga?')) {
        banco.shift();
        banco.push({ 'tarefa': texto, 'status': '' });
        setBanco(banco);
        atualizarTela();
      }
    }

    evento.target.value = '';
  }
};

const removerItem = (indice) => {
  const banco = getBanco();
  banco.splice(indice, 1);
  setBanco(banco);
  atualizarTela();
};

const atualizarItem = (indice) => {
  const banco = getBanco();
  banco[indice].status = banco[indice].status === '' ? 'checked' : '';
  setBanco(banco);
  atualizarTela();
};

const clickItem = (evento) => {
  const elemento = evento.target;
  console.log(elemento.type);
  if (elemento.type === 'button') {
    const indice = elemento.dataset.indice;
    removerItem(indice);
  } else if (elemento.type === 'checkbox') {
    const indice = elemento.dataset.indice;
    atualizarItem(indice);
  }
};

document.getElementById('newItem').addEventListener('keypress', inserirItem);
document.getElementById('todoList').addEventListener('click', clickItem);

atualizarTela();



var videos = ["assets/video/Library.mp4",
  "assets/video/HogExpress.mp4",
  "assets/video/Tavern.mp4",
  "assets/video/Rain.mp4",
  "assets/video/Tokyo.mp4",
  "assets/video/cybergirlcat.mp4",
  "assets/video/cyberrom.mp4",
  "assets/video/CyberPixel.mp4",
  "assets/video/pixelgirl.mp4",
  "assets/video/furry.mp4",
];

var videoIndex = 0;

function updateBackgroundVideo() {
  var videoSource = document.createElement("source");
  videoSource.src = videos[videoIndex];
  videoSource.type = "video/mp4";

  while (backgroundVideo.firstChild) {
    backgroundVideo.firstChild.remove();
  }

  backgroundVideo.appendChild(videoSource);
  backgroundVideo.load();
}

previouVideoButton.addEventListener("click", function () {
  videoIndex = (videoIndex - 1 + videos.length) % videos.length;
  updateBackgroundVideo();
});

nextVideoButton.addEventListener("click", function () {
  videoIndex = (videoIndex + 1) % videos.length;
  updateBackgroundVideo();
});

updateBackgroundVideo();


const songs = [
  { name: "Hogwarts Library", file: "assets/songs/Hogwarts Library.mp3" },
  { name: "Hogwarts Express", file: "assets/songs/Hogwarts Express.mp3" },
  { name: "Hogwarts Express - Epic Version", file: "assets/songs/Hogwarts Express - Epic Version.mp3" },
  { name: "Crackling Fireplace - Ambient Audio", file: "assets/songs/Crackling Fireplace - Ambient Audio.mp3" },
  { name: "Mountain Ambience", file: "assets/songs/Mountain Ambience.mp3" },
  { name: "Nature Ambience Forest Waterfall", file: "assets/songs/Nature Ambience Forest Waterfall.mp3" },
  { name: "Train Ride Ambience", file: "assets/songs/Train Ride Ambience.mp3" },
  { name: "Celtic, Medieval, Tavern Music", file: "assets/songs/Celtic, Medieval, Tavern Music.mp3" },
  { name: "Classical music - Best of Chopin (2020)", file: "assets/songs/Classical music - Best of Chopin (2020).mp3" },
  { name: "Dark Academia - Classical Music", file: "assets/songs/Dark Academia - Classical Music.mp3" },
  { name: "Lofi hip hop mix & Chillhop", file: "assets/songs/Lofi hip hop mix & Chillhop.mp3" },
  { name: "Best of lofi hip hop 2022  - Lofi Girl", file: "assets/songs/Best of lofi hip hop 2022  - Lofi Girl.mp3" },
  { name: "Blissful Dreams - Lofi Girl", file: "assets/songs/Blissful Dreams - Lofi Girl.mp3" },
  { name: "Lofi Mix", file: "assets/songs/Lofi Mix.mp3" },


];
let currentSongIndex = 0;

let currentSessionCount = 1;
const totalSessions = 4;
let isLongBreak = false;

let timer;
let pomodoroTime = 25 * 60;
let breakTime = 5 * 60;
let longBreakTime = 15 * 60;

startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);
updateButton.addEventListener("click", updateTimer);
previousButton.addEventListener("click", playPreviousSong);
nextButton.addEventListener("click", playNextSong);

function startTimer() {
  let time;

  if (isLongBreak) {
    time = longBreakTime;
  } else {
    time = pomodoroTime;
  }

  timerContainer.style.backgroundColor = isLongBreak ? "rgba(126, 167, 230, 0.8)" : "rgba(240, 185, 185, 0.8)";
  todo__list.style.backgroundColor = isLongBreak ? "rgba(126, 167, 230, 0.8)" : "rgba(240, 185, 185, 0.8)";
  document.title = "Foco!";

  clearInterval(timer);
  timer = setInterval(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    timeDisplay.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (time <= 0) {
      clearInterval(timer);
      if (time === 0) {
        document.title = "Descanso!";
        playNotificationSound();
        audioPlayer.pause();
        if (isLongBreak) {
          currentSessionCount = 1;
          isLongBreak = false;
          sessionInfo.innerHTML = `Sessão <span id="current-session">${currentSessionCount}</span>/${totalSessions}`;
          audioPlayer.play();
          startTimer();
        } else if (currentSessionCount === totalSessions) {
          isLongBreak = true;
          sessionInfo.innerHTML = "Pausa longa";
          startTimer();
        } else {
          currentSessionCount++;
          sessionInfo.innerHTML = `Sessão <span id="current-session">${currentSessionCount}</span>/${totalSessions}`;
          startBreakTimer();
        }
      }
    }
    if (isLongBreak === true) {
      document.title = "Descanso longo!";
    }

    time--;
  }, 1000);
}

function startBreakTimer() {
  let time = breakTime;
  timerContainer.style.backgroundColor = "rgba(167, 225, 240, 0.8)";
  todo__list.style.backgroundColor = "rgba(167, 225, 240, 0.8)";

  clearInterval(timer);
  timer = setInterval(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    timeDisplay.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (time <= 0) {
      clearInterval(timer);
      if (time === 0) {
        playNotificationSound();
        audioPlayer.play();
        startTimer();
      }
    }

    time--;
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeDisplay.innerHTML = `${Math.floor(pomodoroTime / 60).toString().padStart(2, "0")}:00`;
  currentSessionCount = 1;
  isLongBreak = false;
  sessionInfo.innerHTML = `Sessão <span id="current-session">${currentSessionCount}</span>/${totalSessions}`;
}

function updateTimer() {
  pomodoroTime = parseInt(pomodoroInput.value) * 60;
  breakTime = parseInt(breakInput.value) * 60;
  longBreakTime = parseInt(longBreakInput.value) * 60;
  resetTimer();
}

function playPreviousSong() {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }
  playCurrentSong();
}

function playNextSong() {
  currentSongIndex++;
  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
  }
  playCurrentSong();
}

function playCurrentSong() {
  const currentSong = songs[currentSongIndex];
  audioPlayer.src = currentSong.file;
  songName.innerHTML = currentSong.name;
  audioPlayer.play();
}

window.addEventListener("DOMContentLoaded", () => {
  playCurrentSong();
});

function playNotificationSound() {
  const audio = new Audio("assets/songs/notificacao.mp3");
  audio.play();
}
