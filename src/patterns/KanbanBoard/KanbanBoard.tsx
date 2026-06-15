import React from 'react';
import { Card } from '../../primitives/Card';
import { cn } from '../../utils';
import styles from './KanbanBoard.module.css';

export interface KanbanCardType {
  id: string;
  title: string;
  [key: string]: any;
}

export interface KanbanColumnType {
  id: string;
  title: string;
  cards: KanbanCardType[];
}

export interface KanbanBoardProps {
  columns: KanbanColumnType[];
  onCardMove: (cardId: string, fromColumnId: string, toColumnId: string) => void;
  validateMove?: (cardId: string, fromColumnId: string, toColumnId: string) => boolean;
  renderCard?: (card: KanbanCardType) => React.ReactNode;
  className?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onCardMove,
  validateMove,
  renderCard,
  className,
}) => {
  const handleDragStart = (
    e: React.DragEvent,
    cardId: string,
    sourceColumnId: string
  ) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ cardId, sourceColumnId }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;

      const { cardId, sourceColumnId } = JSON.parse(dataStr);

      if (sourceColumnId === targetColumnId) return;

      // Run validation if provided
      if (validateMove) {
        const isValid = validateMove(cardId, sourceColumnId, targetColumnId);
        if (!isValid) {
          return; // reject drop
        }
      }

      onCardMove(cardId, sourceColumnId, targetColumnId);
    } catch (err) {
      console.error('Failed to handle drop', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className={cn(styles.boardContainer, className)}>
      {/* Board Columns Grid */}
      <div className={styles.board}>
        {columns.map((col) => (
          <div
            key={col.id}
            className={styles.column}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            data-testid={`kanban-column-${col.id}`}
          >
            {/* Column Header */}
            <div className={styles.columnHeader}>
              <h4 className={styles.columnTitle}>{col.title}</h4>
              <span className={styles.cardCount}>{col.cards.length}</span>
            </div>

            {/* Cards List */}
            <div className={styles.cardsList}>
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id, col.id)}
                  className={styles.draggableCardWrapper}
                  data-testid={`kanban-card-${card.id}`}
                >
                  {renderCard ? (
                    renderCard(card)
                  ) : (
                    <Card interactive className={styles.defaultCard}>
                      <h5 className={styles.cardTitle}>{card.title}</h5>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
