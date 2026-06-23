"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type EvidenceVisibilityContextValue = {
  showEvidence: boolean;
  setShowEvidence: (show: boolean) => void;
  toggleEvidence: () => void;
};

const EvidenceVisibilityContext =
  createContext<EvidenceVisibilityContextValue | null>(null);

export function EvidenceVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showEvidence, setShowEvidence] = useState(false);

  const toggleEvidence = useCallback(() => {
    setShowEvidence((current) => !current);
  }, []);

  const value = useMemo(
    () => ({ showEvidence, setShowEvidence, toggleEvidence }),
    [showEvidence, toggleEvidence],
  );

  return (
    <EvidenceVisibilityContext.Provider value={value}>
      {children}
    </EvidenceVisibilityContext.Provider>
  );
}

export function useEvidenceVisibility() {
  const context = useContext(EvidenceVisibilityContext);
  if (!context) {
    throw new Error(
      "useEvidenceVisibility must be used within EvidenceVisibilityProvider",
    );
  }
  return context;
}

export function EvidenceToggle() {
  const { showEvidence, toggleEvidence } = useEvidenceVisibility();

  return (
    <button
      type="button"
      onClick={toggleEvidence}
      aria-pressed={showEvidence}
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-900"
    >
      {showEvidence ? "Hide evidence" : "Show evidence"}
    </button>
  );
}
