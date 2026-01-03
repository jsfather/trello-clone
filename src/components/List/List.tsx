/**
 * List Component
 * Displays a single list with cards and drag support
 * Following Single Responsibility - handles list display and card management
 */

"use client";

import { useState } from "react";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { List as ListType, Card as CardType } from "@/types";
import { EditableTitle, AddForm } from "@/components/common";
import Card from "@/components/Card";
import ListMenu from "./ListMenu";
import styles from "./List.module.scss";

interface ListProps {
  list: ListType;
  onUpdateTitle: (listId: string, title: string) => void;
  onDeleteList: (listId: string) => void;
  onDeleteAllCards: (listId: string) => void;
  onAddCard: (listId: string, title: string) => void;
  onOpenCardModal: (card: CardType, listId: string) => void;
}

export default function List({
  list,
  onUpdateTitle,
  onDeleteList,
  onDeleteAllCards,
  onAddCard,
  onOpenCardModal,
}: ListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: "list",
      list,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTitleSave = (newTitle: string) => {
    onUpdateTitle(list.id, newTitle);
  };

  const handleDeleteList = () => {
    onDeleteList(list.id);
  };

  const handleDeleteAllCards = () => {
    onDeleteAllCards(list.id);
  };

  const handleAddCard = (title: string) => {
    onAddCard(list.id, title);
    setIsAddingCard(false);
  };

  const handleCancelAddCard = () => {
    setIsAddingCard(false);
  };

  const cardIds = list.cards.map((card) => card.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.list} ${isDragging ? styles.dragging : ""}`}
    >
      {/* List Header */}
      <div className={styles.header} {...attributes} {...listeners}>
        <EditableTitle
          value={list.title}
          onSave={handleTitleSave}
          tag="h2"
          className={styles.title}
          placeholder="Enter list title..."
        />
        <ListMenu
          onDeleteList={handleDeleteList}
          onDeleteAllCards={handleDeleteAllCards}
          hasCards={list.cards.length > 0}
        />
      </div>

      {/* Cards Container */}
      <div className={styles.cards}>
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {list.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              listId={list.id}
              onOpenModal={onOpenCardModal}
            />
          ))}
        </SortableContext>
      </div>

      {/* Add Card Section */}
      <div className={styles.footer}>
        {isAddingCard ? (
          <AddForm
            onAdd={handleAddCard}
            onCancel={handleCancelAddCard}
            placeholder="Enter a title for this card..."
            buttonText="Add Card"
            isTextarea
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingCard(true)}
            className={styles.addCardButton}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            Add another card
          </button>
        )}
      </div>
    </div>
  );
}
