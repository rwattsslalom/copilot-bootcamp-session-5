import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

test('renders TODO App heading', async () => {
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

test('displays empty state message when no todos', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });
});

test('calculates and displays stats correctly', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true },
      { id: 3, title: 'Todo 3', completed: false },
    ],
  });

  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/2 items left/i)).toBeInTheDocument();
  });
  
  expect(screen.getByText(/1 completed/i)).toBeInTheDocument();
});

test('deletes a todo when delete button is clicked', async () => {
  const mockTodos = [
    { id: 1, title: 'Test Todo', completed: false },
  ];

  global.fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockTodos,
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1 }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

  const testQueryClient = createTestQueryClient();
  const user = userEvent.setup();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  // Wait for todo to appear
  await waitFor(() => {
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  // Click delete button
  const deleteButton = screen.getByRole('button', { name: /delete/i });
  await user.click(deleteButton);

  // Verify delete API was called
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});

test('handles API errors gracefully', async () => {
  global.fetch.mockRejectedValueOnce(new Error('Network error'));

  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/error loading todos/i)).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
