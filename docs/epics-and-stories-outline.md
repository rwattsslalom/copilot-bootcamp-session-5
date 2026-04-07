## Implementation Progress

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 – Remove TODO Application Flow | ✅ DONE | `App.js` rewritten with game state shell; all TODO state, mutations, and UI removed. `index.js` cleaned of `QueryClientProvider`. |
| Phase 2 – Build Core Game Logic | ⬜ Not started | |
| Phase 3 – Rebuild the UI | ⬜ Not started | |
| Phase 4 – Styling and Theming | ⬜ Not started | |
| Phase 5 – Accessibility | ⬜ Not started | |
| Phase 6 – Rewrite Test Suite | ⬜ Not started | |
| Phase 7 – Cleanup and Verification | ⬜ Not started | |

> **Note:** No individual feature stories are marked DONE yet. Phase 1 is the preparatory cleanup and game state scaffolding pass. Feature stories' acceptance criteria are satisfied as their game functionality is built in Phases 2–3.

---

- Epic: Game Board Setup
  - Story: Generate a configurable color grid
    - Acceptance Criteria: A new game creates a rectangular grid using configurable row and column values.
    - Acceptance Criteria: The rendered board matches the configured dimensions.
    - Technical Requirement: Replace the current todo-focused screen in `packages/frontend/src/App.js` with game state that stores `rows`, `columns`, and a generated board matrix.
    - Technical Requirement: Implement a reusable board-generation utility that returns a rectangular two-dimensional array for configurable dimensions.
  - Story: Populate the board from the active color palette
    - Acceptance Criteria: Each generated cell is assigned a color from the configured palette.
    - Acceptance Criteria: No generated cell uses a color outside the configured palette.
    - Technical Requirement: Store the active palette in frontend state or configuration rather than hardcoding todo-specific UI values in `packages/frontend/src/App.js`.
    - Technical Requirement: Ensure the board-generation utility selects colors only from the configured palette source.
  - Story: Ensure a new board starts with multiple colors
    - Acceptance Criteria: A newly generated board contains at least two colors unless a test-specific configuration allows otherwise.
    - Technical Requirement: Add validation in board generation to retry or regenerate when a non-test board resolves to a single color.
  - Story: Initialize the starting captured cell
    - Acceptance Criteria: A new game starts with the coordinate `0,0` as the initial captured cell.
    - Acceptance Criteria: The initial captured region is visible on first render.
    - Technical Requirement: Initialize captured-region state from the top-left cell and expose that state to the board renderer in `packages/frontend/src/App.js`.
    - Technical Requirement: Add captured-region styling in `packages/frontend/src/App.css` or MUI `sx` props so the initial selection is visibly distinct.

- Epic: Captured Region Management
  - Story: Track captured cells across the board
    - Acceptance Criteria: The game stores which coordinates belong to the captured region.
    - Acceptance Criteria: Captured cells are rendered with a distinct visual treatment.
    - Technical Requirement: Replace the current remote todo collection from React Query with local game state for captured coordinates, preferably a `Set` keyed by `row,column`.
    - Technical Requirement: Pass captured-state membership from the top-level `App` component into board and cell rendering rather than inferring it from DOM state.
  - Story: Keep the captured region contiguous
    - Acceptance Criteria: The captured region remains a single orthogonally connected area after initialization and after each valid move.
    - Technical Requirement: Centralize capture updates in pure game-logic helpers so contiguity is enforced by algorithm rather than UI events.
  - Story: Sync captured region color with the active color
    - Acceptance Criteria: The displayed color of all captured cells matches the current captured-region color.
    - Acceptance Criteria: After a valid move, all previously captured cells update to the selected color.
    - Technical Requirement: Store `currentColor` alongside captured coordinates in `packages/frontend/src/App.js` and use it when rendering captured cells.
    - Technical Requirement: Update board data immutably when recoloring captured cells so React re-renders reliably.
  - Story: Expand the starting region for matching adjacent cells
    - Acceptance Criteria: On new game setup, any cells orthogonally connected to the starting cell and sharing its color are added to the captured region.
    - Acceptance Criteria: Diagonal-only matching cells are not included in the initial expansion.
    - Technical Requirement: Run the same flood-fill utility during initialization that will be used during gameplay so starting-region behavior and move behavior stay consistent.

- Epic: Color Selection Controls
  - Story: Render selectable color buttons
    - Acceptance Criteria: The app renders one control for each available color in the palette.
    - Acceptance Criteria: Each color control visually matches its represented board color.
    - Technical Requirement: Replace the current add-todo form controls in `packages/frontend/src/App.js` with palette button rendering derived from the configured color list.
    - Technical Requirement: Use existing MUI button primitives or chips already available in the codebase to render the palette consistently.
  - Story: Highlight the active color choice
    - Acceptance Criteria: The currently active captured-region color is visually distinguishable in the palette.
    - Technical Requirement: Extend the current MUI-based styling approach in `packages/frontend/src/theme.js` and `packages/frontend/src/App.css` to support an active palette state.
  - Story: Ignore moves that repeat the current color
    - Acceptance Criteria: Selecting the current captured-region color does not change the board.
    - Acceptance Criteria: Selecting the current captured-region color does not increment the move counter.
    - Technical Requirement: Guard the palette click handler in `packages/frontend/src/App.js` before any state updates occur when the selected color equals `currentColor`.
  - Story: Support pointer selection for palette controls
    - Acceptance Criteria: Clicking a color control triggers move handling for that color.
    - Technical Requirement: Wire palette controls to a single move handler in `packages/frontend/src/App.js`, replacing the current todo add, toggle, and delete handlers.

