import {
  generateBoard,
  getOrthogonalNeighbors,
  floodFillExpand,
  buildInitialGameState,
  isBoardComplete,
  applyMove,
} from '../gameLogic';

const PALETTE = ['red', 'blue', 'green'];

// ─────────────────────────────────────────────
// generateBoard
// ─────────────────────────────────────────────

describe('generateBoard', () => {
  test('returns a grid with the requested number of rows', () => {
    const board = generateBoard(4, 6, PALETTE);
    expect(board).toHaveLength(4);
  });

  test('returns rows each with the requested number of columns', () => {
    const board = generateBoard(4, 6, PALETTE);
    board.forEach((row) => expect(row).toHaveLength(6));
  });

  test('only assigns colors from the configured palette', () => {
    const board = generateBoard(5, 5, PALETTE);
    board.flat().forEach((cell) => expect(PALETTE).toContain(cell));
  });

  test('produces at least two distinct colors by default', () => {
    // Run several boards to confirm the multi-color guarantee holds
    for (let i = 0; i < 20; i++) {
      const board = generateBoard(4, 4, PALETTE);
      expect(new Set(board.flat()).size).toBeGreaterThanOrEqual(2);
    }
  });

  test('can produce a single-color board when allowSingleColor is true', () => {
    // Injectable RNG always picks index 0
    const alwaysFirst = () => 0;
    const board = generateBoard(3, 3, PALETTE, { random: alwaysFirst, allowSingleColor: true });
    expect(new Set(board.flat()).size).toBe(1);
    expect(board[0][0]).toBe(PALETTE[0]);
  });
});

// ─────────────────────────────────────────────
// getOrthogonalNeighbors
// ─────────────────────────────────────────────

describe('getOrthogonalNeighbors', () => {
  test('returns 4 neighbors for an interior cell', () => {
    const neighbors = getOrthogonalNeighbors(2, 2, 5, 5);
    expect(neighbors).toHaveLength(4);
  });

  test('returns only 2 neighbors for the top-left corner', () => {
    const neighbors = getOrthogonalNeighbors(0, 0, 4, 4);
    expect(neighbors).toHaveLength(2);
    expect(neighbors).toContainEqual([0, 1]);
    expect(neighbors).toContainEqual([1, 0]);
  });

  test('never includes diagonal positions', () => {
    // For (1,1) in a 3x3 grid, diagonals would be (0,0)(0,2)(2,0)(2,2)
    const neighbors = getOrthogonalNeighbors(1, 1, 3, 3);
    const keys = neighbors.map(([r, c]) => `${r},${c}`);
    expect(keys).not.toContain('0,0');
    expect(keys).not.toContain('0,2');
    expect(keys).not.toContain('2,0');
    expect(keys).not.toContain('2,2');
  });

  test('returns exactly up/down/left/right for an interior cell', () => {
    const neighbors = getOrthogonalNeighbors(2, 2, 5, 5);
    expect(neighbors).toContainEqual([1, 2]); // up
    expect(neighbors).toContainEqual([3, 2]); // down
    expect(neighbors).toContainEqual([2, 1]); // left
    expect(neighbors).toContainEqual([2, 3]); // right
  });
});

// ─────────────────────────────────────────────
// buildInitialGameState
// ─────────────────────────────────────────────

