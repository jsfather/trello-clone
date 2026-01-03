# Trello Clone - Project Instructions

## 📋 Project Overview

A Trello-like Kanban board application built with Next.js, TypeScript, and SCSS. This document serves as a living documentation that tracks all implemented features, architecture decisions, and development guidelines.

**Package Manager**: bun

---

## 🎯 Project Goals

- **Board Management**: Display a fixed board with editable title
- **List Management**: Create, delete, edit titles, and drag & drop lists
- **Card Management**: Create cards, edit titles, drag & drop between lists
- **Comments Modal**: Manage comments for each card (add and view in dedicated modal)
- **Responsive Design**: Desktop-first with mobile support
- **Data Persistence**: All data stored in localStorage

---

## 🛠️ Technology Stack

| Technology       | Purpose                                  |
| ---------------- | ---------------------------------------- |
| **Next.js 16**   | React framework with App Router          |
| **TypeScript**   | Type safety and better DX                |
| **SCSS**         | Styling with variables, mixins, partials |
| **@dnd-kit**     | Drag and drop functionality              |
| **localStorage** | Client-side data persistence             |
| **bun**          | Package manager                          |

---

## 📁 Project Structure

```
trello-clone/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main board page
├── src/
│   ├── components/          # React components
│   │   ├── Board/           # Board component
│   │   ├── List/            # List component
│   │   ├── Card/            # Card component
│   │   ├── CardModal/       # Card modal component
│   │   └── common/          # Shared components
│   │       ├── EditableTitle/
│   │       ├── AddForm/
│   │       └── Modal/
│   ├── hooks/               # Custom React hooks
│   │   ├── useBoard.ts      # Board state management
│   │   └── useLocalStorage.ts # localStorage sync
│   ├── services/            # Business logic services
│   │   └── storage.service.ts # localStorage operations
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts         # All type definitions
│   ├── styles/              # SCSS styles
│   │   ├── _variables.scss  # Colors, fonts, sizes
│   │   ├── _mixins.scss     # Reusable mixins
│   │   ├── _reset.scss      # CSS reset
│   │   └── main.scss        # Main style entry point
│   ├── utils/               # Utility functions
│   │   └── helpers.ts       # Helper functions
│   └── constants/           # Application constants
│       └── index.ts         # Initial data, keys
├── INSTRUCTIONS.md          # This file
└── README.md                # Project documentation
```

---

## 🔧 Architecture Decisions

### State Management

- Using React's built-in `useState` and custom hooks for state management
- `useBoard` hook encapsulates all board operations
- `useLocalStorage` hook syncs state with localStorage
- No external state management library needed

### Data Flow

```
localStorage ←→ useLocalStorage hook ←→ useBoard hook ←→ Components
```

### Component Design

- **Smart/Container Components**: Handle logic and state (Board)
- **Presentational Components**: Focus on UI rendering (Card, List)
- **Custom Hooks**: Encapsulate reusable logic

### SOLID Principles Applied

1. **Single Responsibility**: Each component has one purpose
2. **Open/Closed**: Components extensible via props
3. **Liskov Substitution**: Consistent component interfaces
4. **Interface Segregation**: Focused prop interfaces
5. **Dependency Inversion**: Hooks abstract storage details

---

## ✅ Implemented Features

### Phase 1: Foundation ✅

- [x] Project structure setup
- [x] TypeScript types defined
- [x] SCSS foundation (variables, mixins)
- [x] localStorage service
- [x] Custom hooks (useBoard, useLocalStorage)

### Phase 2: Core Components ✅

- [x] Board component with editable title
- [x] List component with CRUD
- [x] Card component with CRUD
- [x] Add list/card forms

### Phase 3: Advanced Features ✅

- [x] Drag & Drop for lists (horizontal)
- [x] Drag & Drop for cards (within and between lists)
- [x] Comments modal
- [x] Responsive design

---

## 📝 Development Log

### Entry 3 - DnD Hydration Fix (Jan 2, 2026)

- Fixed @dnd-kit hydration mismatch (`aria-describedby` IDs differed on server/client)
- Created `ClientOnly` component to wrap DnD context
- DndContext now only renders on client after hydration
- Added loading placeholder for SSR fallback

### Entry 2 - Hydration Fix (Jan 2, 2026)

- Fixed SSR hydration mismatch error in `useLocalStorage` hook
- Problem: Server rendered with DEFAULT_BOARD but client read different data from localStorage
- Solution: Always initialize state with `initialValue`, then sync with localStorage in `useEffect` (client-side only)
- Added `isHydrated` flag to prevent writing to localStorage before reading

### Entry 1 - Initial Setup (Jan 2, 2026)

- Created project structure with src folder
- Defined TypeScript interfaces for Board, List, Card, Comment
- Set up SCSS foundation with variables, mixins, reset
- Created localStorage service with type safety
- Built custom hooks for state management
- Implemented all core components:
  - Board with editable title
  - List with CRUD operations
  - Card with drag support
  - CardModal for comments
  - Common components (EditableTitle, AddForm, Modal, ClientOnly)
- Integrated @dnd-kit for drag and drop
- Added responsive styles

---

## 🎨 Design System

### Colors (defined in \_variables.scss)

- Primary: `#0079bf` (Trello blue)
- Background: `#0079bf` (Board background)
- List Background: `#ebecf0`
- Card Background: `#ffffff`
- Text Primary: `#172b4d`
- Text Secondary: `#5e6c84`

### Typography

- Font Family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Base Size: `14px`
- Headings: `16px - 20px`

### Spacing

- Base Unit: `8px`
- Component Padding: `8px - 16px`
- Gap between lists: `8px`

---

## 🔄 Data Models

### Board

```typescript
interface Board {
  id: string;
  title: string;
  lists: List[];
  createdAt: string;
  updatedAt: string;
}
```

### List

```typescript
interface List {
  id: string;
  title: string;
  cards: Card[];
}
```

### Card

```typescript
interface Card {
  id: string;
  title: string;
  description?: string;
  comments: Comment[];
  createdAt: string;
}
```

### Comment

```typescript
interface Comment {
  id: string;
  text: string;
  createdAt: string;
}
```

---

## 🚀 How to Run

```bash
# Install dependencies
bun install

# Run development server
bun dev

# Build for production
bun run build

# Start production server
bun start
```

---

## 📌 Important Notes

1. All data is stored in localStorage - no backend needed
2. Drag & drop uses @dnd-kit library
3. SCSS only - no CSS-in-JS or Tailwind for main styling
4. TypeScript strict mode enabled
5. App Router (not Pages Router)
6. Package manager: bun (NOT npm or yarn)

---

_Last Updated: January 2, 2026_
