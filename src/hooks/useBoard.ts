/**
 * useBoard Hook
 * Central state management for the Trello board
 * Following Single Responsibility - handles only board state operations
 */

"use client";

import { useCallback, useMemo } from "react";
import { Board, List, Card, Comment } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { DEFAULT_BOARD, STORAGE_KEYS } from "@/constants";
import { generateId, getCurrentTimestamp, reorderArray } from "@/utils/helpers";

export interface UseBoardReturn {
  // State
  board: Board;

  // Board operations
  updateBoardTitle: (title: string) => void;
  resetBoard: () => void;

  // List operations
  addList: (title: string) => void;
  updateListTitle: (listId: string, title: string) => void;
  deleteList: (listId: string) => void;
  deleteAllCards: (listId: string) => void;
  reorderLists: (startIndex: number, endIndex: number) => void;

  // Card operations
  addCard: (listId: string, title: string) => void;
  updateCardTitle: (listId: string, cardId: string, title: string) => void;
  deleteCard: (listId: string, cardId: string) => void;
  moveCard: (
    sourceListId: string,
    destListId: string,
    sourceIndex: number,
    destIndex: number
  ) => void;
  reorderCards: (listId: string, startIndex: number, endIndex: number) => void;

  // Comment operations
  addComment: (listId: string, cardId: string, text: string) => void;

  // Helpers
  getCard: (listId: string, cardId: string) => Card | undefined;
  getList: (listId: string) => List | undefined;
}

