import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import App from '../App';
import theme from '../theme';
import { buildInitialGameState, applyMove } from '../gameLogic';

// ─── Deterministic test fixtures ─────────────────────────────────────────────
//
// 2×2 board:    red  | blue
//               blue | green
//
// Move sequence:
//   1. Select blue  → captured {0,0 0,1 1,0}, moves = 1
//   2. Select green → all 4 cells captured, moves = 2, isComplete = true

const PALETTE = ['red', 'yellow', 'green', 'blue', 'purple'];

const initialState = buildInitialGameState(
  [['red', 'blue'], ['blue', 'green']],
  PALETTE
);

// A state that is already complete (1×1 board)
const completedState = buildInitialGameState([['red']], PALETTE);

function renderApp(testState = initialState) {
  return render(
    <ThemeProvider theme={theme}>
      <App _testState={testState} />
    </ThemeProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 17 / 19: Initial board and palette rendering
// ─────────────────────────────────────────────────────────────────────────────

test('renders the game board and all palette color buttons', () => {
  renderApp();

  // Palette buttons: one per PALETTE entry
  expect(screen.getByRole('button', { name: /select red/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /select blue/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /select green/i })).toBeInTheDocument();
  // New Game persists always
  expect(screen.getByRole('button', { name: /start a new game/i })).toBeInTheDocument();
});

// ─────────────────────────────────────────────────────────────────────────────
// Step 19: Initial move counter display
// ─────────────────────────────────────────────────────────────────────────────

test('shows move counter starting at 0', () => {
  renderApp();
  expect(screen.getByText(/# of moves: 0/i)).toBeInTheDocument();
});

// ─────────────────────────────────────────────────────────────────────────────
// Step 19: Move count updates after valid color selection
// ─────────────────────────────────────────────────────────────────────────────

test('increments move counter after a valid color selection', async () => {
  const user = userEvent.setup();
  renderApp();

  // Initial color is 'red' (board[0][0]); selecting 'blue' is a valid new move
  await user.click(screen.getByRole('button', { name: /select blue/i }));

  expect(screen.getByText(/# of moves: 1/i)).toBeInTheDocument();
});

// ─────────────────────────────────────────────────────────────────────────────
// Step 19: Win state rendering
// ─────────────────────────────────────────────────────────────────────────────

test('shows completion message when the board is fully captured', () => {
  // Start from an already-complete state so the banner renders immediately
  renderApp(completedState);
  expect(screen.getByText(/board complete/i)).toBeInTheDocument();
});

// ─────────────────────────────────────────────────────────────────────────────
// Step 19: New Game reset behavior
// ─────────────────────────────────────────────────────────────────────────────

test('New Game resets the move counter and removes the win banner', async () => {
  const user = userEvent.setup();
  // Start from an already-complete 2-move state
  const wonState = applyMove(applyMove(initialState, 'blue'), 'green');
  renderApp(wonState);

  expect(screen.getByText(/board complete/i)).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /start a new game/i }));

  expect(screen.getByText(/# of moves: 0/i)).toBeInTheDocument();
  expect(screen.queryByText(/board complete/i)).not.toBeInTheDocument();
});


