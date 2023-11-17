import initialPackingItems from "./db_def";

type GenericType = {
  id: number;
  name: string;
  category_id: number;
  trash: boolean;
};

export type ItemType = {
  id: number;
  name: string;
  category_id: number;
};

export type CategoryType = {
  id: number;
  name: string;
};

export type TripType = {
  id: number;
  name: string;
  trash: boolean;
};

export type TripItemType = {
  id?: number;
  trip_id: number;
  item_id: number;
  active: boolean;
};

export enum TABLES {
  ITEMS = "items",
  CATEGORIES = "categories",
  TRIPS = "trips",
  TRIPS_AND_ITEMS = "trips_and_items",
}

class DataBase {
  static readonly DATABASE_VER = 1;
  static readonly DATABASE_NAME = "backpack";

  private db?: IDBDatabase;

  protected async open() {
    return new Promise<void>((resolve, reject) => {
      const dbOpenRequest = window.indexedDB.open(
        DataBase.DATABASE_NAME,
        DataBase.DATABASE_VER
      );
      dbOpenRequest.onerror = (event) => {
        reject(event);
      };
      dbOpenRequest.onsuccess = async (event) => {
        this.db = dbOpenRequest.result;
        if ((await this.countTable(TABLES.CATEGORIES)) === 0)
          this.initDefaults();
        resolve();
      };
      dbOpenRequest.onupgradeneeded = (event) => {
        this.createTables(event);
      };
    });
  }

