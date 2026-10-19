(function (root) {
  "use strict";

  const DATABASE = "clustercraft-notes";
  const STORE = "notes";
  const FALLBACK_KEY = "clustercraft-notes-v1";
  let databasePromise;

  function readFallback() {
    try {
      const records = JSON.parse(root.localStorage.getItem(FALLBACK_KEY) || "[]");
      return Array.isArray(records) ? records : [];
    } catch (error) {
      console.error("Could not read the local notes backup.", error);
      return [];
    }
  }

  function writeFallback(records) {
    root.localStorage.setItem(FALLBACK_KEY, JSON.stringify(records));
  }

  function openDatabase() {
    if (!root.indexedDB) return Promise.resolve(null);
    if (!databasePromise) {
      databasePromise = new Promise((resolve, reject) => {
        const request = root.indexedDB.open(DATABASE, 1);
        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains(STORE)) {
            request.result.createObjectStore(STORE, { keyPath: "id" });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("IndexedDB could not be opened."));
        request.onblocked = () => reject(new Error("IndexedDB is blocked by another open tab."));
      }).catch((error) => {
        console.error("IndexedDB is unavailable; using the local-storage notes fallback.", error);
        databasePromise = null;
        return null;
      });
    }
    return databasePromise;
  }

  function transaction(database, mode, operation) {
    return new Promise((resolve, reject) => {
      const tx = database.transaction(STORE, mode);
      const store = tx.objectStore(STORE);
      let result;
      try {
        result = operation(store);
      } catch (error) {
        reject(error);
        return;
      }
      tx.oncomplete = () => resolve(result && result.result);
      tx.onerror = () => reject(tx.error || new Error("Notes transaction failed."));
      tx.onabort = () => reject(tx.error || new Error("Notes transaction was aborted."));
    });
  }

  async function load() {
    const database = await openDatabase();
    if (!database) return readFallback();
    try {
      const records = await new Promise((resolve, reject) => {
        const request = database.transaction(STORE, "readonly").objectStore(STORE).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("Notes could not be read."));
      });
      if (records.length) return records;
      const fallback = readFallback();
      if (fallback.length) await saveAll(fallback);
      return fallback;
    } catch (error) {
      console.error("Could not read notes from IndexedDB; trying the local backup.", error);
      return readFallback();
    }
  }

  async function saveAll(records) {
    const normalized = Array.isArray(records) ? records : [];
    let databaseError = null;
    const database = await openDatabase();
    if (database) {
      try {
        await transaction(database, "readwrite", (store) => {
          store.clear();
          normalized.forEach((record) => store.put(record));
        });
      } catch (error) {
        databaseError = error;
        console.error("Could not save notes to IndexedDB.", error);
      }
    }
    try {
      writeFallback(normalized);
      return { backend: database && !databaseError ? "IndexedDB + local backup" : "local storage" };
    } catch (fallbackError) {
      console.error("Could not save the local notes backup.", fallbackError);
      if (database && !databaseError) return { backend: "IndexedDB" };
      throw new Error(`Notes could not be saved. ${fallbackError.message}`);
    }
  }

  async function save(record) {
    const records = await load();
    const index = records.findIndex((item) => item.id === record.id);
    if (index < 0) records.push(record);
    else records[index] = record;
    return saveAll(records);
  }

  async function remove(id) {
    const database = await openDatabase();
    let databaseError = null;
    if (database) {
      try {
        await transaction(database, "readwrite", (store) => store.delete(id));
      } catch (error) {
        databaseError = error;
        console.error("Could not delete a note from IndexedDB.", error);
      }
    }
    try {
      writeFallback(readFallback().filter((record) => record.id !== id));
    } catch (error) {
      console.error("Could not delete a note from the local backup.", error);
      if (!database || databaseError) throw new Error(`The note could not be deleted. ${error.message}`);
    }
  }

  async function clear() {
    return saveAll([]);
  }

  root.CKA_NOTES = { load, save, saveAll, remove, clear, fallbackKey: FALLBACK_KEY };
})(typeof globalThis === "undefined" ? this : globalThis);
