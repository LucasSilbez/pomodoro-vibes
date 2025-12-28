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



// Adicione um evento para cada botão "Transferir para Todo List"
document.querySelectorAll('.transferToTodo').forEach(function (button, index) {
  button.addEventListener('click', function () {
    // Recupere os dados da coluna correspondente
    var columnIndex = index + 2; // Começa em 2 porque as colunas de dados começam em col2
    var columnCells = document.querySelectorAll(`[data-key^="row"][data-key$="-col${columnIndex}"]`);
    var todoListData = [];

    columnCells.forEach(function (cell) {
      // Verifique se o elemento não é o próprio botão e não tem a classe "exclude-from-todo"
      if (cell !== button && !cell.classList.contains('exclude-from-todo')) {
        var cellText = cell.textContent.trim();
        if (cellText !== '') {
          todoListData.push(cellText);
        }
      }
    });

    // Adicione os dados à Todo List
    const banco = getBanco();

    todoListData.forEach(function (tarefa) {
      if (banco.length < 8) {
        banco.push({ 'tarefa': tarefa, 'status': '' });
      } else {
        if (confirm('Limite de tarefas alcançado. Deseja remover a tarefa mais antiga?')) {
          banco.shift();
          banco.push({ 'tarefa': tarefa, 'status': '' });
        }
      }
    });

    setBanco(banco);
    atualizarTela();
  });
});





// Adicione o evento de abertura da tabela
document.getElementById('openTableButton').addEventListener('click', function () {
  var tableContainer = document.getElementById('tableContainer');
  if (tableContainer.style.display === 'none' || tableContainer.style.display === '') {
    tableContainer.style.display = 'block';
  } else {
    tableContainer.style.display = 'none';
  }
});

// Recupere os dados do armazenamento local e preencha a planilha
document.addEventListener('DOMContentLoaded', function () {
  for (var i = 1; i <= 8; i++) {
    for (var j = 1; j <= 8; j++) {
      var cell = document.querySelector(`[data-key="row${i}-col${j}"]`);
      var savedData = localStorage.getItem(`row${i}-col${j}`);
      if (savedData) {
        cell.innerHTML = savedData;
      }

      cell.addEventListener('input', function () {
        var key = this.getAttribute('data-key');
        localStorage.setItem(key, this.innerHTML);
      });
    }
  }
});




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
    evento.preventDefault(); // Impede o formulário de recarregar a página
    
    const input = document.getElementById('todoInput');
    const texto = input.value.trim();

    if (texto !== '') {
        const banco = getBanco();

        if (banco.length < 8) {
            banco.push({ 'tarefa': texto, 'status': '' });
        } else {
            if (confirm('Limite de tarefas alcançado. Deseja remover a tarefa mais antiga?')) {
                banco.shift();
                banco.push({ 'tarefa': texto, 'status': '' });
            } else {
                return; // Cancela se o usuário não quiser remover
            }
        }

        setBanco(banco);
        atualizarTela();
        input.value = ''; // Limpa o input
    }
};

// Escute o evento 'submit' do formulário
document.getElementById('todoForm').addEventListener('submit', inserirItem);

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

document.getElementById('todoForm').addEventListener('submit', inserirItem);
document.getElementById('todoList').addEventListener('click', clickItem);

atualizarTela();



var videos = [
  "assets/video/rainnordic.mp4",
  "assets/video/Library.mp4",
  "assets/video/HogExpress.mp4",
  "assets/video/Tavern.mp4",
  "assets/video/Rain.mp4",
  "assets/video/Tokyo.mp4",
  "assets/video/cybergirlcat.mp4",
  "assets/video/cyberrom.mp4",
  "assets/video/CyberPixel.mp4",
  "assets/video/furry.mp4",
];

// Tente carregar o índice salvo, se não existir, comece do 0
var videoIndex = parseInt(localStorage.getItem('lastVideoIndex')) || 0;

