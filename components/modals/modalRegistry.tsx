// components/modals/modalRegistry.tsx
"use client";

import React from "react";
import type { BaseModalProps, ModalSlug } from "./modalTypes";

import CourseMoreInfoModal from "./CourseMoreInfoModal";
import CourseSyllabiListModal from "./CourseSyllabiListModal";
import EnrollmentHelpModal from "./EnrollmentHelpModal";

export type { ModalSlug } from "./modalTypes";

export const modalRegistry: Record<
  ModalSlug,
  React.ComponentType<BaseModalProps>
> = {
  "course-more-info": CourseMoreInfoModal,
  "course-syllabi-list": CourseSyllabiListModal,
  "enrollment-help": EnrollmentHelpModal,
};
