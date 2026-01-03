/**
 * Core type definitions for the Trello Clone application
 * Following Interface Segregation Principle - small, focused interfaces
 */

// ============================================================================
// Comment Types
// ============================================================================

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

// ============================================================================
// Card Types
// ============================================================================

export interface Card {
  id: string;
  title: string;
  description?: string;
  comments: Comment[];
  createdAt: string;
}

export interface CardCreateInput {
  title: string;
  listId: string;
}

export interface CardUpdateInput {
  id: string;
  title?: string;
  description?: string;
}

// ============================================================================
// List Types
// ============================================================================

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export interface ListCreateInput {
  title: string;
}

export interface ListUpdateInput {
  id: string;
  title: string;
}

// ============================================================================
// Board Types
// ============================================================================

export interface Board {
  id: string;
  title: string;
  lists: List[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardUpdateInput {
  title: string;
}

// ============================================================================
// Drag & Drop Types
// ============================================================================

export type DragItemType = "list" | "card";

export interface DragResult {
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
  draggableId: string;
  type: DragItemType;
}

// ============================================================================
// Modal Types
// ============================================================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CardModalProps extends ModalProps {
  card: Card | null;
  onAddComment: (cardId: string, text: string) => void;
  onUpdateCard: (cardId: string, updates: CardUpdateInput) => void;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface EditableTitleProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "span";
  placeholder?: string;
}

export interface AddFormProps {
  onAdd: (value: string) => void;
  placeholder: string;
  buttonText: string;
  className?: string;
}
