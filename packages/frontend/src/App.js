import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import './App.css';
import { generateBoard, buildInitialGameState, applyMove } from './gameLogic';

// Game configuration
const ROWS = 8;
const COLUMNS = 8;
const PALETTE = ['red', 'yellow', 'green', 'blue', 'purple'];

function initGame() {
  const board = generateBoard(ROWS, COLUMNS, PALETTE);
  return buildInitialGameState(board, PALETTE);
}

function App() {
  const [gameState, setGameState] = useState(initGame);

  const handleColorSelect = (color) => {
    setGameState((prev) => applyMove(prev, color));
  };

  const handleNewGame = () => {
    setGameState(initGame());
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Color Fill
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Capture the board by choosing colors
          </Typography>
        </Paper>

        {/* Move counter and New Game – rendered in Phase 3 (Step 11) */}

        {/* Game board – rendered in Phase 3 (Step 8) */}

        {/* Color palette controls – rendered in Phase 3 (Step 10) */}
      </Container>
    </Box>
  );
}

export default App;
