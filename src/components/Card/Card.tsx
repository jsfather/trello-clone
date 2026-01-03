/**
 * Card Component
 * Displays a single card with drag support
 * Following Single Responsibility - only handles card display
 */

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card as CardType } from "@/types";
import styles from "./Card.module.scss";

interface CardProps {
  card: CardType;
  listId: string;
  onOpenModal: (card: CardType, listId: string) => void;
}

export default function Card({ card, listId, onOpenModal }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card,
      listId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    onOpenModal(card, listId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpenModal(card, listId);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${styles.card} ${isDragging ? styles.dragging : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Card: ${card.title}`}
    >
      <div className={styles.content}>
        <span className={styles.title}>{card.title}</span>
      </div>
      <div className={styles.footer}>
        <span className={styles.commentCount}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h1.172a.5.5 0 0 1 .354.146l1.828 1.829a.5.5 0 0 0 .854-.354V13.5a.5.5 0 0 1 .5-.5h6.292A1.5 1.5 0 0 0 15 11.5v-7A1.5 1.5 0 0 0 13.5 3h-11Z" />
          </svg>
          Comments ({card.comments.length})
        </span>
      </div>
    </div>
  );
}