function updateBackgroundVideo() {
  var videoSource = document.createElement("source");
  videoSource.src = videos[videoIndex];
  videoSource.type = "video/mp4";

  while (backgroundVideo.firstChild) {
    backgroundVideo.firstChild.remove();
  }

  backgroundVideo.appendChild(videoSource);
  backgroundVideo.load();
  
  // SALVAR NO LOCALSTORAGE
  localStorage.setItem('lastVideoIndex', videoIndex);
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
  { name: "Ruído Marrom", file: "assets/songs/Ruído Marrom.mp3" },
  { name: "Ruído Branco", file: "assets/songs/Ruído Branco.mp3" },
  { name: "Chuva", file: "assets/songs/Chuva.mp3" },
  { name: "Música Para Estudar e Manter o Foco", file: "assets/songs/Música Para Estudar e Manter o Foco.mp3" },
  { name: "Lord Of The Rings _ Erebor", file: "assets/songs/Lord Of The Rings _ Erebor.mp3" },
  { name: "Lord Of The Rings _ The Shire", file: "assets/songs/Lord Of The Rings _ The Shire.mp3" },
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
let currentSongIndex = parseInt(localStorage.getItem('lastSongIndex')) || 0;

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
  audioPlayer.volume = 1.0;
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
        audioPlayer.volume = 0.01;
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
      audioPlayer.volume = 0.01;
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
  
  // SALVAR NO LOCALSTORAGE
  localStorage.setItem('lastSongIndex', currentSongIndex);
  
  // Nota: O navegador pode bloquear o .play() automático se o usuário não interagiu com a página
  audioPlayer.play().catch(e => console.log("Autoplay bloqueado, aguardando interação."));
}

window.addEventListener("DOMContentLoaded", () => {
  playCurrentSong();
});

