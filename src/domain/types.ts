export type SourceSystem =
  | "salesforce"
  | "gong"
  | "zendesk"
  | "product_analytics";

export type Account = {
  id: string;
  name: string;
  industry: string;
  owner: string;
  segment: "SMB" | "Mid-Market" | "Enterprise";
  createdAt: Date;
  updatedAt: Date;
};

export type Opportunity = {
  id: string;
  accountId: string;
  stage: string;
  amount: number;
  probability: number;
  closeDate: Date;
  daysInStage: number;
  lastActivityAt: Date;
  owner: string;
  sourceSystem: SourceSystem;
  sourceId: string;
  sourceUpdatedAt: Date;
};

export type Call = {
  id: string;
  accountId: string;
  occurredAt: Date;
  owner: string;
  summary: string;
  themes: string[];
  excerpts: string[];
  sentiment: "positive" | "neutral" | "negative";
  sourceSystem: SourceSystem;
  sourceId: string;
  sourceUpdatedAt: Date;
};

export type SupportTicket = {
  id: string;
  accountId: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "open" | "pending" | "solved";
  createdAt: Date;
  summary: string;
  sourceSystem: SourceSystem;
  sourceId: string;
  sourceUpdatedAt: Date;
};

export type HealthSnapshot = {
  id: string;
  accountId: string;
  healthScore: number;
  usageTrend: "up" | "flat" | "down";
  activeUsers: number;
  lastLoginAt: Date;
  sourceSystem: SourceSystem;
  sourceId: string;
  sourceUpdatedAt: Date;
};

export type DataFreshness = {
  oldestSourceUpdatedAt: Date;
  staleSources: string[];
};

export type AccountContext = {
  account: Account;
  opportunity: Opportunity;
  calls: Call[];
  tickets: SupportTicket[];
  health: HealthSnapshot;
  freshness: DataFreshness;
};

export type AccountSummary = {
  id: string;
  name: string;
  industry: string;
  segment: Account["segment"];
  owner: string;
};

export type EvidenceRef = {
  sourceSystem: SourceSystem;
  sourceId: string;
  recordType: "opportunity" | "call" | "ticket" | "health";
  label: string;
};

export type RiskSignal = {
  id: string;
  severity: "low" | "medium" | "high";
  label: string;
  explanation: string;
  evidence: EvidenceRef[];
};