export function useBoard(): UseBoardReturn {
  const [board, setBoard] = useLocalStorage<Board>(
    STORAGE_KEYS.BOARD,
    DEFAULT_BOARD
  );

  // =========================================================================
  // Board Operations
  // =========================================================================

  const updateBoardTitle = useCallback(
    (title: string) => {
      setBoard((prev) => ({
        ...prev,
        title,
        updatedAt: getCurrentTimestamp(),
      }));
    },
    [setBoard]
  );

  const resetBoard = useCallback(() => {
    setBoard(DEFAULT_BOARD);
  }, [setBoard]);

  // =========================================================================
  // List Operations
  // =========================================================================

  const addList = useCallback(
    (title: string) => {
      const newList: List = {
        id: generateId("list"),
        title,
        cards: [],
      };

      setBoard((prev) => ({
        ...prev,
        lists: [...prev.lists, newList],
        updatedAt: getCurrentTimestamp(),
      }));
    },
    [setBoard]
  );

  const updateListTitle = useCallback(
    (listId: string, title: string) => {
      setBoard((prev) => ({
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId ? { ...list, title } : list
        ),
        updatedAt: getCurrentTimestamp(),
      }));
    },
    [setBoard]
  );

  const deleteList = useCallback(
    (listId: string) => {
      setBoard((prev) => ({
        ...prev,
        lists: prev.lists.filter((list) => list.id !== listId),
        updatedAt: getCurrentTimestamp(),
      }));
    },
    [setBoard]
  );

  const deleteAllCards = useCallback(
    (listId: string) => {
      setBoard((prev) => ({
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId ? { ...list, cards: [] } : list
        ),
        updatedAt: getCurrentTimestamp(),
      }));
    },
    [setBoard]
  );

  const reorderLists = useCallback(
    (startIndex: number, endIndex: number) => {
      setBoard((prev) => ({
        ...prev,
        lists: reorderArray(prev.lists, startIndex, endIndex),
        updatedAt: getCurrentTimestamp(),
      }));
    },
    [setBoard]
  );

  // =========================================================================
  // Card Operations
  // =========================================================================

  const addCard = useCallback(
    (listId: string, title: string) => {
      const newCard: Card = {
        id: generateId("card"),
        title,
        comments: [],
        createdAt: getCurrentTimestamp(),
      };

      setBoard((prev) => ({
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        ),
        updatedAt: getCurrentTimestamp(),
      }));
    },
    [setBoard]
  );

  const updateCardTitle = useCallback(
    (listId: string, cardId: string, title: string) => {
      setBoard((prev) => ({
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId
            ? {
                ...list,
                cards: list.cards.map((card) =>
                  card.id === cardId ? { ...card, title } : card
                ),
              }
            : list
        ),
        updatedAt: getCurrentTimestamp(),
      }));
    },
    [setBoard]
  );

  const deleteCard = useCallback(
    (listId: string, cardId: string) => {
      setBoard((prev) => ({
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId
            ? {
                ...list,
                cards: list.cards.filter((card) => card.id !== cardId),
              }
            : list
        ),
        updatedAt: getCurrentTimestamp(),
      }));
    },
    [setBoard]
  );

  const reorderCards = useCallback(
    (listId: string, startIndex: number, endIndex: number) => {
      setBoard((prev) => ({
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId
            ? { ...list, cards: reorderArray(list.cards, startIndex, endIndex) }
            : list
        ),
        updatedAt: getCurrentTimestamp(),
      }));
    },
    [setBoard]
  );

  const moveCard = useCallback(
    (
      sourceListId: string,
      destListId: string,
      sourceIndex: number,
      destIndex: number
    ) => {
      setBoard((prev) => {
        const sourceList = prev.lists.find((l) => l.id === sourceListId);
        const destList = prev.lists.find((l) => l.id === destListId);

        if (!sourceList || !destList) return prev;

        const sourceCards = [...sourceList.cards];
        const destCards =
          sourceListId === destListId ? sourceCards : [...destList.cards];

        const [movedCard] = sourceCards.splice(sourceIndex, 1);

        if (sourceListId === destListId) {
          sourceCards.splice(destIndex, 0, movedCard);
        } else {
          destCards.splice(destIndex, 0, movedCard);
        }

        return {
          ...prev,
          lists: prev.lists.map((list) => {
            if (list.id === sourceListId) {
              return { ...list, cards: sourceCards };
            }
            if (list.id === destListId && sourceListId !== destListId) {
              return { ...list, cards: destCards };
            }
            return list;
          }),
          updatedAt: getCurrentTimestamp(),
        };
      });
    },
    [setBoard]
  );

  // =========================================================================
  // Comment Operations
  // =========================================================================

  const addComment = useCallback(
    (listId: string, cardId: string, text: string) => {
      const newComment: Comment = {
        id: generateId("comment"),
        text,
        createdAt: getCurrentTimestamp(),
      };

      setBoard((prev) => ({
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId
            ? {
                ...list,
                cards: list.cards.map((card) =>
                  card.id === cardId
                    ? { ...card, comments: [...card.comments, newComment] }
                    : card
                ),
              }
            : list
        ),
        updatedAt: getCurrentTimestamp(),
      }));
    },
    [setBoard]
  );

  // =========================================================================
  // Helper Functions
  // =========================================================================

  const getCard = useCallback(
    (listId: string, cardId: string): Card | undefined => {
      const list = board.lists.find((l) => l.id === listId);
      return list?.cards.find((c) => c.id === cardId);
    },
    [board.lists]
  );

  const getList = useCallback(
    (listId: string): List | undefined => {
      return board.lists.find((l) => l.id === listId);
    },
    [board.lists]
  );

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      board,
      updateBoardTitle,
      resetBoard,
      addList,
      updateListTitle,
      deleteList,
      deleteAllCards,
      reorderLists,
      addCard,
      updateCardTitle,
      deleteCard,
      moveCard,
      reorderCards,
      addComment,
      getCard,
      getList,
    }),
    [
      board,
      updateBoardTitle,
      resetBoard,
      addList,
      updateListTitle,
      deleteList,
      deleteAllCards,
      reorderLists,
      addCard,
      updateCardTitle,
      deleteCard,
      moveCard,
      reorderCards,
      addComment,
      getCard,
      getList,
    ]
  );
}

export default useBoard;
