import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard, KanbanColumnType } from './KanbanBoard';
import { useState } from 'react';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Patterns/KanbanBoard',
  component: KanbanBoard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {
  render: () => {
    const [cols, setCols] = useState<KanbanColumnType[]>([
      {
        id: 'unpaid',
        title: 'Belum Bayar',
        cards: [{ id: 'order-101', title: 'Pesanan #101' }, { id: 'order-102', title: 'Pesanan #102' }],
      },
      {
        id: 'processing',
        title: 'Diproses',
        cards: [{ id: 'order-103', title: 'Pesanan #103' }],
      },
      {
        id: 'shipped',
        title: 'Dikirim',
        cards: [],
      },
    ]);

    const handleCardMove = (cardId: string, fromColId: string, toColId: string) => {
      setCols((prev) => {
        return prev.map((col) => {
          if (col.id === fromColId) {
            return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
          }
          if (col.id === toColId) {
            const movingCard = prev.find((c) => c.id === fromColId)?.cards.find((c) => c.id === cardId);
            return movingCard ? { ...col, cards: [...col.cards, movingCard] } : col;
          }
          return col;
        });
      });
    };

    return (
      <KanbanBoard
        columns={cols}
        onCardMove={handleCardMove}
      />
    );
  },
};
