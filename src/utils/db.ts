import { resolve } from "path";
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

enum TABLES {
  ITEMS = "items",
  CATEGORIES = "categories",
  TRIPS = "trips",
  TRIPS_AND_ITEMS = "trips_and_items",
}

class DataBase {
  static readonly DATABASE_VER = 1;
  static readonly DATABASE_NAME = "backpack";

  private db?: IDBDatabase;

  constructor() {
    const dbOpenRequest = window.indexedDB.open(
      DataBase.DATABASE_NAME,
      DataBase.DATABASE_VER
    );
    dbOpenRequest.onerror = (event) => {
      console.error("Error opening DB", event);
    };
    dbOpenRequest.onsuccess = async (event) => {
      this.db = dbOpenRequest.result;
      if ((await this.countTable(TABLES.CATEGORIES)) === 0) this.initDefaults();
    };
    dbOpenRequest.onupgradeneeded = (event) => {
      this.createTables(event);
    };
  }

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
      keyPath: "",
      autoIncrement: false,
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
    return new Promise(async (resolve) => {
      if (!this.db) {
        resolve(false);
        return;
      }
      await this.initDefaultCategories();

      const categoriesDB: Array<CategoryType> = await this.getCategories();
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
          console.error("initDefItems: Query error", ev);
        };
      });

      transaction.oncomplete = () => {
        resolve(true);
      };
      transaction.onerror = (ev) => {
        console.error("defaultInit: Transaction error", ev);
        resolve(false);
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
    return new Promise(async (resolve) => {
      if (!this.db) {
        resolve(false);
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
          console.error("initDefaultCategories: Query error", event);
        };
      });
      transaction.oncomplete = () => {
        resolve(true);
      };
      transaction.onerror = (event) => {
        console.error("initDefaultCategories: Transaction error", event);
        resolve(false);
      };
    });
  }

  public async getTable(name: TABLES) {
    return new Promise<Array<GenericType>>((resolve) => {
      if (!this.db) {
        resolve([]);
        return;
      }
      const transaction = this.db.transaction([name], "readonly");
      const store = transaction.objectStore(name);
      const query = store.getAll();

      query.onsuccess = () => {
        resolve(query.result);
      };
      query.onerror = (event) => {
        event.stopPropagation();
        console.error("getTable: Query error", name, event);
        resolve([]);
      };
      transaction.onerror = (event) => {
        console.error("getTable: Transaction error", name, event);
        resolve([]);
      };
    });
  }

  public async getItems(): Promise<ItemType[]> {
    return await this.getTable(TABLES.ITEMS);
  }

  public async getCategories(): Promise<CategoryType[]> {
    return await this.getTable(TABLES.CATEGORIES);
  }

  public async getTrips(): Promise<TripType[]> {
    return await this.getTable(TABLES.TRIPS);
  }

  public async addTrip(name: string) {
    return new Promise<void>((resolve) => {
      if (!this.db) {
        resolve();
        return;
      }
      const transaction = this.db.transaction([TABLES.TRIPS], "readwrite");
      const store = transaction.objectStore(TABLES.TRIPS);
      const query = store.add({ name: name });

      query.onsuccess = () => {
        resolve();
      };
      query.onerror = (event) => {
        event.stopPropagation();
        console.error("addTrip: Query error", event);
        resolve();
      };
      transaction.onerror = (event) => {
        console.error("addTrip: Transaction error", event);
        resolve();
      };
    });
  }

  public async getCategoryMap() {
    return new Promise<Map<number, string>>(async (resolve) => {
      const categoriesDB: Array<CategoryType> = await this.getCategories();
      const categories = new Map();

      categoriesDB.forEach((e) => {
        categories.set(e.id, e.name);
      });
      resolve(categories);
    });
  }

  private static dataBaseInstance?: DataBase;
  static async getInstance() {
    if (this.dataBaseInstance === undefined) {
      this.dataBaseInstance = new DataBase();
    }
    return this.dataBaseInstance;
  }
  static delete() {
    window.indexedDB.deleteDatabase(DataBase.DATABASE_NAME);
  }
}

export default DataBase;
