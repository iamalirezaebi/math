import { convertToPersianNumber } from './utils.js';

export class HanoiGame {
  constructor(diskCount) {
    this.diskCount = diskCount;
    this.towers = [[], [], []];
    this.moves = 0;
    this.startTime = null;
    this.timer = null;
    this.sounds = {
      move: new Audio('move.mp3'),
      error: new Audio('error.mp3'),
      win: new Audio('win.mp3')
    };
    this.diskColors = [
      '#FF6B6B',  // Coral Red
      '#4ECDC4',  // Turquoise
      '#45B7D1',  // Sky Blue
      '#FDCB6E',  // Golden Yellow
      '#6C5CE7',  // Purple
      '#A8E6CF',  // Mint Green
      '#FF8ED4'   // Pink
    ];
    this.initializeTowers();
  }

  initializeTowers() {
    for (let i = this.diskCount; i > 0; i--) {
      this.towers[0].push(i);
    }
  }

  moveDisk(fromTower, toTower) {
    if (this.isValidMove(fromTower, toTower)) {
      const disk = this.towers[fromTower].pop();
      this.towers[toTower].push(disk);
      this.moves++;
      this.playSound('move');
      return true;
    } else {
      this.playSound('error');
      return false;
    }
  }

  isValidMove(fromTower, toTower) {
    if (this.towers[fromTower].length === 0) return false;
    if (this.towers[toTower].length === 0) return true;
    return this.towers[fromTower][this.towers[fromTower].length - 1] < 
           this.towers[toTower][this.towers[toTower].length - 1];
  }

  isGameWon() {
    return this.towers[2].length === this.diskCount;
  }

  startTimer() {
    this.startTime = Date.now();
    this.timer = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
      document.getElementById('timer').textContent = this.formatTime(elapsedTime);
    }, 1000);
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return convertToPersianNumber(`${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  playSound(type) {
    if (document.getElementById('sound-toggle').checked) {
      this.sounds[type].play();
    }
  }
}

export function initGame() {
  const diskCountSelect = document.getElementById('disk-count');
  const startGameButton = document.getElementById('start-game');
  const resetGameButton = document.getElementById('reset-game');
  const gameBoardElement = document.getElementById('game-board');
  const modal = document.getElementById('modal');
  const closeModalButton = document.getElementById('close-modal');

  let game;

  function renderTowers() {
    const towers = document.querySelectorAll('.tower');
    towers.forEach((tower, towerIndex) => {
      tower.innerHTML = '';
      game.towers[towerIndex].forEach((diskSize, index) => {
        const disk = document.createElement('div');
        disk.classList.add('disk');
        disk.style.width = `${diskSize * 30}px`;
        disk.style.bottom = `${index * 25}px`;
        disk.dataset.size = diskSize;
        
        // Set unique color for each disk
        disk.style.backgroundColor = game.diskColors[diskSize - 1];
        
        tower.appendChild(disk);
      });
    });
  }

  startGameButton.addEventListener('click', () => {
    const diskCount = parseInt(diskCountSelect.value);
    game = new HanoiGame(diskCount);
    game.startTimer();
    renderTowers();
  });

  resetGameButton.addEventListener('click', () => {
    if (game) {
      game.stopTimer();
      game = new HanoiGame(game.diskCount);
      game.startTimer();
      renderTowers();
    }
  });

  gameBoardElement.addEventListener('click', (event) => {
    if (!game) return;

    const tower = event.target.closest('.tower');
    if (!tower) return;

    const towers = Array.from(document.querySelectorAll('.tower'));
    const fromTowerIndex = towers.findIndex(t => t === tower);

    if (game.selectedTower === undefined) {
      game.selectedTower = fromTowerIndex;
    } else {
      const moved = game.moveDisk(game.selectedTower, fromTowerIndex);
      renderTowers();

      if (moved) {
        game.selectedTower = undefined;

        if (game.isGameWon()) {
          game.stopTimer();
          game.playSound('win');
          document.getElementById('win-message').textContent = `تبریک! شما برج را در ${convertToPersianNumber(game.moves)} حرکت تکمیل کردید.`;
          modal.style.display = 'block';
        }
      } else {
        game.selectedTower = undefined;
      }
    }
  });

  closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

initGame();