describe('buildInitialGameState', () => {
  test('always includes coordinate 0,0 in the captured region', () => {
    const board = [
      ['red', 'blue'],
      ['blue', 'green'],
    ];
    const state = buildInitialGameState(board, PALETTE);
    expect(state.captured.has('0,0')).toBe(true);
  });

  test('expands initial captured region to orthogonally connected same-color cells', () => {
    // All red board – entire grid should be captured immediately
    const board = [
      ['red', 'red'],
      ['red', 'red'],
    ];
    const state = buildInitialGameState(board, PALETTE);
    expect(state.captured.size).toBe(4);
  });

  test('does not capture diagonal-only matching cells', () => {
    // 0,0 = red; diagonally adjacent 1,1 = red; orthogonal neighbors 0,1 and 1,0 are blue
    const board = [
      ['red', 'blue'],
      ['blue', 'red'],
    ];
    const state = buildInitialGameState(board, PALETTE);
    expect(state.captured.has('1,1')).toBe(false);
    expect(state.captured.size).toBe(1);
  });

  test('sets moves to 0', () => {
    const board = [['red', 'blue']];
    const state = buildInitialGameState(board, PALETTE);
    expect(state.moves).toBe(0);
  });

  test('sets currentColor to the top-left cell color', () => {
    const board = [['green', 'red']];
    const state = buildInitialGameState(board, PALETTE);
    expect(state.currentColor).toBe('green');
  });

  test('sets isComplete to true when the entire board is one color', () => {
    const board = [
      ['red', 'red'],
      ['red', 'red'],
    ];
    const state = buildInitialGameState(board, PALETTE);
    expect(state.isComplete).toBe(true);
  });

  test('sets isComplete to false on a multi-color board', () => {
    const board = [['red', 'blue']];
    const state = buildInitialGameState(board, PALETTE);
    expect(state.isComplete).toBe(false);
  });
});

// ─────────────────────────────────────────────
// applyMove
// ─────────────────────────────────────────────

// Shared fixture:
//   board:   red | blue
//            blue | green
// Initial:  captured = {0,0}, currentColor = 'red', moves = 0
function makeState() {
  const board = [
    ['red', 'blue'],
    ['blue', 'green'],
  ];
  return buildInitialGameState(board, PALETTE);
}

describe('applyMove', () => {
  test('returns the same state reference when color matches currentColor', () => {
    const state = makeState();
    const next = applyMove(state, 'red');
    expect(next).toBe(state);
  });

  test('does not increment moves when selecting the current color', () => {
    const state = makeState();
    const next = applyMove(state, 'red');
    expect(next.moves).toBe(0);
  });

  test('increments moves by exactly 1 for a valid color change', () => {
    const state = makeState();
    const next = applyMove(state, 'blue');
    expect(next.moves).toBe(1);
  });

  test('recolors all previously captured cells to the new color', () => {
    const state = makeState();            // captured = {0,0}, color red
    const next = applyMove(state, 'blue');
    expect(next.board[0][0]).toBe('blue'); // 0,0 was captured -> now blue
  });

  test('captures orthogonally connected cells matching the new color', () => {
    const state = makeState();
    const next = applyMove(state, 'blue');
    // After recoloring 0,0 to blue, both 0,1 and 1,0 are blue → absorbed
    expect(next.captured.has('0,1')).toBe(true);
    expect(next.captured.has('1,0')).toBe(true);
  });

  test('does not capture diagonal-only matching cells', () => {
    // board:  red | blue
    //         blue | red
    // 1,1 is red and only diagonally adjacent to captured 0,0
    const board = [
      ['red', 'blue'],
      ['blue', 'red'],
    ];
    const state = buildInitialGameState(board, PALETTE);
    const next = applyMove(state, 'blue');
    // 0,1 and 1,0 captured; 1,1 (red) should NOT be
    expect(next.captured.has('1,1')).toBe(false);
    expect(next.captured.size).toBe(3); // 0,0 + 0,1 + 1,0
  });

  test('sets isComplete to true when the entire board is captured', () => {
    // 1×2 board: one move wins
    const board = [['red', 'blue']];
    const state = buildInitialGameState(board, PALETTE);
    const next = applyMove(state, 'blue');
    expect(next.isComplete).toBe(true);
  });

  test('returns unchanged state when game is already complete', () => {
    const board = [['red', 'blue']];
    const state = buildInitialGameState(board, PALETTE);
    const won = applyMove(state, 'blue');   // game complete
    const again = applyMove(won, 'red');    // attempt further move
    expect(again).toBe(won);               // same reference
    expect(again.moves).toBe(1);
  });
});

// ─────────────────────────────────────────────
// isBoardComplete
// ─────────────────────────────────────────────

describe('isBoardComplete', () => {
  test('returns true when captured size equals rows × columns', () => {
    const captured = new Set(['0,0', '0,1', '1,0', '1,1']);
    expect(isBoardComplete(captured, 2, 2)).toBe(true);
  });

  test('returns false when not all cells are captured', () => {
    const captured = new Set(['0,0', '0,1']);
    expect(isBoardComplete(captured, 2, 2)).toBe(false);
  });
});
