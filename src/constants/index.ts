/**
 * Application constants
 * Centralized configuration values
 */

import { Board } from "@/types";

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  BOARD: "trello-clone-board",
} as const;

// ============================================================================
// Default Data
// ============================================================================

export const DEFAULT_BOARD: Board = {
  id: "board-1",
  title: "Demo Board",
  lists: [
    {
      id: "list-1",
      title: "Todo",
      cards: [
        {
          id: "card-1",
          title: "Create interview Kanban",
          comments: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: "card-2",
          title: "Review Drag & Drop",
          comments: [],
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "list-2",
      title: "In Progress",
      cards: [
        {
          id: "card-3",
          title: "Set up Next.js project",
          comments: [],
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "list-3",
      title: "Done",
      cards: [],
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ============================================================================
// UI Constants
// ============================================================================

export const UI = {
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  MAX_TITLE_LENGTH: 100,
  MAX_COMMENT_LENGTH: 500,
} as const;
