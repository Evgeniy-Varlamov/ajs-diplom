/* eslint-disable no-obj-calls */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
import themes from './themes';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Magician from './Magician';
import Undead from './Undead';
import Vampire from './Vampire';
import Daemon from './Daemon';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';
import GameState from './GameState';
import cursors from './cursors';
import GameStateService from './GameStateService';


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.currentTheme = themes.prairie; // Текущая тема карты
    this.userCharactersList = [Swordsman, Bowman, Magician]; // Список возможных персонажей у кома=нды user
    this.enemyCharactersList = [Undead, Vampire, Daemon]; // Список возможных персонажей у команды enemy
    this.selectedCharacter = null; // Выбранный персонаж
    this.userTeam = []; // Массив с юнитами user
    this.enemyTeam = []; // Массив с юнитами enemy
    this.level = 1; // Текущий  уровень
    this.maxCharactersTeam = 2; // Максимальное кол-во юнитов в команде
    this.possibleEvent = null; // Возможное события над ячейкой на которую наведена мышка (перемещение или атака)
    this.hoverCharacter = null; // Персонаж (если он есть) в ячейуе на которую наведена мышка
    this.hoverIndex = null; // Индекс ячейке на которую наведень курсор.
    this.turn = 'user'; // Команда чей ход в текущий момент.
    this.points = 0;
    this.totalPoints = 0;
    this.lockBoard = true;
  }

  drawLevel() {
    this.gamePlay.drawUi(this.currentTheme);
    this.createTeams();
    this.gamePlay.redrawPositions(this.userTeam.concat(this.enemyTeam));
    document.getElementById('game-points').textContent = this.points;
    document.getElementById('total-points').textContent = this.totalPoints;
  }

  init() {
    this.loadGame();
    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    // TODO: load saved stated from stateService
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
  }

  newGame() {
    this.userTeam = [];
    this.enemyTeam = [];
    this.selectedCharacter = null;
    this.turn = 'user';
    this.level = 1;
    this.points = 0;
    this.maxCharactersTeam = 2;
    this.currentTheme = themes.prairie;
    this.gamePlay.drawUi(this.currentTheme);
    this.drawLevel();
    this.lockBoard = false;
    // localStorage.clear();
  }

  saveGame() {
    const game = {
      userTeam: this.userTeam,
      enemyTeam: this.enemyTeam,
      // selectedCharacter: this.selectedCharacter,
      level: this.level,
      points: this.points,
      currentTheme: this.currentTheme,
      maxCharactersTeam: this.maxCharactersTeam,
    };
    const currentGameState = {
      game,
      totalPoints: this.totalPoints,
    };
    this.stateService.save(GameState.from(currentGameState));
    GamePlay.showMessage('Игра сохранена');
  }

  loadGame() {
    try {
      const loadGameState = this.stateService.load();
      if (loadGameState.game) {
        this.userTeam = loadGameState.game.userTeam;
        this.userTeam = GameStateService.createTeam(this.userTeam);
        this.enemyTeam = loadGameState.game.enemyTeam;
        this.enemyTeam = GameStateService.createTeam(this.enemyTeam);
        this.selectedCharacter = null;
        this.level = loadGameState.game.level;
        this.points = loadGameState.game.points;
        this.currentTheme = loadGameState.game.currentTheme;
        this.maxCharactersTeam = loadGameState.game.maxCharactersTeam;
        this.turn = 'user';
        this.gamePlay.drawUi(this.currentTheme);
        this.gamePlay.redrawPositions(this.userTeam.concat(this.enemyTeam));
      } else {
        GamePlay.showMessage('Нет сохраненной игры');
        this.newGame();
      }
      this.totalPoints = loadGameState.totalPoints;
      document.getElementById('game-points').textContent = this.points;
      document.getElementById('total-points').textContent = this.totalPoints;
      this.lockBoard = false;
    } catch (e) {
      GamePlay.showMessage('Не удалось загрузить игру');
      this.newGame();
    }
  }

  createTeams() {
    if (this.level === 1) {
      this.userTeam = generateTeam([Swordsman, Bowman], this.level, this.maxCharactersTeam);
    }
    if (this.level === 2) {
      this.maxCharactersTeam = this.userTeam.length + 1;
      this.userTeam = this.userTeam.concat(generateTeam(this.userCharactersList, 1, 1));
    }
    if (this.level === 3) {
      this.maxCharactersTeam = this.userTeam.length + 2;
      this.userTeam = this.userTeam.concat(generateTeam(this.userCharactersList, 2, 2));
    }
    if (this.level === 4) {
      this.maxCharactersTeam = this.userTeam.length + 2;
      this.userTeam = this.userTeam.concat(generateTeam(this.userCharactersList, 3, 2));
    }
    this.enemyTeam = generateTeam(this.enemyCharactersList, this.level, this.maxCharactersTeam);
    const userPos = Array.from(this.getPosition(this.gamePlay.boardSize, 'user'));
    const enemyPos = Array.from(this.getPosition(this.gamePlay.boardSize, 'enemy'));
    this.userTeam = this.userTeam.map((e) => new PositionedCharacter(e, userPos.shift()));
    this.enemyTeam = this.enemyTeam.map((e) => new PositionedCharacter(e, enemyPos.shift()));
  }

  getPosition(size, side) {
    const positions = [];
    const positionsSet = new Set();
    if (side === 'user') {
      positions.push(0);
      positions.push(1);
      for (let i = 0; i < size ** 2; i += 1) {
        if (i % size === 0) {
          positions.push(i);
          positions.push(i + 1);
        }
      }
    } else {
      for (let i = 0; i < size ** 2; i += 1) {
        if ((i + 1) % size === 0) {
          positions.push(i);
          positions.push(i - 1);
        }
      }
    }
    while (positionsSet.size !== this.maxCharactersTeam) {
      positionsSet.add(positions[Math.floor(Math.random() * Math.floor(positions.length))]);
    }
    return positionsSet;
  }

  onCellClick(index) {
    if (this.lockBoard) return undefined;
    // TODO: react to click
    // Выбор персонажа
    if (this.possibleEvent === 'selectUserCharacter') {
      if (this.selectedCharacter !== null) this.gamePlay.deselectCell(this.selectedCharacter.position);
      this.selectedCharacter = this.hoverCharacter;
      this.selectedCharacter.character.getArea(this.selectedCharacter.position, this.gamePlay.boardSize);
      this.gamePlay.selectCell(index); // Выделяем персонаж
    }
    // Попытка выбрать неиграбельного персонажа
    if (this.possibleEvent === 'selectEnemyCharacter') {
      GamePlay.showError('Нужно выбрать своего персонажа');
    }
    // Атака
    if (this.possibleEvent === 'attack') {
      this.attack(this.selectedCharacter, this.hoverCharacter, this.enemyTeam, (unitCount) => {
        if (unitCount) {
          this.turn = 'enemy';
          this.enemyTurn();
        } else {
          // eslint-disable-next-line no-unused-expressions
          this.level < 4 ? this.levelUp() : this.win();
        }
      });
    }
    // Перемещение персонажа
    if (this.possibleEvent === 'move') {
      this.gamePlay.deselectCell(this.selectedCharacter.position);
      this.gamePlay.deselectCell(index);
      this.move(this.selectedCharacter, index);
      this.gamePlay.selectCell(index); // Выделяем персонаж
      this.onCellEnter(index);
    }
  }

  onCellEnter(index) {
    if (this.lockBoard) return undefined;
    this.hoverIndex = index;
    // TODO: react to mouse enter
    this.gamePlay.setCursor(cursors.auto); // Устанавливаем курсор auto;
    this.possibleEvent = null;
    this.hoverCharacter = null;
    const userCharacter = this.userTeam.find((e) => e.position === index);
    const enemyCharacter = this.enemyTeam.find((e) => e.position === index);
    // Если в ячейке персонаж user;
    if (userCharacter) {
      this.gamePlay.showCellTooltip(userCharacter.character.characterInfo(), index); // Выводи инфо о персонаже
      this.gamePlay.setCursor(cursors.pointer); // Устанавливаем курсор pointer
      this.possibleEvent = 'selectUserCharacter';
      this.hoverCharacter = userCharacter;
    // Если в ячейке персонаж enemy;
    } else if (enemyCharacter) {
      this.hoverCharacter = enemyCharacter;
      this.gamePlay.showCellTooltip(enemyCharacter.character.characterInfo(), index); // Выводи инфо о персонаже
      // ==Проверка на возможность атаки
      if ((this.selectedCharacter) && (this.selectedCharacter.character.areaAttack.indexOf(index) >= 0)) {
        this.gamePlay.setCursor(cursors.crosshair); // Устанавливаем курсор crosshair;
        this.possibleEvent = 'attack';
        this.gamePlay.selectCell(index, 'red');
      } else {
        this.gamePlay.setCursor(cursors.notallowed); // Устанавливаем курсор not-allowed;
        this.possibleEvent = 'selectEnemyCharacter';
      }
    // Проверяем на возможнось перемещения в ячейку
    } else if ((this.selectedCharacter) && (this.selectedCharacter.character.areaMove.indexOf(index) >= 0)) {
      this.gamePlay.setCursor(cursors.pointer); // Устанавливаем курсор pointer;
      this.possibleEvent = 'move';
      this.gamePlay.selectCell(index, 'green');
    // В других случаях
    } else {
      if (this.selectedCharacter) this.gamePlay.setCursor(cursors.notallowed); // Устанавливаем курсор not-allowed;
      this.possibleEvent = null;
    }
  }

  onCellLeave(index) {
    if (this.lockBoard) return undefined;
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    if ((this.selectedCharacter) && (this.selectedCharacter.position !== index)) this.gamePlay.deselectCell(index);
  }


  attack(characterAttacking, characterAttacked, teamAttacked, callback) {
    const damage = characterAttacking.character.toDamage(characterAttacked.character);
    this.gamePlay.showDamage(characterAttacked.position, damage).then(() => {
      const result = characterAttacked.character.takeDamage(damage);
      if (!result) teamAttacked.splice(teamAttacked.indexOf(characterAttacked), 1);
      this.gamePlay.redrawPositions(this.userTeam.concat(this.enemyTeam));
      callback(teamAttacked.length);
    });
  }

  move(characterMove, indexMove) {
    // eslint-disable-next-line no-param-reassign
    characterMove.position = indexMove;
    characterMove.character.getArea(characterMove.position, this.gamePlay.boardSize);
    this.gamePlay.redrawPositions(this.userTeam.concat(this.enemyTeam));
    this.turn = (this.turn === 'user') ? 'enemy' : 'user';
    if (this.turn === 'enemy') this.enemyTurn();
  }

  enemyTurn() {
    const result = {
      enemyCharacter: null,
      boardindex: null,
      event: null,
    };
    const userPosition = this.userTeam.map((element) => element.position); // Содаем массив в который записываем позиции всех героев user.
    const enemyPosition = this.enemyTeam.map((element) => element.position); // Создаем массив в который записываем позиции всех героев enemy
    let userMove = []; // Содаем массив в который записываем все позиции на которые могут переместиться герои user
    this.userTeam.forEach((e) => {
      userMove = userMove.concat(e.character.areaMove);
    });
    // Пытаемся найти героев user в зоне поражения у героев enemy.
    // eslint-disable-next-line array-callback-return
    this.enemyTeam.some((e) => {
      e.character.getArea(e.position, this.gamePlay.boardSize);
      const attack = e.character.areaAttack.filter((index) => userPosition.indexOf(index) >= 0);
      // Если находится хотябы один то поиск прерывается и происходит атака
      if (attack.length > 0) {
        result.enemyCharacter = e;
        result.boardindex = attack[Math.floor(Math.random() * (attack.length - 1))];
        result.event = 'attack';
        return true;
      }
      // Попутно проверяем есть ли пересечения у героев user и enemy в зоне их перемещения
      const move = e.character.areaMove.filter((index) => ((userMove.indexOf(index) >= 0) && (userPosition.concat(enemyPosition).indexOf(index) < 0)));
      if (move.length > 0) {
        result.enemyCharacter = e;
        result.boardindex = move[Math.floor(Math.random() * (move.length - 1))];
        result.event = 'move';
      }
    });
    if (result.event === null) {
      result.event = 'move';
      result.enemyCharacter = this.enemyTeam[Math.floor(Math.random() * (this.enemyTeam.length - 1))];
      const move = result.enemyCharacter.character.areaMove.filter((index) => userPosition.concat(enemyPosition).indexOf(index) < 0);
      result.boardindex = move[Math.floor(Math.random() * (move.length - 1))];
    }
    if (result.event === 'attack') {
      const userCharacter = this.userTeam.find((e) => e.position === result.boardindex);
      this.attack(result.enemyCharacter, userCharacter, this.userTeam, (unitCount) => {
        if (this.selectedCharacter.character.health <= 0) {
          this.gamePlay.deselectCell(this.selectedCharacter.position);
          this.selectedCharacter = null;
          if (this.hoverCharacter) {
            this.gamePlay.deselectCell(this.hoverCharacter.position);
            this.hoverCharacter = null;
          }
          if (this.hoverIndex !== null) this.gamePlay.deselectCell(this.hoverIndex);
        }
        if (unitCount) {
          this.turn = 'user';
        } else {
          this.gameOver();
        }
      });
    }
    if (result.event === 'move') {
      this.move(result.enemyCharacter, result.boardindex);
    }
  }

  levelUp() {
    this.selectedCharacter = null;
    this.level += 1;
    this.maxCharactersTeam += 1;
    if (this.level === 2) this.currentTheme = themes.desert;
    if (this.level === 3) this.currentTheme = themes.arctic;
    if (this.level === 4) this.currentTheme = themes.mountain;
    this.userTeam = this.userTeam.map((element) => element.character);
    // Улучшение характеристик выживших героев и подсчет очков
    this.userTeam.forEach((character) => {
      /* eslint no-param-reassign: ["error", { "props": false }] */
      this.points += character.health;
      character.level += 1;
      character.attack = Math.floor(Math.max(character.attack, character.attack * ((1.8 - character.health) / 100)));
      character.defence = Math.floor(Math.max(character.defence, character.defence * ((1.8 - character.health) / 100)));
      character.health += 80;
      if (character.health > 100) character.health = 100;
    });
    this.drawLevel();
  }

  win() {
    // Подсчет очков набранных в последнем уровни и подсчет общего кол-ва очков во всех играх.
    this.userTeam.forEach((e) => { this.points += e.character.health; });
    this.totalPoints += this.points;
    document.getElementById('game-points').textContent = this.points;
    document.getElementById('total-points').textContent = this.totalPoints;
    // Удаляем сохраненную игру
    const currentGameState = {
      totalPoints: this.totalPoints,
    };
    this.stateService.save(GameState.from(currentGameState));
    // Завершаем игру
    this.gameEnd('Вы победили!!!');
  }

  gameOver() {
    this.points = 0;
    document.getElementById('game-points').textContent = this.points;
    // Завершаем игру
    this.gameEnd('Вы проиграли (((');
  }

  gameEnd(message) {
    this.lockBoard = true;
    this.gamePlay.setCursor(cursors.pointer);
    for (let i = 0; i < (this.gamePlay.boardSize ** 2 - 1); i += 1) this.gamePlay.deselectCell(i);
    GamePlay.showMessage(message);
  }
}
