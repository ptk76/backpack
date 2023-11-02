import initialPackingItems from "./db_def";

export type ItemType = {
  id: number;
  name: string;
};

class DataBase {
  static readonly DATABASE_VER = 1;
  static readonly DATABASE_NAME = "backpack";
  static readonly CATEGORIES_TABLE = "categories";
  static readonly ITEMS_TABLE = "items";
  static readonly TRIPS_TABLE = "trips";
  static readonly TRIPS_AND_ITEMS_TABLE = "trips_and_items";

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
      if ((await this.countTable(DataBase.CATEGORIES_TABLE)) === 0)
        this.initDefaults();
    };
    dbOpenRequest.onupgradeneeded = (event) => {
      this.createTables(event);
    };
  }

  private createTables(event: IDBVersionChangeEvent) {
    console.log(event);
    const db = (event.target as IDBOpenDBRequest).result;
    console.log(`Upgrading to version ${db.version}`);

    db.onerror = (event) => {
      console.error("Error initializing database", event);
    };

    const tripsTable = db.createObjectStore(DataBase.TRIPS_TABLE, {
      keyPath: "id",
      autoIncrement: true,
    });
    tripsTable.createIndex("name", "name", { unique: false });

    const categoriesTable = db.createObjectStore(DataBase.CATEGORIES_TABLE, {
      keyPath: "key",
      autoIncrement: true,
    });
    categoriesTable.createIndex("name", "name", { unique: true });

    const tripsAndItemsTable = db.createObjectStore(
      DataBase.TRIPS_AND_ITEMS_TABLE,
      {
        keyPath: "",
        autoIncrement: false,
      }
    );
    tripsAndItemsTable.createIndex("trip_id", "trip_id", { unique: false });
    tripsAndItemsTable.createIndex("item_id", "item_id", { unique: false });
    tripsAndItemsTable.createIndex("active", "active", { unique: false });

    const itemsTable = db.createObjectStore(DataBase.ITEMS_TABLE, {
      keyPath: "id",
      autoIncrement: true,
    });
    itemsTable.createIndex("category_id", "category_id", { unique: false });
    itemsTable.createIndex("name", "name", { unique: true });
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
      const transaction = this.db.transaction(
        [DataBase.ITEMS_TABLE, DataBase.CATEGORIES_TABLE],
        "readwrite"
      );
      const storeCategories = transaction.objectStore(
        DataBase.CATEGORIES_TABLE
      );

      const uniqueCategories = new Set<string>();
      initialPackingItems.forEach((element) => {
        uniqueCategories.add(element.category);
      });

      uniqueCategories.forEach((category) => {
        const query = storeCategories.add({
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
  private async getAllCategories() {
    return new Promise<Array<{ name: string; key: number }>>((resolve) => {
      if (!this.db) {
        resolve([]);
        return;
      }
      const transaction = this.db.transaction(
        [DataBase.ITEMS_TABLE, DataBase.CATEGORIES_TABLE],
        "readonly"
      );
      const storeCategories = transaction.objectStore(
        DataBase.CATEGORIES_TABLE
      );
      const query = storeCategories.getAll();

      query.onsuccess = () => {
        console.log(query);
        resolve(query.result);
      };
      query.onerror = (event) => {
        event.stopPropagation();
        console.error("getAllCategoryKeys: Query error", event);
        resolve([]);
      };
    });
  }

  private async initDefaults() {
    console.log("DB", this.db);
    return new Promise(async (resolve) => {
      if (!this.db) {
        resolve(false);
        return;
      }
      await this.initDefaultCategories();

      const categoriesDB: Array<{ name: string; key: number }> =
        await this.getAllCategories();
      const categories = new Map();

      categoriesDB.forEach((e) => {
        categories.set(e.name, e.key);
      });

      const transaction = this.db.transaction(
        [DataBase.ITEMS_TABLE],
        "readwrite"
      );
      const storeItems = transaction.objectStore(DataBase.ITEMS_TABLE);

      initialPackingItems.map((item: { category: string; name: string }) => {
        const categoryId = categories.get(item.category) ?? -1;
        const query = storeItems.add({
          name: item.name,
          category_id: categoryId,
        });
        query.onsuccess = () => {
          console.log("success");
        };
        query.onerror = (ev) => {
          console.error("initDefItems: Query error", ev);
        };
      });

      transaction.oncomplete = () => {
        console.log("init TRANS completed");
        resolve(true);
      };
      transaction.onerror = (ev) => {
        console.error("defaultInit: Transaction error", ev);
        resolve(false);
      };
    });
  }

  public async getAllItems() {
    return [
      { id: 1, name: "ala" },
      { id: 2, name: "ola" },
    ];
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
