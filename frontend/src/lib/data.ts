/**
 * Data-loading utilities.
 *
 * All data is sourced from JSON files served from the `/data/` public path.
 * Each helper returns a typed Promise and throws on non-OK HTTP responses.
 */

import type { Alert, Contract, Organization, Stats } from '@/types';

const BASE = '/data';

/**
 * Fetches a JSON file from the public /data directory and returns it typed.
 * Throws an Error if the response is not successful.
 */
async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}/${path}`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${path}: ${response.status} ${response.statusText}`,
    );
  }
  return response.json() as Promise<T>;
}

/** Fetch all contracts. */
export async function fetchContracts(): Promise<Contract[]> {
  return fetchJson<Contract[]>('contracts.json');
}

/** Fetch a single contract by ID, or null if not found. */
export async function fetchContract(id: string): Promise<Contract | null> {
  const contracts = await fetchContracts();
  return contracts.find((c) => c.id === id) ?? null;
}

/** Fetch all alerts. */
export async function fetchAlerts(): Promise<Alert[]> {
  return fetchJson<Alert[]>('alerts.json');
}

/** Fetch alerts for a specific contract. */
export async function fetchAlertsForContract(
  contractId: string,
): Promise<Alert[]> {
  const alerts = await fetchAlerts();
  return alerts.filter((a) => a.contractId === contractId);
}

/** Fetch all organisations. */
export async function fetchOrganizations(): Promise<Organization[]> {
  return fetchJson<Organization[]>('organizations.json');
}

/** Fetch a single organisation by ID, or null if not found. */
export async function fetchOrganization(
  id: string,
): Promise<Organization | null> {
  const orgs = await fetchOrganizations();
  return orgs.find((o) => o.id === id) ?? null;
}

/** Fetch platform-level statistics. */
export async function fetchStats(): Promise<Stats> {
  return fetchJson<Stats>('stats.json');
}
