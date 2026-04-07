# Color Fill Game Implementation Spec

## Overview

This app is a React implementation of a color-fill puzzle game. The user starts with a single selected cell on a board of colored cells and attempts to capture the full board by repeatedly choosing colors from a palette. Each color choice expands the currently captured region into any orthogonally adjacent cells of the chosen color. The game ends when the entire board has been captured.

## Product Goal

Build a small interactive game that is easy to understand, replayable, and configurable. The implementation should support different board sizes and color palettes without requiring structural changes to the UI or game logic.

## Core Gameplay

1. A new game generates a grid of colored cells.
2. The starting captured region contains exactly one cell, by default the top-left cell.
3. The user chooses a color from the available palette.
4. The captured region changes to that color.
5. Any cells touching the captured region that share the chosen color are absorbed into the captured region.
6. The move counter increments after each valid move.
7. The process repeats until all cells are captured.
8. When the board is fully captured, the app displays a completed state and offers a way to start a new game.

## Functional Requirements

### Board Generation

- The game must generate a rectangular grid at the start of a new game.
- Grid dimensions must be configurable.
- Each cell must be assigned a color from the available palette.
- The initial board must contain at least two colors unless explicitly configured otherwise for testing.

### Captured Region

- The game must track which cells belong to the captured region.
- The initial captured region must contain exactly one starting cell.
- The captured region must always be contiguous.
- The displayed color of the captured region must match the currently selected region color.

### Color Selection

- The app must render a control for each available color.
- The user must be able to select a color with a pointer click.
- The currently active captured-region color should be visually distinguishable.
- Choosing the same color as the current captured-region color should not change the board state.
- A same-color selection should not increment the move counter.

### Flood-Fill Logic

- On a valid color selection, all cells in the captured region adopt the selected color.
- After recoloring, the game must absorb all orthogonally connected cells that now match the captured-region color.
- The absorption process must continue until no additional matching adjacent cells remain.
- Diagonal-only contact must not count as connected.

### Move Counter

- The app must display the current number of moves.
- The move counter must start at zero for a new game.
- The move counter must increase by one after each valid color change.

### Win State

- The game must detect when every board cell belongs to the captured region.
- When the user wins, the app must display a completion message such as Game Over or You Win.
- Once the game is complete, the app may either disable further moves or ignore them.
- The completed state must present a New Game action.

### New Game

- The app must provide a New Game control.
- Starting a new game must regenerate the board, reset the captured region to one starting cell, clear the completed state, and reset the move counter to zero.

## Non-Functional Requirements

- The app should render correctly on desktop and mobile widths.
- The interaction model should be understandable without additional instructions.
- The game logic should be deterministic for a given board state and color selection.
- The implementation should be simple enough to test with unit and UI tests.
- The UI should remain responsive for moderate board sizes such as 10x10 or 12x12.

## Suggested Data Model

The implementation can use a normalized but simple in-memory model.

### Suggested State Shape

```js
{
  rows: 8,
  columns: 8,
  palette: ['red', 'yellow', 'green', 'blue', 'purple'],
  board: [
    ['red', 'blue', 'green'],
    ['yellow', 'red', 'blue']
  ],
  captured: ['0,0', '0,1'],
  currentColor: 'red',
  moves: 3,
  isComplete: false
}
```

### Data Structure Notes

- `board` should store each cell's current color.
- `captured` can be a `Set` of coordinate keys such as `"row,column"` for efficient membership checks.
- `currentColor` should reflect the active color of the captured region.
- `isComplete` should be derived after each move or stored explicitly if that keeps rendering logic simpler.

## Suggested Component Structure

### App

- Owns game state and gameplay handlers.
- Renders the title, status area, board, palette, and New Game control.

### Board

- Receives the board data and captured-region membership.
- Renders the grid layout.
- Passes styling information to individual cells.

### Cell

- Displays a single board square.
- Applies the correct background color.
- Applies a selected or captured visual treatment when the cell belongs to the captured region.

### ColorPalette

- Renders available color buttons.
- Invokes the selection handler when a color is chosen.
- Indicates the active color and optionally disables it.

### StatusPanel

- Displays move count.
- Displays win state text when the puzzle is complete.

## Algorithm Requirements

### New Game Generation

1. Create a grid using configured row and column counts.
2. Assign each cell a random color from the palette.
3. Set the starting coordinate to `0,0` unless a different starting rule is introduced.
4. Initialize the captured region with the starting coordinate.
5. Set `currentColor` to the starting cell's color.
6. Expand the initial captured region to include any immediately connected cells of the same starting color.
7. Set moves to `0` and completion state based on the initial capture result.

### Applying a Move

1. Ignore the move if the game is already complete.
2. Ignore the move if the selected color matches `currentColor`.
3. Recolor all captured cells to the selected color.
4. Run flood-fill expansion from the captured boundary using the selected color.
5. Update the captured set with all newly absorbed cells.
6. Increment the move count.
7. Update `currentColor`.
8. Recompute whether all cells are captured.

### Flood-Fill Expansion Rules

- Use breadth-first search or depth-first search.
- Start from all currently captured coordinates.
- Visit only orthogonal neighbors: up, down, left, and right.
- Add a neighbor if it is not already captured and its color matches the target color.
- Continue until the search frontier is exhausted.

## UI Requirements

- The board should visually read as a grid with clear cell boundaries.
- Captured cells should be visually distinct, for example with a border, overlay, or subtle highlight.
- Color buttons should clearly map to board colors.
- The move counter should be visible without scrolling.
- The New Game control should remain available during and after play.
- The win message should be obvious and not rely only on color.

## Accessibility Requirements

- Color controls must be keyboard reachable.
- Interactive elements must have accessible names.
- The UI should not rely solely on color to communicate active or captured state.
- The win message should be available to assistive technologies.
- Color buttons should meet reasonable target size requirements for touch and mouse use.

## Testing Requirements

### Unit Tests

- Board generation returns a grid with the requested dimensions.
- Board generation only uses colors from the configured palette.
- Initial state contains exactly one starting coordinate before any same-color expansion logic, or the expected expanded region after initialization if expansion is applied immediately.
- Selecting the same color does not increment moves.
- Valid color changes increment moves exactly once.
- Flood-fill captures connected matching neighbors.
- Diagonal cells are not captured unless they become orthogonally connected through other cells.
- Completion is detected when all cells are captured.

### UI Tests

- The app renders a board and palette.
- The move counter starts at zero.
- Clicking a color updates the move count when the move is valid.
- Completing the board shows the completion message.
- Clicking New Game resets the board and move counter.

## Acceptance Criteria

The implementation is complete when all of the following are true:

1. A user can start a new game and see a generated color grid.
2. A single captured starting region is visible.
3. A user can choose colors from a rendered palette.
4. Choosing a new color expands the captured region according to orthogonal flood-fill rules.
5. The move count updates correctly.
6. The game detects full-board capture and presents a completed state.
7. A user can start over with New Game.
8. The app remains usable across configurable board sizes and color sets.

## Implementation Notes

- Keep pure gameplay logic separate from React rendering where possible.
- Prefer small utility functions for board generation, neighbor lookup, and flood-fill expansion.
- Avoid coupling visual styling directly to game rules beyond the color and captured-state indicators.
- If randomness makes tests brittle, isolate board generation so deterministic test boards can be injected.