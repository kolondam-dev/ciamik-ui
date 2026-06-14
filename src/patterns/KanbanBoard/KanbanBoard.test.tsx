import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KanbanBoard, KanbanColumnType } from './KanbanBoard';

const mockColumns: KanbanColumnType[] = [
  {
    id: 'todo',
    title: 'Harus Dikerjakan',
    cards: [{ id: 'card-1', title: 'Tugas 1' }],
  },
  {
    id: 'done',
    title: 'Selesai',
    cards: [{ id: 'card-2', title: 'Tugas 2' }],
  },
];

describe('KanbanBoard', () => {
  it('renders columns and cards correctly', () => {
    render(
      <KanbanBoard
        columns={mockColumns}
        onCardMove={() => {}}
      />
    );

    expect(screen.getByText('Harus Dikerjakan')).toBeInTheDocument();
    expect(screen.getByText('Selesai')).toBeInTheDocument();
    expect(screen.getByText('Tugas 1')).toBeInTheDocument();
    expect(screen.getByText('Tugas 2')).toBeInTheDocument();
  });

  it('triggers onCardMove callback on drag drop', () => {
    const onCardMove = vi.fn();
    render(
      <KanbanBoard
        columns={mockColumns}
        onCardMove={onCardMove}
      />
    );

    const card = screen.getByTestId('kanban-card-card-1');
    const targetColumn = screen.getByTestId('kanban-column-done');

    // Mock drag events
    const dragStartEvent = {
      dataTransfer: {
        setData: vi.fn(),
        effectAllowed: null,
      },
    };
    
    fireEvent.dragStart(card, dragStartEvent);
    
    const dropEvent = {
      preventDefault: vi.fn(),
      dataTransfer: {
        getData: vi.fn().mockReturnValue(JSON.stringify({ cardId: 'card-1', sourceColumnId: 'todo' })),
      },
    };

    fireEvent.drop(targetColumn, dropEvent);

    expect(onCardMove).toHaveBeenCalledWith('card-1', 'todo', 'done');
  });

  it('respects validation block if movement is invalid', () => {
    const onCardMove = vi.fn();
    const validateMove = vi.fn().mockReturnValue(false); // reject move
    
    render(
      <KanbanBoard
        columns={mockColumns}
        onCardMove={onCardMove}
        validateMove={validateMove}
      />
    );

    const card = screen.getByTestId('kanban-card-card-1');
    const targetColumn = screen.getByTestId('kanban-column-done');

    // Drag start
    fireEvent.dragStart(card, {
      dataTransfer: {
        setData: () => {},
        effectAllowed: null,
      },
    });

    // Drop
    fireEvent.drop(targetColumn, {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => JSON.stringify({ cardId: 'card-1', sourceColumnId: 'todo' }),
      },
    });

    expect(validateMove).toHaveBeenCalledWith('card-1', 'todo', 'done');
    expect(onCardMove).not.toHaveBeenCalled();
  });
});
