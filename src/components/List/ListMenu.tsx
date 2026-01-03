/**
 * ListMenu Component
 * Three-dot menu with delete options and inline confirmations
 */

"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ListMenu.module.scss";

interface ListMenuProps {
  onDeleteList: () => void;
  onDeleteAllCards: () => void;
  hasCards: boolean;
}

type ConfirmState = "deleteList" | "deleteAllCards" | null;

export default function ListMenu({
  onDeleteList,
  onDeleteAllCards,
  hasCards,
}: ListMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setConfirmState(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    setConfirmState(null);
  };

  const handleDeleteListClick = () => {
    if (confirmState === "deleteList") {
      onDeleteList();
      setIsOpen(false);
      setConfirmState(null);
    } else {
      setConfirmState("deleteList");
    }
  };

  const handleDeleteAllCardsClick = () => {
    if (confirmState === "deleteAllCards") {
      onDeleteAllCards();
      setIsOpen(false);
      setConfirmState(null);
    } else {
      setConfirmState("deleteAllCards");
    }
  };

  const handleCancel = () => {
    setConfirmState(null);
  };

  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <button
        type="button"
        onClick={handleToggleMenu}
        className={styles.menuButton}
        aria-label="List options"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="2" cy="8" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="14" cy="8" r="1.5" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {/* Delete All Cards Option */}
          {confirmState === "deleteAllCards" ? (
            <div className={styles.confirmBox}>
              <p className={styles.confirmText}>
                Delete all cards? This action cannot be undone.
              </p>
              <div className={styles.confirmActions}>
                <button
                  type="button"
                  onClick={handleDeleteAllCardsClick}
                  className={`${styles.confirmButton} ${styles.danger}`}
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={styles.confirmButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDeleteAllCardsClick}
              className={styles.menuItem}
              disabled={!hasCards}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
              </svg>
              Delete all cards
            </button>
          )}

          {/* Separator */}
          {confirmState !== "deleteAllCards" && (
            <div className={styles.separator} />
          )}

          {/* Delete List Option */}
          {confirmState === "deleteList" ? (
            <div className={styles.confirmBox}>
              <p className={styles.confirmText}>
                Delete this list? This will also delete all its cards.
              </p>
              <div className={styles.confirmActions}>
                <button
                  type="button"
                  onClick={handleDeleteListClick}
                  className={`${styles.confirmButton} ${styles.danger}`}
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={styles.confirmButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDeleteListClick}
              className={`${styles.menuItem} ${styles.danger}`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
              </svg>
              Delete list
            </button>
          )}
        </div>
      )}
    </div>
  );
}