- Epic: Flood Fill Gameplay
  - Story: Recolor the captured region on valid moves
    - Acceptance Criteria: On a valid color selection, all cells in the captured region adopt the selected color.
    - Technical Requirement: Implement a pure recolor step that updates all currently captured board coordinates before running expansion.
  - Story: Capture orthogonally connected matching cells
    - Acceptance Criteria: After recoloring, any orthogonally adjacent cells matching the selected color are added to the captured region.
    - Acceptance Criteria: Expansion continues until no further orthogonally adjacent matching cells remain.
    - Technical Requirement: Add a flood-fill helper using breadth-first search or depth-first search and call it from the move handler in `packages/frontend/src/App.js`.
    - Technical Requirement: Keep neighbor lookup logic isolated in a utility so board traversal rules are testable outside the component.
  - Story: Exclude diagonal-only cells from capture
    - Acceptance Criteria: Cells that only touch the captured region diagonally are not captured.
    - Technical Requirement: Limit neighbor generation to up, down, left, and right coordinates only.
  - Story: Stop expansion when no matching neighbors remain
    - Acceptance Criteria: Flood-fill processing completes when the search frontier contains no uncaptured orthogonal neighbors of the target color.
    - Technical Requirement: Ensure the flood-fill helper terminates on an exhausted queue or stack and does not rely on render loops or asynchronous polling.

- Epic: Game Progress Tracking
  - Story: Show the current move count
    - Acceptance Criteria: The UI displays the current move total during gameplay.
    - Technical Requirement: Replace the current placeholder stats chips in `packages/frontend/src/App.js` with move-count output derived from game state.
  - Story: Start the move counter at zero
    - Acceptance Criteria: A new game initializes the move counter to `0`.
    - Technical Requirement: Initialize `moves` in the new game setup path and reset it whenever the board is regenerated.
  - Story: Increment moves after valid color changes
    - Acceptance Criteria: Each valid color selection increments the move counter by exactly `1`.
    - Technical Requirement: Increment moves in the same transaction as a valid recolor-and-capture update to avoid duplicate counts.
  - Story: Detect when the full board is captured
    - Acceptance Criteria: The game marks completion when every board cell belongs to the captured region.
    - Technical Requirement: Compute completion from captured cell count versus total board size after initialization and after each valid move.

- Epic: Game Completion and Restart
  - Story: Display a win state when the board is complete
    - Acceptance Criteria: When all board cells are captured, the UI displays a completion message.
    - Acceptance Criteria: The completion message does not rely only on color.
    - Technical Requirement: Replace the current todo heading and passive stats section with a game status area that conditionally renders a completion message.
  - Story: Prevent additional progress after game completion
    - Acceptance Criteria: Once the game is complete, further color selections do not change the board state.
    - Acceptance Criteria: Once the game is complete, further color selections do not increment the move counter.
    - Technical Requirement: Add an `isComplete` guard to the shared palette click handler in `packages/frontend/src/App.js`.
  - Story: Add a New Game control
    - Acceptance Criteria: The UI provides a New Game control during active play and after completion.
    - Technical Requirement: Repurpose one of the existing MUI buttons in `packages/frontend/src/App.js` as a persistent New Game action.
  - Story: Reset game state on New Game
    - Acceptance Criteria: Activating New Game regenerates the board.
    - Acceptance Criteria: Activating New Game resets the captured region to the initial starting region.
    - Acceptance Criteria: Activating New Game resets the move counter to `0`.
    - Acceptance Criteria: Activating New Game clears the completed state.
    - Technical Requirement: Funnel New Game through a single initialization routine that rebuilds board, captured state, `currentColor`, `moves`, and `isComplete` together.

- Epic: Core Game Layout
  - Story: Render the game board grid
    - Acceptance Criteria: The board renders as a visible grid of cells with clear boundaries.
    - Technical Requirement: Replace the current todo `List` layout in `packages/frontend/src/App.js` with a grid-based board component using CSS Grid or MUI layout primitives.
  - Story: Distinguish captured cells visually
    - Acceptance Criteria: Captured cells have a visual indicator beyond fill color alone.
    - Technical Requirement: Add a secondary captured-state treatment such as border, inset ring, pattern, or icon using `packages/frontend/src/App.css` or MUI styling.
  - Story: Keep the move counter visible during play
    - Acceptance Criteria: The move counter is visible without scrolling during normal gameplay.
    - Technical Requirement: Place the move counter in the top-level game layout, not below the board where it could move off-screen for larger boards.
  - Story: Keep New Game available during and after play
    - Acceptance Criteria: The New Game control remains visible and usable before and after the win state.
    - Technical Requirement: Render the New Game control in a persistent header or status section rather than conditionally mounting it only after completion.

