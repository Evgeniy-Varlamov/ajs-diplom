import Character from './Character';

export default class Swordsman extends Character {
  constructor(name) {
    super(name);
    this.type = 'Swordsman';
    this.attack = 40;
    this.defence = 10;
    this.distanceMove = 4;
    this.distanceAttack = 1;
  }
}