  // ----- PUBLIC -----
  public async getRecord(table: TABLES, id: number) {
    return new Promise<GenericType>((resolve, reject) => {
      if (!this.db) {
        reject("Database is NULL");
        return;
      }
      const transaction = this.db.transaction([table], "readonly");
      const store = transaction.objectStore(table);
      const query = store.get(id);

      query.onsuccess = () => {
        resolve(query.result);
      };
      query.onerror = (event) => {
        event.stopPropagation();
        reject(event);
      };
      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  public async getTable(table: TABLES) {
    return new Promise<Array<GenericType>>((resolve, reject) => {
      if (!this.db) {
        reject("Database is NULL");
        return;
      }
      const transaction = this.db.transaction([table], "readonly");
      const store = transaction.objectStore(table);
      const query = store.getAll();

      query.onsuccess = () => {
        resolve(query.result);
      };
      query.onerror = (event) => {
        event.stopPropagation();
        reject(event);
      };
      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  public async getRecords(
    table: TABLES,
    conditionFunction: (item: object) => boolean
  ) {
    return new Promise<Array<object>>((resolve, reject) => {
      if (!this.db) {
        reject("Database is NULL");
        return;
      }
      const transaction = this.db.transaction([table], "readonly");
      const store = transaction.objectStore(table);
      const cursorRequest = store.openCursor();
      const result: Array<object> = [];
      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (cursor) {
          if (conditionFunction(cursor.value)) result.push(cursor.value);
          cursor.continue();
        } else {
          resolve(result);
        }
      };
      cursorRequest.onerror = (event) => {
        event.stopPropagation();
        reject(event);
      };
      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  public addRecord(table: TABLES, record: object) {
    return new Promise<number>((resolve, reject) => {
      if (!this.db) {
        reject("Database is NULL");
        return;
      }
      const transaction = this.db.transaction([table], "readwrite");
      const store = transaction.objectStore(table);
      const query = store.add(record);

      query.onsuccess = () => {
        resolve(Number(query.result));
      };
      query.onerror = (event) => {
        event.stopPropagation();
        reject(event);
      };
      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  public async addRecords(table: TABLES, items: Array<object>) {
    return new Promise<void>(async (resolve, reject) => {
      if (!this.db) {
        reject("Database is NUll");
        return;
      }
      const transaction = this.db.transaction([table], "readwrite");
      const store = transaction.objectStore(table);

      items.forEach((item) => {
        const query = store.add(item);

        query.onerror = (event) => {
          event.stopPropagation();
          reject(event);
        };
      });

      transaction.onerror = (event) => {
        reject(event);
      };

      resolve();
    });
  }

  // ----- PRIVATE -----
  private createTables(event: IDBVersionChangeEvent) {
    const db = (event.target as IDBOpenDBRequest).result;
    console.log(`Upgrading to version ${db.version}`);

    db.onerror = (event) => {
      console.error("Error initializing database", event);
    };

    const tripsTable = db.createObjectStore(TABLES.TRIPS, {
      keyPath: "id",
      autoIncrement: true,
    });
    tripsTable.createIndex("name", "name", { unique: false });
    tripsTable.createIndex("trash", "trash", { unique: false });

    const categoriesTable = db.createObjectStore(TABLES.CATEGORIES, {
      keyPath: "id",
      autoIncrement: true,
    });
    categoriesTable.createIndex("name", "name", { unique: true });

    const tripsAndItemsTable = db.createObjectStore(TABLES.TRIPS_AND_ITEMS, {
      keyPath: "id",
      autoIncrement: true,
    });
    tripsAndItemsTable.createIndex("trip_id", "trip_id", { unique: false });
    tripsAndItemsTable.createIndex("item_id", "item_id", { unique: false });
    tripsAndItemsTable.createIndex("active", "active", { unique: false });

    const itemsTable = db.createObjectStore(TABLES.ITEMS, {
      keyPath: "id",
      autoIncrement: true,
    });
    itemsTable.createIndex("category_id", "category_id", { unique: false });
    itemsTable.createIndex("name", "name", { unique: true });
  }

  private async initDefaults() {
    return new Promise<void>(async (resolve, reject) => {
      if (!this.db) {
        reject("Database is NULL");
        return;
      }
      await this.initDefaultCategories();

      const categoriesDB: Array<CategoryType> = await this.getTable(
        TABLES.CATEGORIES
      );
      const categories = new Map();

      categoriesDB.forEach((e) => {
        categories.set(e.name, e.id);
      });

      const transaction = this.db.transaction([TABLES.ITEMS], "readwrite");
      const storeItems = transaction.objectStore(TABLES.ITEMS);

      initialPackingItems.map((item: { category: string; name: string }) => {
        const categoryId = categories.get(item.category) ?? -1;
        const query = storeItems.add({
          name: item.name,
          category_id: categoryId,
        });

        query.onerror = (ev) => {
          reject(ev);
        };
      });

      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = (ev) => {
        reject(ev);
      };
    });
  }

  private async countTable(name: string) {
    return new Promise<number>((resolve) => {
      if (!this.db) {
        resolve(-1);
        return;
      }
      const transaction = this.db.transaction([name], "readonly");
      const store = transaction.objectStore(name);
      const count = store.count();
      count.onsuccess = () => resolve(count.result);
    });
  }

  private async initDefaultCategories() {
    return new Promise<void>(async (resolve, reject) => {
      if (!this.db) {
        reject("Database is null");
        return;
      }
      const transaction = this.db.transaction([TABLES.CATEGORIES], "readwrite");
      const store = transaction.objectStore(TABLES.CATEGORIES);

      const uniqueCategories = new Set<string>();
      initialPackingItems.forEach((element) => {
        uniqueCategories.add(element.category);
      });

      uniqueCategories.forEach((category) => {
        const query = store.add({
          name: category,
        });

        query.onerror = (event) => {
          event.stopPropagation();
          reject(event);
        };
      });
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  // ----- STATIC -----
  private static dataBaseInstance?: DataBase;
  static async getInstance() {
    if (this.dataBaseInstance === undefined) {
      this.dataBaseInstance = new DataBase();
      await this.dataBaseInstance.open();
    }
    return this.dataBaseInstance;
  }
  static delete() {
    window.indexedDB.deleteDatabase(DataBase.DATABASE_NAME);
  }
}

export default DataBase;
