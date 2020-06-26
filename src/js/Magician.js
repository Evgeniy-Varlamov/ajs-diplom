import Character from './Character';

export default class Magician extends Character {
  constructor(name) {
    super(name);
    this.type = 'Magician';
    this.attack = 10;
    this.defence = 40;
    this.distanceMove = 1;
    this.distanceAttack = 4;
  }
}
