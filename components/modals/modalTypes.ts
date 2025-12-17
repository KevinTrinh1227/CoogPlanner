// components/modals/modalTypes.ts
"use client";

export type ModalSlug =
  | "course-more-info"
  | "course-syllabi-list"
  | "enrollment-help";

export interface BaseModalProps {
  onClose: () => void;
}
