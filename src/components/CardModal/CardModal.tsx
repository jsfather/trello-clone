/**
 * CardModal Component
 * Modal for viewing and adding comments to a card
 * Following Single Responsibility - handles card detail modal
 */

"use client";

import { useState, KeyboardEvent, ChangeEvent } from "react";
import { Card, Comment } from "@/types";
import { Modal, EditableTitle } from "@/components/common";
import { formatDate, isEmptyString } from "@/utils/helpers";
import styles from "./CardModal.module.scss";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card | null;
  listId: string;
  onUpdateTitle: (cardId: string, title: string) => void;
  onAddComment: (cardId: string, text: string) => void;
}

export default function CardModal({
  isOpen,
  onClose,
  card,
  listId,
  onUpdateTitle,
  onAddComment,
}: CardModalProps) {
  const [newComment, setNewComment] = useState("");

  if (!card) return null;

  const handleTitleSave = (newTitle: string) => {
    onUpdateTitle(card.id, newTitle);
  };

  const handleAddComment = () => {
    if (!isEmptyString(newComment.trim())) {
      onAddComment(card.id, newComment.trim());
      setNewComment("");
    }
  };

  const handleCommentKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        {/* Card Title */}
        <div className={styles.titleSection}>
          <svg
            className={styles.icon}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2.5 4A1.5 1.5 0 0 1 4 2.5h12A1.5 1.5 0 0 1 17.5 4v12a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 16V4zM4 3.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5H4z" />
          </svg>
          <EditableTitle
            value={card.title}
            onSave={handleTitleSave}
            tag="h2"
            className={styles.title}
            placeholder="Enter card title..."
          />
        </div>

        {/* Comments Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg
              className={styles.icon}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h11A1.5 1.5 0 0 1 17 4.5v8A1.5 1.5 0 0 1 15.5 14h-4.172a.5.5 0 0 0-.354.146l-2.682 2.682A.5.5 0 0 1 7.5 16.5v-2a.5.5 0 0 0-.5-.5H4.5A1.5 1.5 0 0 1 3 12.5v-8z" />
            </svg>
            <h3 className={styles.sectionTitle}>Comments</h3>
          </div>

          {/* Add Comment Form */}
          <div className={styles.addComment}>
            <textarea
              value={newComment}
              onChange={handleCommentChange}
              onKeyDown={handleCommentKeyDown}
              placeholder="Write a comment..."
              className={styles.commentInput}
              rows={3}
            />
            <button
              type="button"
              onClick={handleAddComment}
              className={styles.addButton}
              disabled={isEmptyString(newComment.trim())}
            >
              Add Comment
            </button>
          </div>

          {/* Comments List */}
          <div className={styles.commentsList}>
            {card.comments.length === 0 ? (
              <p className={styles.noComments}>No comments yet</p>
            ) : (
              card.comments.map((comment: Comment) => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentDate}>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className={styles.commentText}>{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