function playNotificationSound() {
  const audio = new Audio("assets/songs/notificacao.mp3");
  audio.play();
  audio.volume = 0.3;
}

 const exRows = 30, exCols = 15;
    let selectedElements = [];
    let historyStack = [];
    let isDragging = false;
    let startCellCoord = null;

    function toggleExcel(show) {
      document.getElementById('modalExcel').style.display = show ? 'block' : 'none';
    }

    function saveHistory() {
      const currentState = {};
      document.querySelectorAll('#ex-body td').forEach(td => {
        currentState[td.id] = {
          text: td.innerText,
          style: td.getAttribute('style')
        };
      });
      const stateStr = JSON.stringify(currentState);
      if (historyStack.length === 0 || historyStack[historyStack.length - 1] !== stateStr) {
        historyStack.push(stateStr);
        if (historyStack.length > 50) historyStack.shift();
      }
    }

    function excelUndo() {
      if (historyStack.length === 0) return;
      const lastState = JSON.parse(historyStack.pop());
      Object.keys(lastState).forEach(id => {
        const td = document.getElementById(id);
        if (td) {
          td.innerText = lastState[id].text;
          if (lastState[id].style) td.setAttribute('style', lastState[id].style);
          else td.removeAttribute('style');
        }
      });
    }

    function clearSelection() {
      selectedElements.forEach(el => el.classList.remove('selected-group'));
      selectedElements = [];
      document.getElementById('selected-info').innerText = "-";
    }

    function createExcel() {
      const header = document.getElementById('ex-header');
      const body = document.getElementById('ex-body');

      for (let i = 0; i < exCols; i++) {
        let th = document.createElement('th');
        th.className = "clickable";
        const letter = String.fromCharCode(65 + i);
        th.innerText = letter;
        th.onclick = () => selectColumn(i, letter);
        header.appendChild(th);
      }

      for (let r = 1; r <= exRows; r++) {
        let tr = document.createElement('tr');
        let thRow = document.createElement('th');
        thRow.className = "clickable";
        thRow.innerText = r;
        thRow.onclick = () => selectRow(tr, r);
        tr.appendChild(thRow);

        for (let c = 0; c < exCols; c++) {
          let td = document.createElement('td');
          td.contentEditable = true;
          const cellId = String.fromCharCode(65 + c) + r;
          td.id = "cell-" + cellId;
          td.dataset.col = c;
          td.dataset.row = r;

          td.addEventListener('beforeinput', saveHistory);
          
          td.addEventListener('mousedown', (e) => {
            isDragging = true;
            startCellCoord = { r: r, c: c };
            if (!e.shiftKey) clearSelection();
            updateSelection(r, c);
          });

          td.addEventListener('mouseover', () => {
            if (isDragging) updateSelection(r, c);
          });

          td.addEventListener('focus', () => {
            if (!isDragging) {
                clearSelection();
                selectedElements = [td];
                td.classList.add('selected-group');
                document.getElementById('selected-info').innerText = cellId;
            }
          });

          // Navegação por Setas
          td.addEventListener('keydown', (e) => {
            let nextR = parseInt(td.dataset.row);
            let nextC = parseInt(td.dataset.col);

            if (e.key === "ArrowUp") nextR--;
            else if (e.key === "ArrowDown") nextR++;
            else if (e.key === "ArrowLeft") nextC--;
            else if (e.key === "ArrowRight") nextC++;
            else return; // Não é uma tecla de direção

            e.preventDefault();
            // Validar limites da tabela
            if (nextR >= 1 && nextR <= exRows && nextC >= 0 && nextC < exCols) {
                const nextId = "cell-" + String.fromCharCode(65 + nextC) + nextR;
                const nextCell = document.getElementById(nextId);
                if (nextCell) nextCell.focus();
            }
          });

          tr.appendChild(td);
        }
        body.appendChild(tr);
      }
      
      window.addEventListener('mouseup', () => isDragging = false);
      excelLoad();
    }

    function updateSelection(currR, currC) {
      clearSelection();
      const rStart = Math.min(startCellCoord.r, currR);
      const rEnd = Math.max(startCellCoord.r, currR);
      const cStart = Math.min(startCellCoord.c, currC);
      const cEnd = Math.max(startCellCoord.c, currC);

      for (let r = rStart; r <= rEnd; r++) {
        for (let c = cStart; c <= cEnd; c++) {
          const id = "cell-" + String.fromCharCode(65 + c) + r;
          const el = document.getElementById(id);
          if (el) {
            el.classList.add('selected-group');
            selectedElements.push(el);
          }
        }
      }
      document.getElementById('selected-info').innerText = `Seleção: ${selectedElements.length} células`;
    }

    function selectColumn(colIndex, letter) {
      clearSelection();
      document.querySelectorAll(`td[data-col="${colIndex}"]`).forEach(cell => {
        cell.classList.add('selected-group');
        selectedElements.push(cell);
      });
      document.getElementById('selected-info').innerText = "Coluna " + letter;
    }

    function selectRow(trElement, rowNum) {
      clearSelection();
      trElement.querySelectorAll('td').forEach(cell => {
        cell.classList.add('selected-group');
        selectedElements.push(cell);
      });
      document.getElementById('selected-info').innerText = "Linha " + rowNum;
    }

    function excelStyle(s) {
      if (selectedElements.length === 0) return;
      saveHistory();
      selectedElements.forEach(target => {
        const st = target.style;
        if (s === 'bold') st.fontWeight = st.fontWeight === 'bold' ? 'normal' : 'bold';
        if (s === 'italic') st.fontStyle = st.fontStyle === 'italic' ? 'normal' : 'italic';
        if (s === 'underline') st.textDecoration = st.textDecoration === 'underline' ? 'none' : 'underline';
      });
    }

    function excelFontSize(size) {
      if (selectedElements.length === 0) return;
      saveHistory();
      selectedElements.forEach(target => target.style.fontSize = size);
    }

    function excelColor(prop, value) {
      if (selectedElements.length === 0) return;
      selectedElements.forEach(target => target.style[prop] = value);
    }

    function excelDeleteContent() {
      if (selectedElements.length === 0) return;
      saveHistory();
      selectedElements.forEach(target => target.innerText = "");
    }

    function excelSave() {
      const data = { content: {}, styles: {} };
      document.querySelectorAll('#ex-body td').forEach(td => {
        if(td.innerText.trim() !== "" || td.getAttribute('style')) {
          data.content[td.id] = td.innerText;
          data.styles[td.id] = td.getAttribute('style');
        }
      });
      localStorage.setItem('pomodoroExcel', JSON.stringify(data));
      alert("Planilha salva!");
    }

    function excelLoad() {
      const savedString = localStorage.getItem('pomodoroExcel');
      if(!savedString) return;
      const saved = JSON.parse(savedString);
      Object.keys(saved.content).forEach(id => {
        const td = document.getElementById(id);
        if(td) {
          td.innerText = saved.content[id] || "";
          if(saved.styles[id]) td.setAttribute('style', saved.styles[id]);
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (document.getElementById('modalExcel').style.display === 'block') {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
          e.preventDefault();
          excelUndo();
        }
      }
    });

    window.addEventListener('DOMContentLoaded', () => {
      createExcel();
      const openBtn = document.getElementById('openTableButton');
      if(openBtn) openBtn.onclick = () => toggleExcel(true);
    });