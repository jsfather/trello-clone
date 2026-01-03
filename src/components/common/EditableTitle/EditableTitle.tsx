/**
 * EditableTitle Component
 * Inline editable title with click-to-edit functionality
 * Following Single Responsibility - only handles title editing
 */

"use client";

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { isEmptyString } from "@/utils/helpers";
import styles from "./EditableTitle.module.scss";

interface EditableTitleProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "span";
  placeholder?: string;
  maxLength?: number;
}

export default function EditableTitle({
  value,
  onSave,
  className = "",
  tag = "span",
  placeholder = "Enter title...",
  maxLength = 100,
}: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local state when prop changes
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (!isEmptyString(trimmedValue) && trimmedValue !== value) {
      onSave(trimmedValue);
    } else {
      setEditValue(value); // Reset to original if empty
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleBlur = () => {
    handleSave();
  };

  // Render title tag
  const Tag = tag;

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`${styles.input} ${className}`}
        aria-label="Edit title"
      />
    );
  }

  return (
    <Tag
      onClick={handleStartEdit}
      className={`${styles.title} ${className}`}
      title="Click to edit"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleStartEdit();
        }
      }}
    >
      {value || placeholder}
    </Tag>
  );
}
