export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.distanceMove = 0;
    this.distanceAttack = 0;
    this.areaMove = undefined;
    this.areaAttack = undefined;
    // TODO: throw error if user use "new Character()"
    if (new.target === Character) throw new Error('It is forbidden to create objects of the Character class');
  }

  characterInfo() {
    const levelTooltip = String.fromCodePoint(0x1F396);
    const attackTooltip = String.fromCodePoint(0x2694);
    const defenceTooltip = String.fromCodePoint(0x1F6E1);
    const healthTooltip = String.fromCodePoint(0x2764);
    return `${levelTooltip} ${this.level} ${attackTooltip} ${this.attack} ${defenceTooltip} ${this.defence} ${healthTooltip} ${this.health}`;
  }

  getArea(index, boardSize) {
    const result = Character.getArea(index, boardSize, this.distanceMove, this.distanceAttack);
    this.areaMove = result.areaMove;
    this.areaAttack = result.areaAttack;
  }

  // eslint-disable-next-line max-len
  // Метод getArea сделан статичным чтобы было проще произвести его тестирование, так как он лежит в основе реализации пунктов 1-4 части 10 - "Визуальный отклик" и согласно заданию требует тестирования.
  static getArea(index, boardSize, distanceMove, distanceAttack) {
    const move = [];
    const attack = [];
    // eslint-disable-next-line max-len
    const maxdistance = (distanceMove > distanceAttack) ? distanceMove : distanceAttack;
    for (let i = 1; i <= maxdistance; i += 1) {
      const obj = {
        top: index - boardSize * i,
        topRight: index - boardSize * i + i,
        right: index + i,
        bottomRight: index + boardSize * i + i,
        bottom: index + boardSize * i,
        bottomLeft: index + boardSize * i - i,
        left: index - i,
        topLeft: index - boardSize * i - i,
      };
      const maxLeft = Math.trunc(index / boardSize) * boardSize;
      const maxRight = maxLeft + boardSize - 1;
      if (obj.top < 0) {
        obj.top = null;
        obj.topRight = null;
        obj.topLeft = null;
      }
      if (obj.bottom > boardSize ** 2 - 1) {
        obj.bottom = null;
        obj.bottomRight = null;
        obj.bottomLeft = null;
      }
      if (obj.left < maxLeft) {
        obj.left = null;
        obj.topLeft = null;
        obj.bottomLeft = null;
      }
      if (obj.right > maxRight) {
        obj.right = null;
        obj.topRight = null;
        obj.bottomRight = null;
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const key in obj) {
        if (obj[key] !== null) {
          if (i <= distanceMove) move.push(obj[key]);
          if (i <= distanceAttack) attack.push(obj[key]);
        }
      }
    }
    return {
      areaMove: move,
      areaAttack: attack,
    };
  }

  takeDamage(damage) {
    this.health -= damage;
    return this.health > 0;
  }

  toDamage(target) {
    return Math.max(this.attack - target.defence, this.attack * 0.1);
  }
}
