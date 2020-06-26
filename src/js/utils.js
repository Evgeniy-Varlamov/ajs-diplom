export function calcTileType(index, boardSize) {
  // TODO: write logic here
  let result = 'center';
  if (index % boardSize === 0) result = 'left';
  if (index % boardSize === boardSize - 1) result = 'right';
  if (index <= boardSize - 1) {
    result = (result === 'center') ? 'top' : `top-${result}`;
  }
  if (index >= boardSize ** 2 - boardSize) {
    result = (result === 'center') ? 'bottom' : `bottom-${result}`;
  }
  return result;
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
