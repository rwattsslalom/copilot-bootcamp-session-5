# Color Fill Game Implementation Plan

## Goal

Convert the current frontend from the existing TODO application into the color-fill puzzle game defined in the implementation spec and backlog outline.

## Current Baseline

The current frontend is built with React, Material UI, and React Query. The main application in `packages/frontend/src/App.js` is still a TODO app with remote data fetching, add and toggle mutations, placeholder delete behavior, and todo-specific layout and tests. The implementation plan below assumes that code will be replaced incrementally rather than layered on top of the TODO workflow.

## Phase 1: Remove TODO-Specific Application Flow

### Step 1: Replace the top-level app state model

- Remove todo-specific state such as `newTodoTitle` and related mutation handlers from `packages/frontend/src/App.js`.
- Remove the React Query todo-fetching dependency from the app component.
- Introduce local game state for:
  - board dimensions
  - color palette
  - board cell colors
  - captured region
  - current color
  - move count
  - completion state

### Step 2: Strip TODO-specific UI sections

- Remove the add-todo form.
- Remove the todo list rendering.
- Remove edit and delete icon actions.
- Remove the placeholder todo stats chips.
- Keep the existing MUI application shell only where it still helps the game layout.

## Phase 2: Build Core Game Logic

### Step 3: Create board-generation utilities

- Add a utility module for generating a rectangular board from configurable row and column values.
- Add logic to populate each board cell using the configured palette.
- Add validation so generated boards contain at least two colors in normal gameplay.

### Step 4: Create captured-region initialization logic

- Add a helper that initializes the captured region from the top-left cell.
- Expand the starting captured region to include orthogonally adjacent cells of the same color.
- Set the initial `currentColor`, `moves`, and `isComplete` values.

### Step 5: Implement move application logic

- Add a pure function that applies a selected color to the current game state.
- Guard against invalid moves when:
  - the selected color matches `currentColor`
  - the game is already complete
- Recolor captured cells before expansion.
- Increment moves only for valid color changes.

### Step 6: Implement flood-fill expansion

- Add a flood-fill helper using breadth-first search or depth-first search.
- Limit neighbors to up, down, left, and right.
- Expand until no matching orthogonal neighbors remain.
- Return updated captured-region membership for use by the app state.

### Step 7: Implement completion detection

- Add a helper that compares captured cell count to total board size.
- Recompute completion after initialization and after each valid move.

## Phase 3: Rebuild the UI Around the Game

### Step 8: Render the game board

- Replace the current list-based layout with a grid-based board renderer.
- Use CSS Grid or MUI layout primitives to render rows and columns accurately.
- Ensure board dimensions are driven by the same configuration used by the board-generation logic.

### Step 9: Add captured-cell presentation

- Give each cell a background color matching its board value.
- Add a non-color visual indicator for captured cells such as a border, ring, pattern, or overlay.
- Ensure the initial captured region is visible on first render.

### Step 10: Add the color palette controls

- Render one interactive control per available color.
- Visually distinguish the active color.
- Route all palette interactions through a single move handler.
- Use semantic button elements so pointer and keyboard behavior work correctly.

### Step 11: Add status and restart controls

- Show the move counter near the top of the layout.
- Show a clear win state when the game is complete.
- Add a persistent New Game action.
- Ensure New Game calls the same initialization routine used on first load.

## Phase 4: Align Styling and Theming

### Step 12: Update the visual theme for the game

- Review `packages/frontend/src/theme.js` and keep only theme tokens that still support the game.
- Remove TODO-specific visual assumptions from the page header and content cards.
- Add styling support for:
  - active palette state
  - captured-cell state
  - responsive board sizing
  - game status area

### Step 13: Update component-level styles

- Replace leftover TODO-focused styles in `packages/frontend/src/App.css`.
- Add any board, palette, and captured-region styling not better expressed in MUI `sx` props.
- Ensure the layout remains usable on mobile and desktop widths.

## Phase 5: Add Accessibility Support

### Step 14: Make the interactive game controls accessible

- Add accessible names for palette controls.
- Add an accessible name for the New Game action.
- Ensure color controls are keyboard reachable and activatable.

### Step 15: Add non-color state indicators

- Ensure the active palette choice is identifiable without color alone.
- Ensure captured cells are identifiable without color alone.

### Step 16: Announce win state semantically

- Render the completion message in a semantic status or live region.
- Verify the completion state is understandable without relying only on visual styling.

## Phase 6: Rewrite the Test Suite

### Step 17: Replace outdated app tests

- Remove TODO-heading-based assertions from `packages/frontend/src/__tests__/App.test.js`.
- Replace them with tests that reflect the game UI and game logic.

### Step 18: Add unit tests for pure game logic

- Test board-generation dimensions.
- Test palette-only color generation.
- Test initial captured-region expansion.
- Test same-color move rejection.
- Test move counting.
- Test orthogonal flood-fill behavior.
- Test diagonal exclusion.
- Test completion detection.

### Step 19: Add UI interaction tests

- Test initial board and palette rendering.
- Test initial move count.
- Test valid move updates.
- Test win-state rendering.
- Test New Game reset behavior.
- Use deterministic board fixtures or injected game state where needed to avoid brittle tests.

## Phase 7: Cleanup and Verification

### Step 20: Remove obsolete implementation leftovers

- Remove unused React Query imports from `packages/frontend/src/App.js`.
- Remove unused MUI imports related only to todo functionality.
- Remove fetch-based todo logic that no longer applies.

### Step 21: Validate the application manually

- Start a new game and verify the board renders correctly.
- Make valid and invalid moves and confirm move counting behavior.
- Confirm that same-color selections are ignored.
- Confirm that captured-region expansion follows orthogonal rules only.
- Confirm that the full-board completion state appears correctly.
- Confirm that New Game fully resets the experience.

### Step 22: Run automated checks

- Run the frontend test suite.
- Resolve any failures introduced by the refactor.
- Confirm the final app behavior matches the implementation spec and story acceptance criteria.

## Recommended Delivery Order

1. Replace the TODO state and UI shell in `packages/frontend/src/App.js`.
2. Add pure board and flood-fill utilities.
3. Hook the utilities into local game state.
4. Render the board, palette, move counter, and New Game action.
5. Add captured and active-state visuals.
6. Add accessibility support.
7. Rewrite tests.
8. Clean up obsolete imports and verify behavior.

## Definition of Done

The implementation is complete when the current frontend no longer behaves like a TODO app and instead delivers the color-fill game described in the specs, with working gameplay, restart flow, accessible controls, responsive layout, and automated coverage for core logic and UI behavior.