import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Stack,
} from '@mui/material';
import './App.css';
import { generateBoard, buildInitialGameState, applyMove } from './gameLogic';

// ─── Game configuration ───────────────────────────────────────────────────────
const ROWS = 8;
const COLUMNS = 8;
const PALETTE = ['red', 'yellow', 'green', 'blue', 'purple'];

// CSS color values for each palette entry
const COLOR_CSS = {
  red: '#e53935',
  yellow: '#fdd835',
  green: '#43a047',
  blue: '#1e88e5',
  purple: '#8e24aa',
};

function initGame() {
  const board = generateBoard(ROWS, COLUMNS, PALETTE);
  return buildInitialGameState(board, PALETTE);
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App({ _testState } = {}) {
  const [gameState, setGameState] = useState(() => _testState || initGame());

  const { board, captured, currentColor, moves, isComplete, palette, columns } = gameState;

  const handleColorSelect = (color) => {
    setGameState((prev) => applyMove(prev, color));
  };

  const handleNewGame = () => {
    setGameState(initGame());
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="sm">

        {/* ── Step 11: Header with move counter + New Game ── */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h5" component="h1" fontWeight={600}>
              Color Fill
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              # of Moves: {moves}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleNewGame}
            aria-label="Start a new game"
            sx={{
              bgcolor: 'rgba(255,255,255,0.25)',
              color: 'white',
              fontWeight: 600,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' },
            }}
          >
            New Game
          </Button>
        </Paper>

        {/* ── Step 11: Win state ── */}
        {isComplete && (
          <Paper
            className="win-banner"
            role="status"
            aria-live="polite"
            elevation={2}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              bgcolor: 'success.main',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Board Complete! You won in {moves} move{moves !== 1 ? 's' : ''}.
            </Typography>
          </Paper>
        )}

        {/* ── Step 8 + 9: Game board grid with captured-cell treatment ── */}
        <Paper elevation={2} sx={{ p: 1.5, borderRadius: 2, mb: 3 }} className="game-board">
          <Box
            className="game-board-grid"
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: '2px',
            }}
          >
            {board.map((row, r) =>
              row.map((cellColor, c) => {
                const key = `${r},${c}`;
                const isCaptured = captured.has(key);
                return (
                  <Box
                    key={key}
                    sx={{
                      aspectRatio: '1',
                      bgcolor: COLOR_CSS[cellColor] || cellColor,
                      borderRadius: '3px',
                      // Non-color captured indicator: white inset ring
                      outline: isCaptured ? '2px solid white' : 'none',
                      outlineOffset: '-3px',
                    }}
                  />
                );
              })
            )}
          </Box>
        </Paper>

        {/* ── Step 10: Color palette controls ── */}
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
            {palette.map((color) => {
              const isActive = color === currentColor;
              return (
                <Button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  aria-label={`Select ${color}`}
                  aria-pressed={isActive}
                  disabled={isComplete}
                  sx={{
                    minWidth: 52,
                    minHeight: 52,
                    borderRadius: '50%',
                    bgcolor: COLOR_CSS[color] || color,
                    // Active: outer double-ring so it's identifiable without color alone
                    border: isActive ? '3px solid #222' : '3px solid transparent',
                    boxShadow: isActive
                      ? '0 0 0 2px white, 0 0 0 4px #222'
                      : '0 1px 3px rgba(0,0,0,0.3)',
                    '&:hover': {
                      bgcolor: COLOR_CSS[color] || color,
                      opacity: 0.85,
                    },
                    '&.Mui-disabled': {
                      bgcolor: COLOR_CSS[color] || color,
                      opacity: 0.45,
                    },
                  }}
                />
              );
            })}
          </Stack>
        </Paper>

      </Container>
    </Box>
  );
}

export default App;
