import Character from '../js/Character';

test('Проверка создания объекта класса Character', () => {
  expect(() => {
    new Character(); // eslint-disable-line no-new
  }).toThrow();
});

test('Проверка создания объекта дочернего класса Character', () => {
  class Subsidiary extends Character {
    constructor(level) {
      super(level);
      this.type = 'subsidiary';
    }
  }
  const received = new Subsidiary(1);
  const expected = {
    level: 1,
    attack: 0,
    defence: 0,
    health: 50,
    type: 'subsidiary',
    distanceMove: 0,
    distanceAttack: 0,
    areaMove: undefined,
    areaAttack: undefined,
  };
  expect(received).toEqual(expected);
});
