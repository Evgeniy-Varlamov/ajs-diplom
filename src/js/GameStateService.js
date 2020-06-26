import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Magician from './Magician';
import Undead from './Undead';
import Vampire from './Vampire';
import Daemon from './Daemon';
import PositionedCharacter from './PositionedCharacter';

export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }

  load() {
    try {
      const state = JSON.parse(this.storage.getItem('state'));
      return state;
    } catch (e) {
      throw new Error('Invalid state');
    }
  }

  static createTeam(team) {
    const classList = {
      Bowman,
      Swordsman,
      Magician,
      Undead,
      Vampire,
      Daemon,
    };
    const listCharacter = team.map((e) => {
      const character = new classList[e.character.type]();
      character.health = e.character.health;
      character.defence = e.character.defence;
      character.attack = e.character.attack;
      character.level = e.character.level;
      character.areaMove = e.character.areaMove;
      character.areaAttack = e.character.areaAttack;
      return new PositionedCharacter(character, e.position);
    });
    return listCharacter;
  }
}
