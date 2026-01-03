/**
 * AddForm Component
 * Reusable form for adding new items (lists, cards)
 * Following Single Responsibility - only handles add form logic
 */

"use client";

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { isEmptyString } from "@/utils/helpers";
import styles from "./AddForm.module.scss";

interface AddFormProps {
  onAdd: (value: string) => void;
  onCancel?: () => void;
  placeholder: string;
  buttonText: string;
  className?: string;
  autoFocus?: boolean;
  isTextarea?: boolean;
}

export default function AddForm({
  onAdd,
  onCancel,
  placeholder,
  buttonText,
  className = "",
  autoFocus = true,
  isTextarea = false,
}: AddFormProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    const trimmedValue = value.trim();
    if (!isEmptyString(trimmedValue)) {
      onAdd(trimmedValue);
      setValue("");
    }
  };

  const handleCancel = () => {
    setValue("");
    onCancel?.();
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);
  };

  const InputComponent = isTextarea ? "textarea" : "input";

  return (
    <div className={`${styles.container} ${className}`}>
      <InputComponent
        ref={inputRef as never}
        type={isTextarea ? undefined : "text"}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`${styles.input} ${isTextarea ? styles.textarea : ""}`}
        aria-label={placeholder}
      />
      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleSubmit}
          className={styles.addButton}
          disabled={isEmptyString(value.trim())}
        >
          {buttonText}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className={styles.cancelButton}
          aria-label="Cancel"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
