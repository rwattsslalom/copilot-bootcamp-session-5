// ─────────────────────────────────────────────
// Step 3: Board generation
// ─────────────────────────────────────────────

/**
 * Generate a rows×columns board where each cell is a random color from palette.
 * Retries until the board contains at least two distinct colors so that the
 * game is never trivially solved on the first move (unless allowSingleColor is
 * set true, e.g. for deterministic tests).
 *
 * @param {number} rows
 * @param {number} columns
 * @param {string[]} palette
 * @param {object} [options]
 * @param {Function} [options.random] - injectable RNG that returns [0,1); defaults to Math.random
 * @param {boolean} [options.allowSingleColor] - skip multi-color validation (tests only)
 * @returns {string[][]} 2-D array of color strings
 */
export function generateBoard(rows, columns, palette, options = {}) {
  const { random = Math.random, allowSingleColor = false } = options;

  let board;
  do {
    board = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () =>
        palette[Math.floor(random() * palette.length)]
      )
    );
  } while (!allowSingleColor && new Set(board.flat()).size < 2);

  return board;
}

// ─────────────────────────────────────────────
// Step 6: Flood-fill expansion  (used by Steps 4 & 5)
// ─────────────────────────────────────────────

/**
 * Return the four orthogonal neighbors of (row, col) that are within bounds.
 *
 * @param {number} row
 * @param {number} col
 * @param {number} rows
 * @param {number} columns
 * @returns {Array<[number, number]>}
 */
export function getOrthogonalNeighbors(row, col, rows, columns) {
  const neighbors = [];
  if (row > 0)           neighbors.push([row - 1, col]);
  if (row < rows - 1)    neighbors.push([row + 1, col]);
  if (col > 0)           neighbors.push([row, col - 1]);
  if (col < columns - 1) neighbors.push([row, col + 1]);
  return neighbors;
}

/**
 * BFS flood-fill starting from the full captured set.
 * Absorbs any orthogonally adjacent uncaptured cells whose board color
 * matches targetColor.
 *
 * @param {string[][]} board       - current board (2-D array of colors)
 * @param {Set<string>} captured   - Set of 'row,col' keys already captured
 * @param {string} targetColor     - color to match during expansion
 * @returns {Set<string>} new expanded captured Set (does not mutate input)
 */
export function floodFillExpand(board, captured, targetColor) {
  const rows = board.length;
  const columns = board[0].length;
  const next = new Set(captured);
  const queue = [...captured]; // seed BFS from entire captured boundary

  while (queue.length > 0) {
    const key = queue.shift();
    const [r, c] = key.split(',').map(Number);

    for (const [nr, nc] of getOrthogonalNeighbors(r, c, rows, columns)) {
      const nKey = `${nr},${nc}`;
      if (!next.has(nKey) && board[nr][nc] === targetColor) {
        next.add(nKey);
        queue.push(nKey);
      }
    }
  }

  return next;
}

// ─────────────────────────────────────────────
// Step 4: Captured-region initialisation
// ─────────────────────────────────────────────

/**
 * Build the complete initial game state from a board.
 * - Captured region starts at [0,0] then expands to all orthogonally
 *   connected cells that share the starting color.
 * - currentColor, moves, and isComplete are derived here.
 *
 * @param {string[][]} board
 * @param {string[]} palette
 * @returns {{board, captured: Set<string>, currentColor: string, moves: number, isComplete: boolean, rows: number, columns: number, palette: string[]}}
 */
export function buildInitialGameState(board, palette) {
  const rows = board.length;
  const columns = board[0].length;
  const startColor = board[0][0];
  const seedCaptured = new Set(['0,0']);
  const captured = floodFillExpand(board, seedCaptured, startColor);
  const isComplete = captured.size === rows * columns;

  return {
    rows,
    columns,
    palette,
    board,
    captured,
    currentColor: startColor,
    moves: 0,
    isComplete,
  };
}

// ─────────────────────────────────────────────
// Step 7: Completion detection
// ─────────────────────────────────────────────

/**
 * Return true when every cell on the board belongs to the captured region.
 *
 * @param {Set<string>} captured
 * @param {number} rows
 * @param {number} columns
 * @returns {boolean}
 */
export function isBoardComplete(captured, rows, columns) {
  return captured.size === rows * columns;
}

// ─────────────────────────────────────────────
// Step 5: Move application
// ─────────────────────────────────────────────

/**
 * Apply a color selection to the current game state.
 *
 * Rules:
 *  1. If the game is already complete, return state unchanged.
 *  2. If selectedColor equals currentColor, return state unchanged (no move).
 *  3. Recolor all captured cells on the board to selectedColor.
 *  4. Run flood-fill to absorb newly matching orthogonal neighbors.
 *  5. Increment moves by 1.
 *  6. Update currentColor.
 *  7. Recompute isComplete.
 *
 * @param {object} state  - current game state (not mutated)
 * @param {string} selectedColor
 * @returns {object} next game state
 */
export function applyMove(state, selectedColor) {
  const { board, captured, currentColor, moves, rows, columns, palette, isComplete } = state;

  // Guards
  if (isComplete || selectedColor === currentColor) {
    return state;
  }

  // Immutably recolor captured cells on the board
  const nextBoard = board.map((row, r) =>
    row.map((cell, c) =>
      captured.has(`${r},${c}`) ? selectedColor : cell
    )
  );

  // Expand capture into orthogonal neighbors matching the new color
  const nextCaptured = floodFillExpand(nextBoard, captured, selectedColor);

  const nextIsComplete = isBoardComplete(nextCaptured, rows, columns);

  return {
    rows,
    columns,
    palette,
    board: nextBoard,
    captured: nextCaptured,
    currentColor: selectedColor,
    moves: moves + 1,
    isComplete: nextIsComplete,
  };
}
