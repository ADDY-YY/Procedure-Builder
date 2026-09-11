import { currentSchemaVersion, type BuilderDocument } from './model';

const databaseName = 'procedure-builder';
const storeName = 'drafts';
const legacyStorageKey = 'procedure-builder.drafts.v1';
const recoveryStorageKey = 'procedure-builder.recovery.v1';

function request<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Browser storage failed.'));
  });
}

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const openRequest = indexedDB.open(databaseName, 1);
    openRequest.onupgradeneeded = () => {
      if (!openRequest.result.objectStoreNames.contains(storeName)) {
        openRequest.result.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
    openRequest.onsuccess = () => resolve(openRequest.result);
    openRequest.onerror = () => reject(openRequest.error ?? new Error('Could not open browser storage.'));
  });
}

function isDraft(value: unknown): value is BuilderDocument {
  return Boolean(value) && typeof value === 'object' &&
    typeof (value as BuilderDocument).id === 'string' &&
    Array.isArray((value as BuilderDocument).procedures) &&
    Boolean((value as BuilderDocument).fields);
}

function normalizeDraft(draft: BuilderDocument): BuilderDocument {
  const procedures = draft.type === 'how-to' ? draft.procedures.map(section => ({ ...section, template: 'how-to' as const })) : draft.procedures;
  const legacyDate = /^\d{4}-\d{2}-\d{2}$/.test(draft.owner) ? draft.owner : '';
  return { ...draft, title: draft.title.replace(/[<>]/g,''), owner: legacyDate ? '' : draft.owner, effectiveDate: legacyDate || draft.effectiveDate, procedures, schemaVersion: draft.schemaVersion ?? currentSchemaVersion };
}

async function migrateLegacyDrafts(database: IDBDatabase) {
  const raw = localStorage.getItem(legacyStorageKey);
  if (!raw) return;
  let legacy: unknown;
  try { legacy = JSON.parse(raw); } catch {
    localStorage.removeItem(legacyStorageKey);
    return;
  }
  if (!Array.isArray(legacy) || legacy.some((draft) => !isDraft(draft))) {
    throw new Error('Existing browser drafts could not be migrated. They were left unchanged.');
  }
  const transaction = database.transaction(storeName, 'readwrite');
  legacy.forEach((draft) => transaction.objectStore(storeName).put(draft));
  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Draft migration failed.'));
  });
  localStorage.removeItem(legacyStorageKey);
}

export const draftRepository = {
  async load(): Promise<BuilderDocument[]> {
    const database = await openDatabase();
    try {
      await migrateLegacyDrafts(database);
      const transaction = database.transaction(storeName, 'readonly');
      const drafts = await request(transaction.objectStore(storeName).getAll());
      if (drafts.some((draft) => !isDraft(draft))) throw new Error('A saved draft has an unsupported format.');
      return drafts.map(normalizeDraft).sort((a, b) => b.modified.localeCompare(a.modified));
    } finally {
      database.close();
    }
  },
  async save(drafts: BuilderDocument[]) {
    const database = await openDatabase();
    try {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const existing = await request(store.getAllKeys());
      const nextIds = new Set(drafts.map((draft) => draft.id));
      existing.forEach((id) => { if (!nextIds.has(String(id))) store.delete(id); });
      drafts.forEach((draft) => store.put(draft));
      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error ?? new Error('Draft save failed.'));
      });
    } finally {
      database.close();
    }
  },
  writeRecovery(draft: BuilderDocument) { sessionStorage.setItem(recoveryStorageKey, JSON.stringify(draft)); },
  readRecovery(): BuilderDocument | null {
    const raw = sessionStorage.getItem(recoveryStorageKey);
    if (!raw) return null;
    try { const draft: unknown = JSON.parse(raw); return isDraft(draft) ? normalizeDraft(draft) : null; } catch { return null; }
  },
  clearRecovery() { sessionStorage.removeItem(recoveryStorageKey); },
};
