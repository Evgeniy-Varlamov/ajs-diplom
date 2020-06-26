/* eslint-disable max-len */
import Character from '../js/Character';

test('Тест getArea() - distanceMove > distanceAttack', () => {
  const received = Character.getArea(35, 8, 4, 1);
  const expected = {
    areaMove: [27, 28, 36, 44, 43, 42, 34, 26, 19, 21, 37, 53, 51, 49, 33, 17, 11, 14, 38, 62, 59, 56, 32, 8, 3, 7, 39],
    areaAttack: [27, 28, 36, 44, 43, 42, 34, 26],
  };
  expect(received).toEqual(expected);
});
test('Тест getArea() - distanceMove < distanceAttack', () => {
  const received = Character.getArea(35, 8, 1, 4);
  const expected = {
    areaMove: [27, 28, 36, 44, 43, 42, 34, 26],
    areaAttack: [27, 28, 36, 44, 43, 42, 34, 26, 19, 21, 37, 53, 51, 49, 33, 17, 11, 14, 38, 62, 59, 56, 32, 8, 3, 7, 39],
  };
  expect(received).toEqual(expected);
});
test('Тест getArea() - distanceMove = distanceAttack', () => {
  const received = Character.getArea(35, 8, 2, 2);
  const expected = {
    areaMove: [27, 28, 36, 44, 43, 42, 34, 26, 19, 21, 37, 53, 51, 49, 33, 17],
    areaAttack: [27, 28, 36, 44, 43, 42, 34, 26, 19, 21, 37, 53, 51, 49, 33, 17],
  };
  expect(received).toEqual(expected);
});
test('Тест getArea() - персонаж в верхнем левом углу (distanceMove = distanceAttack)', () => {
  const received = Character.getArea(0, 8, 2, 2);
  const expected = {
    areaMove: [1, 9, 8, 2, 18, 16],
    areaAttack: [1, 9, 8, 2, 18, 16],
  };
  expect(received).toEqual(expected);
});
test('Тест getArea() - персонаж в нижнем левом углу (distanceMove = distanceAttack)', () => {
  const received = Character.getArea(56, 8, 2, 2);
  const expected = {
    areaMove: [48, 49, 57, 40, 42, 58],
    areaAttack: [48, 49, 57, 40, 42, 58],
  };
  expect(received).toEqual(expected);
});
test('Тест getArea() - персонаж в нижнем правом углу (distanceMove = distanceAttack)', () => {
  const received = Character.getArea(63, 8, 2, 2);
  const expected = {
    areaMove: [55, 62, 54, 47, 61, 45],
    areaAttack: [55, 62, 54, 47, 61, 45],
  };
  expect(received).toEqual(expected);
});
test('Тест getArea() - персонаж в верхнем правом углу (distanceMove = distanceAttack)', () => {
  const received = Character.getArea(7, 8, 2, 2);
  const expected = {
    areaMove: [15, 14, 6, 23, 21, 5],
    areaAttack: [15, 14, 6, 23, 21, 5],
  };
  expect(received).toEqual(expected);
});
