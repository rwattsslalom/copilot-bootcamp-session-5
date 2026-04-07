- Epic: Game Board Setup
  - Story: Generate a configurable color grid
  - Story: Populate the board from the active color palette
  - Story: Ensure a new board starts with multiple colors
  - Story: Initialize the starting captured cell

- Epic: Captured Region Management
  - Story: Track captured cells across the board
  - Story: Keep the captured region contiguous
  - Story: Sync captured region color with the active color
  - Story: Expand the starting region for matching adjacent cells

- Epic: Color Selection Controls
  - Story: Render selectable color buttons
  - Story: Highlight the active color choice
  - Story: Ignore moves that repeat the current color
  - Story: Support pointer selection for palette controls

- Epic: Flood Fill Gameplay
  - Story: Recolor the captured region on valid moves
  - Story: Capture orthogonally connected matching cells
  - Story: Exclude diagonal-only cells from capture
  - Story: Stop expansion when no matching neighbors remain

- Epic: Game Progress Tracking
  - Story: Show the current move count
  - Story: Start the move counter at zero
  - Story: Increment moves after valid color changes
  - Story: Detect when the full board is captured

- Epic: Game Completion and Restart
  - Story: Display a win state when the board is complete
  - Story: Prevent additional progress after game completion
  - Story: Add a New Game control
  - Story: Reset game state on New Game

- Epic: Core Game Layout
  - Story: Render the game board grid
  - Story: Distinguish captured cells visually
  - Story: Keep the move counter visible during play
  - Story: Keep New Game available during and after play

- Epic: Responsive and Accessible UI
  - Story: Support desktop and mobile layouts
  - Story: Make color controls keyboard accessible
  - Story: Add accessible names to interactive controls
  - Story: Convey captured and active states without color alone
  - Story: Announce the win state to assistive technologies

- Epic: Gameplay Logic Testing
  - Story: Test board generation dimensions
  - Story: Test board generation against the configured palette
  - Story: Test initial captured region setup
  - Story: Test same-color move behavior
  - Story: Test valid move counting
  - Story: Test orthogonal flood-fill expansion
  - Story: Test diagonal exclusion rules
  - Story: Test completion detection

- Epic: User Interface Testing
  - Story: Test initial board and palette rendering
  - Story: Test the initial move counter display
  - Story: Test move count updates after valid selections
  - Story: Test win state rendering
  - Story: Test New Game reset behavior