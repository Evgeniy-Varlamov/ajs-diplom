import Bown from '../js/Bowman';

test('Информация о персонаже', () => {
  const daemon = new Bown(1);
  const expected = '🎖 1 ⚔ 25 🛡 25 ❤ 50';
  const received = daemon.characterInfo();
  expect(received).toEqual(expected);
});