- Epic: Responsive and Accessible UI
  - Story: Support desktop and mobile layouts
    - Acceptance Criteria: The app layout remains usable on desktop and mobile widths.
    - Acceptance Criteria: The UI remains responsive for moderate board sizes such as `10x10` and `12x12`.
    - Technical Requirement: Rework the current container and card layout in `packages/frontend/src/App.js` so the board and palette wrap cleanly across breakpoints.
    - Technical Requirement: Size cells and spacing responsively using MUI `sx` breakpoints or CSS rules in `packages/frontend/src/App.css`.
  - Story: Make color controls keyboard accessible
    - Acceptance Criteria: Color controls can be reached and activated using the keyboard.
    - Technical Requirement: Use semantic button elements from MUI so palette controls inherit keyboard behavior without custom key handling.
  - Story: Add accessible names to interactive controls
    - Acceptance Criteria: Color controls and the New Game control expose accessible names.
    - Technical Requirement: Provide explicit accessible labels for palette buttons and the New Game action in `packages/frontend/src/App.js`.
  - Story: Convey captured and active states without color alone
    - Acceptance Criteria: The active palette choice is identifiable without relying only on color.
    - Acceptance Criteria: Captured cells are identifiable without relying only on color.
    - Technical Requirement: Add non-color cues such as selected outlines, labels, aria attributes, or iconography in the board and palette UI.
  - Story: Announce the win state to assistive technologies
    - Acceptance Criteria: The completion message is exposed to assistive technologies when the game is won.
    - Technical Requirement: Render the win state in a semantic status region or live region in `packages/frontend/src/App.js`.

- Epic: Gameplay Logic Testing
  - Story: Test board generation dimensions
    - Acceptance Criteria: Automated tests verify that board generation returns the requested row and column counts.
    - Technical Requirement: Replace the current heading-only test coverage in `packages/frontend/src/__tests__/App.test.js` with focused tests for board-generation utilities.
  - Story: Test board generation against the configured palette
    - Acceptance Criteria: Automated tests verify that generated cells only use configured palette colors.
    - Technical Requirement: Add deterministic unit tests around the board-generation utility with an injected palette.
  - Story: Test initial captured region setup
    - Acceptance Criteria: Automated tests verify the initial captured region matches the expected starting state and initial same-color expansion behavior.
    - Technical Requirement: Expose initialization helpers separately from the React component so initial capture behavior can be tested without rendering the full app.
  - Story: Test same-color move behavior
    - Acceptance Criteria: Automated tests verify that selecting the current color does not change captured state or move count.
    - Technical Requirement: Add pure-function tests for the move handler logic to verify same-color guards.
  - Story: Test valid move counting
    - Acceptance Criteria: Automated tests verify that a valid color change increments the move counter exactly once.
    - Technical Requirement: Assert move-count changes in state-transition tests rather than depending only on rendered text.
  - Story: Test orthogonal flood-fill expansion
    - Acceptance Criteria: Automated tests verify that orthogonally connected matching cells are captured after a valid move.
    - Technical Requirement: Add unit tests for the flood-fill helper using fixed board fixtures.
  - Story: Test diagonal exclusion rules
    - Acceptance Criteria: Automated tests verify that diagonal-only matching cells are not captured.
    - Technical Requirement: Include board fixtures that isolate diagonal adjacency cases in game-logic tests.
  - Story: Test completion detection
    - Acceptance Criteria: Automated tests verify that completion is detected when all cells are captured.
    - Technical Requirement: Add state-transition tests that confirm `isComplete` becomes true only when captured count equals total cells.

- Epic: User Interface Testing
  - Story: Test initial board and palette rendering
    - Acceptance Criteria: UI tests verify that the board and color palette render on initial load.
    - Technical Requirement: Rewrite `packages/frontend/src/__tests__/App.test.js` to render the game UI instead of asserting the current TODO heading.
  - Story: Test the initial move counter display
    - Acceptance Criteria: UI tests verify that the move counter starts at `0`.
    - Technical Requirement: Add rendered assertions for the initial move counter in React Testing Library tests.
  - Story: Test move count updates after valid selections
    - Acceptance Criteria: UI tests verify that clicking a valid color selection updates the displayed move count.
    - Technical Requirement: Use `@testing-library/user-event` to simulate palette interaction and assert updated move text.
  - Story: Test win state rendering
    - Acceptance Criteria: UI tests verify that the completion message appears when the board is fully captured.
    - Technical Requirement: Allow deterministic board injection or mock initial state so the test suite can reach the win state predictably.
  - Story: Test New Game reset behavior
    - Acceptance Criteria: UI tests verify that activating New Game resets the board and move counter.
    - Technical Requirement: Add UI tests that trigger the New Game control and assert that board state and moves reset together.