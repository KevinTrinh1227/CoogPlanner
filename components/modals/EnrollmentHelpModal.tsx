// components/modals/EnrollmentHelpModal.tsx
"use client";

import React from "react";
import ModalShell from "./ModalShell";
import type { BaseModalProps } from "./modalTypes";

export default function EnrollmentHelpModal({ onClose }: BaseModalProps) {
  return (
    <ModalShell onClose={onClose} ariaLabel="Enrollment help">
      <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
        Enrollment Help
      </h2>
      <p className="mt-2 text-sm text-slate-200">
        Explain how to use CoogPlanner for enrollment, key dates, and tips for
        building the best schedule.
      </p>
      <p className="mt-3 text-xs text-slate-400">
        Opened via <code>?modal=enrollment-help</code>.
      </p>
    </ModalShell>
  );
}
