/**
 * Board Component
 * Main board container with lists and drag-drop functionality
 * Following Single Responsibility - orchestrates board-level operations
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  Board as BoardType,
  Card as CardType,
  List as ListType,
} from "@/types";
import { useBoard } from "@/hooks";
import { EditableTitle, AddForm, ClientOnly } from "@/components/common";
import List from "@/components/List";
import Card from "@/components/Card";
import CardModal from "@/components/CardModal";
import styles from "./Board.module.scss";

// Type for active drag item
interface ActiveDragItem {
  type: "list" | "card";
  item: ListType | CardType;
  listId?: string;
}

export default function Board() {
  const {
    board,
    updateBoardTitle,
    addList,
    updateListTitle,
    deleteList,
    deleteAllCards,
    reorderLists,
    addCard,
    updateCardTitle,
    moveCard,
    reorderCards,
    addComment,
  } = useBoard();

  // State for drag overlay
  const [activeItem, setActiveItem] = useState<ActiveDragItem | null>(null);

  // State for add list form
  const [isAddingList, setIsAddingList] = useState(false);

  // State for card modal
  const [modalCard, setModalCard] = useState<{
    card: CardType;
    listId: string;
  } | null>(null);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get list IDs for sortable context
  const listIds = useMemo(
    () => board.lists.map((list) => list.id),
    [board.lists]
  );

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === "list") {
      setActiveItem({ type: "list", item: activeData.list });
    } else if (activeData?.type === "card") {
      setActiveItem({
        type: "card",
        item: activeData.card,
        listId: activeData.listId,
      });
    }
  }, []);

  // Handle drag over (for moving cards between lists)
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over) return;

      const activeData = active.data.current;
      const overData = over.data.current;

      // Only handle card movements
      if (activeData?.type !== "card") return;

      const activeListId = activeData.listId;
      let overListId = overData?.listId || overData?.list?.id;

      // If over a list container, use that list's ID
      if (overData?.type === "list") {
        overListId = overData.list.id;
      }

      if (!overListId || activeListId === overListId) return;

      // Get source and destination lists
      const sourceList = board.lists.find((l) => l.id === activeListId);
      const destList = board.lists.find((l) => l.id === overListId);

      if (!sourceList || !destList) return;

      const activeIndex = sourceList.cards.findIndex((c) => c.id === active.id);

      if (activeIndex === -1) return;

      // Determine destination index
      let destIndex = destList.cards.length;

      if (overData?.type === "card") {
        const overIndex = destList.cards.findIndex((c) => c.id === over.id);
        if (overIndex !== -1) {
          destIndex = overIndex;
        }
      }

      // Move the card
      moveCard(activeListId, overListId, activeIndex, destIndex);

      // Update active item's listId
      setActiveItem((prev) => (prev ? { ...prev, listId: overListId } : null));
    },
    [board.lists, moveCard]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveItem(null);

      if (!over) return;

      const activeData = active.data.current;
      const overData = over.data.current;

      // Handle list reordering
      if (activeData?.type === "list" && overData?.type === "list") {
        if (active.id !== over.id) {
          const oldIndex = board.lists.findIndex((l) => l.id === active.id);
          const newIndex = board.lists.findIndex((l) => l.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1) {
            reorderLists(oldIndex, newIndex);
          }
        }
        return;
      }

      // Handle card reordering within same list
      if (activeData?.type === "card") {
        const activeListId = activeData.listId;
        const overListId = overData?.listId || overData?.list?.id;

        // If cards are in the same list
        if (activeListId === overListId) {
          const list = board.lists.find((l) => l.id === activeListId);
          if (list) {
            const oldIndex = list.cards.findIndex((c) => c.id === active.id);
            const newIndex = list.cards.findIndex((c) => c.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
              reorderCards(activeListId, oldIndex, newIndex);
            }
          }
        }
      }
    },
    [board.lists, reorderLists, reorderCards]
  );

  // Handle adding a new list
  const handleAddList = (title: string) => {
    addList(title);
    setIsAddingList(false);
  };

  // Handle opening card modal
  const handleOpenCardModal = (card: CardType, listId: string) => {
    setModalCard({ card, listId });
  };

  // Handle closing card modal
  const handleCloseCardModal = () => {
    setModalCard(null);
  };

  // Handle updating card title from modal
  const handleUpdateCardTitle = (cardId: string, title: string) => {
    if (modalCard) {
      updateCardTitle(modalCard.listId, cardId, title);
    }
  };

  // Handle adding comment from modal
  const handleAddComment = (cardId: string, text: string) => {
    if (modalCard) {
      addComment(modalCard.listId, cardId, text);
    }
  };

  // Get current card for modal (with updated data from board state)
  const currentModalCard = useMemo(() => {
    if (!modalCard) return null;
    const list = board.lists.find((l) => l.id === modalCard.listId);
    const card = list?.cards.find((c) => c.id === modalCard.card.id);
    return card || null;
  }, [board.lists, modalCard]);

  return (
    <div className={styles.board}>
      {/* Board Header */}
      <header className={styles.header}>
        <EditableTitle
          value={board.title}
          onSave={updateBoardTitle}
          tag="h1"
          className={styles.boardTitle}
          placeholder="Enter board name..."
        />
      </header>

      {/* Lists Container - Wrapped in ClientOnly to prevent DnD hydration issues */}
      <ClientOnly
        fallback={
          <div className={styles.listsContainer}>
            <div className={styles.loadingPlaceholder}>Loading board...</div>
          </div>
        }
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className={styles.listsContainer}>
            <SortableContext
              items={listIds}
              strategy={horizontalListSortingStrategy}
            >
              {board.lists.map((list) => (
                <List
                  key={list.id}
                  list={list}
                  onUpdateTitle={updateListTitle}
                  onDeleteList={deleteList}
                  onDeleteAllCards={deleteAllCards}
                  onAddCard={addCard}
                  onOpenCardModal={handleOpenCardModal}
                />
              ))}
            </SortableContext>

            {/* Add List Section */}
            <div className={styles.addListContainer}>
              {isAddingList ? (
                <div className={styles.addListForm}>
                  <AddForm
                    onAdd={handleAddList}
                    onCancel={() => setIsAddingList(false)}
                    placeholder="Enter list title..."
                    buttonText="Add List"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingList(true)}
                  className={styles.addListButton}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                  Add another list
                </button>
              )}
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeItem?.type === "card" && (
              <div className={styles.dragOverlay}>
                <Card
                  card={activeItem.item as CardType}
                  listId={activeItem.listId || ""}
                  onOpenModal={() => {}}
                />
              </div>
            )}
            {activeItem?.type === "list" && (
              <div className={`${styles.dragOverlay} ${styles.listOverlay}`}>
                <List
                  list={activeItem.item as ListType}
                  onUpdateTitle={() => {}}
                  onDeleteList={() => {}}
                  onDeleteAllCards={() => {}}
                  onAddCard={() => {}}
                  onOpenCardModal={() => {}}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </ClientOnly>

      {/* Card Modal */}
      <CardModal
        isOpen={!!modalCard}
        onClose={handleCloseCardModal}
        card={currentModalCard}
        listId={modalCard?.listId || ""}
        onUpdateTitle={handleUpdateCardTitle}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
