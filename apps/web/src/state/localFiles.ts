import { useCallback, useEffect, useState } from "react";

/*
 * PDF del Master tenuti nel browser (IndexedDB): non vanno online e restano solo su questo dispositivo.
 * Se il browser non lascia usare lo spazio (finestra anonima, dati bloccati) l'elenco resta vuoto e lo si dice.
 */

export interface LocalFile {
  id: string;
  campaignId: string;
  title: string;
  name: string;
  size: number;
  addedAt: number;
  blob: Blob;
  /** Testo di ogni pagina, estratto la prima volta che si cerca nel file. */
  pages?: string[];
}

const DB = "brock-dnd-files";
const STORE = "files";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" }).createIndex("campaign", "campaignId");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  try {
    return await new Promise<T>((resolve, reject) => {
      const req = work(db.transaction(STORE, mode).objectStore(STORE));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}

export const listLocalFiles = (campaignId: string) => run<LocalFile[]>("readonly", (s) => s.index("campaign").getAll(campaignId));
export const removeLocalFile = (id: string) => run("readwrite", (s) => s.delete(id));
export const saveLocalFile = (file: LocalFile) => run("readwrite", (s) => s.put(file));
export async function addLocalFile(campaignId: string, file: File): Promise<LocalFile> {
  const entry: LocalFile = { id: `${campaignId}-${Date.now().toString(36)}`, campaignId, title: file.name.replace(/\.pdf$/i, ""), name: file.name, size: file.size, addedAt: Date.now(), blob: file };
  await run("readwrite", (s) => s.put(entry));
  return entry;
}

/** I PDF di questa campagna salvati nel browser, con le operazioni per aggiungerli e toglierli. */
export function useLocalFiles(campaignId: string) {
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [unavailable, setUnavailable] = useState(false);
  const refresh = useCallback(() => {
    listLocalFiles(campaignId)
      .then((list) => setFiles(list.sort((a, b) => a.addedAt - b.addedAt)))
      .catch(() => setUnavailable(true));
  }, [campaignId]);
  useEffect(refresh, [refresh]);
  return {
    files,
    unavailable,
    add: async (file: File) => {
      await addLocalFile(campaignId, file);
      refresh();
    },
    remove: async (id: string) => {
      await removeLocalFile(id);
      refresh();
    },
    /** Salva il testo estratto, per non doverlo rifare. */
    setPages: async (file: LocalFile, pages: string[]) => {
      await saveLocalFile({ ...file, pages });
      refresh();
    },
  };
}
