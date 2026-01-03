# Trello Clone

A Trello-like Kanban board application built with Next.js, TypeScript, and SCSS. This project demonstrates clean code practices, SOLID principles, and modern React patterns.

![Trello Clone](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![SCSS](https://img.shields.io/badge/SCSS-Styling-pink)

## ✨ Features

- **Board Management**: Display a board with editable title
- **List Management**: Create, delete, edit titles, and drag & drop lists
- **Card Management**: Create cards, edit titles, drag & drop between lists
- **Comments Modal**: Add and view comments for each card
- **Responsive Design**: Works on desktop and mobile
- **Data Persistence**: All data saved to localStorage

## 🛠️ Technologies Used

| Technology       | Purpose                                  |
| ---------------- | ---------------------------------------- |
| **Next.js 16**   | React framework with App Router          |
| **TypeScript**   | Type safety                              |
| **SCSS**         | Styling with variables, mixins, partials |
| **@dnd-kit**     | Drag and drop functionality              |
| **localStorage** | Client-side data persistence             |
| **bun**          | Package manager                          |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- bun (recommended package manager)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd trello-clone

# Install dependencies
bun install

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

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
│   ├── hooks/               # Custom React hooks
│   ├── services/            # Business logic services
│   ├── types/               # TypeScript interfaces
│   ├── styles/              # SCSS styles
│   ├── utils/               # Utility functions
│   └── constants/           # Application constants
├── INSTRUCTIONS.md          # Project documentation
└── README.md                # This file
```

## 🏗️ Architecture

### State Management

- Custom hooks (`useBoard`, `useLocalStorage`) for state management
- No external state library needed

### SOLID Principles

- **Single Responsibility**: Each component has one purpose
- **Open/Closed**: Components extensible via props
- **Interface Segregation**: Focused TypeScript interfaces
- **Dependency Inversion**: Hooks abstract storage details

### SCSS Organization

- `_variables.scss`: Colors, fonts, spacing
- `_mixins.scss`: Reusable style patterns
- `_reset.scss`: CSS reset
- Component-level `.module.scss` files

## 📝 Available Scripts

```bash
# Development
bun dev

# Build
bun run build

# Production
bun start

# Lint
bun run lint
```

## 🎨 Design

The UI is inspired by Trello with:

- Blue header and background
- Light gray list containers
- White card backgrounds
- Smooth drag and drop interactions

## 📌 Notes

- All data is stored in localStorage (no backend required)
- TypeScript strict mode enabled
- SCSS only (no Tailwind for main styling)
- Responsive design included

## 📄 License

MIT License
