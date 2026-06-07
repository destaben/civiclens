/** Anomaly type identifiers */
export type AnomalyType =
  | 'split-contract'
  | 'short-tender-window'
  | 'anomalous-pricing'
  | 'sole-source';

/** Contract status */
export type ContractStatus = 'active' | 'awarded' | 'cancelled';

/** Procurement procedure type */
export type ProcedureType = 'open' | 'restricted' | 'negotiated' | 'direct';

/** Award criteria */
export type AwardCriteria = 'lowest-price' | 'best-value';

/** Alert severity level */
export type Severity = 'critical' | 'high' | 'medium' | 'low';

/** Alert status */
export type AlertStatus = 'open' | 'reviewing' | 'resolved';

/** Organisation tier */
export type OrgLevel = 'national' | 'regional' | 'local';

/** Organisation type */
export type OrgType =
  | 'ministry'
  | 'agency'
  | 'municipality'
  | 'regional-department'
  | 'public-body';

/** A public procurement contract */
export interface Contract {
  id: string;
  title: string;
  entity: string;
  amount: number;
  currency: string;
  date: string;
  status: ContractStatus;
  riskScore: number;
  anomalies: AnomalyType[];
  summary: string;
  cpvCode: string;
  procedure: ProcedureType;
  awardCriteria: AwardCriteria;
}

/** An anomaly alert linked to a contract */
export interface Alert {
  id: string;
  contractId: string;
  contractTitle: string;
  type: AnomalyType;
  severity: Severity;
  date: string;
  description: string;
  legalReference: string;
  status: AlertStatus;
}

/** A public-sector organisation */
export interface Organization {
  id: string;
  name: string;
  level: OrgLevel;
  type: OrgType;
  contractCount: number;
  totalSpend: number;
  avgRiskScore: number;
  openAlerts: number;
  description: string;
}

/** Platform-level statistics */
export interface Stats {
  totalContracts: number;
  totalSpend: number;
  openAlerts: number;
  avgRiskScore: number;
  contractsByStatus: Record<ContractStatus, number>;
  alertsBySeverity: Record<Severity, number>;
  topAnomalyTypes: Array<{ type: AnomalyType; count: number }>;
}
