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

  private db: any;

  private async init() {
    return new Promise<boolean>((resolve) => {
      const openOrCreateDB = window.indexedDB.open(
        DataBase.DATABASE_NAME,
        DataBase.DATABASE_VER
      );

      openOrCreateDB.addEventListener("error", () => {
        console.error("Error opening DB");
        resolve(false);
      });

      openOrCreateDB.addEventListener("success", () => {
        this.db = openOrCreateDB.result;
        resolve(true);
      });

      openOrCreateDB.addEventListener("upgradeneeded", async (init) => {
        this.db = (init.target as IDBOpenDBRequest).result;
        this.db.onerror = () => {
          console.error("Error loading database.");
        };

        const tripsTable = this.db.createObjectStore(DataBase.TRIPS_TABLE, {
          keyPath: "id",
          autoIncrement: true,
        });
        tripsTable.createIndex("name", "name", { unique: false });

        const categoriesTable = this.db.createObjectStore(
          DataBase.CATEGORIES_TABLE,
          {
            keyPath: "id",
            autoIncrement: true,
          }
        );
        categoriesTable.createIndex("name", "name", { unique: true });

        const tripsAndItemsTable = this.db.createObjectStore(
          DataBase.TRIPS_AND_ITEMS_TABLE,
          {
            keyPath: "",
            autoIncrement: false,
          }
        );
        tripsAndItemsTable.createIndex("trip_id", "trip_id", { unique: false });
        tripsAndItemsTable.createIndex("item_id", "item_id", { unique: false });
        tripsAndItemsTable.createIndex("active", "active", { unique: false });

        const itemsTable = this.db.createObjectStore(DataBase.ITEMS_TABLE, {
          keyPath: "id",
          autoIncrement: true,
        });
        itemsTable.createIndex("category_id", "category_id", { unique: false });
        itemsTable.createIndex("name", "name", { unique: true });
        var txn = (init.target as IDBOpenDBRequest).transaction;
        await this.initItemTable(txn);

        resolve(true);
      });
    });
  }

  private async initCategory(transaction: IDBTransaction | null, name: string) {
    if (transaction === null) return;
    return new Promise((resolve) => {
      const objectStore = transaction.objectStore(DataBase.CATEGORIES_TABLE);
      objectStore.openCursor().addEventListener("success", (e: Event) => {
        const pointer = (e.target as IDBRequest).result as IDBCursorWithValue;
        if (pointer) {
          console.log(pointer);
          if (pointer.value.name === name) {
            console.log("BINGO");
            resolve(pointer.value.keyPath);
            return;
          }
          pointer.continue();
        } else {
          const query = objectStore.add({ name: name });
          query.addEventListener("success", (e) => {
            console.log("success", e);
            resolve(1);
          });
          // query.addEventListener("complete", (e) => {
          //   console.log("complete", e);
          //   resolve(1);
          // });
          // query.addEventListener("error", () => {
          //   console.error("Transaction error");
          //   resolve(-1);
          // });
        }
      });
    });
  }
  private async initItemTable(transaction: IDBTransaction | null) {
    if (transaction === null) return;
    return new Promise((resolve) => {
      const objectStore = transaction.objectStore(DataBase.ITEMS_TABLE);
      initialPackingItems.map(
        async (value: { category: string; name: string }) => {
          // const cat_id = await this.initCategory(transaction, value.category);
          // console.log("CAT:", cat_id);
          const query = objectStore.add({ name: value.name, category: 1 });
          // query.addEventListener("success", () => {
          //   console.log("success");
          // });
        }
      );
      transaction.addEventListener("complete", () => {
        resolve(true);
      });
      transaction.addEventListener("error", () => {
        console.error("Init: Transaction error");
        resolve(false);
      });
    });
  }

  private addItem(category: string, name: string) {}

  private addItemTable() {
    // DataBase.initialPackingItems.map((value) => {
    //   console.log(value);
    // });
    const transaction = this.db.transaction(
      [DataBase.ITEMS_TABLE],
      "readwrite"
    );
    const objectStore = transaction.objectStore(DataBase.ITEMS_TABLE);
    const query = objectStore.add({ name: "test" });
    query.addEventListener("success", () => {
      // console.log("success");
    });
    transaction.addEventListener("complete", () => {
      // console.log("complete");
    });
    transaction.addEventListener("error", () =>
      console.error("Transaction error")
    );
  }

  public async getAllItems() {
    if (this.db === undefined) return [];
    const transaction = this.db.transaction([DataBase.ITEMS_TABLE], "readonly");
    const objectStore = transaction.objectStore(DataBase.ITEMS_TABLE);

    return new Promise<ItemType[]>((resolve) => {
      var result: ItemType[] = [];
      objectStore.openCursor().addEventListener("success", (e: Event) => {
        const pointer = (e.target as IDBRequest).result as IDBCursorWithValue;
        if (pointer) {
          result.push(pointer.value);
          pointer.continue();
        } else resolve(result);
      });
    });
  }

  private static dataBaseInstance?: DataBase;
  static async getInstance() {
    if (this.dataBaseInstance === undefined) {
      this.dataBaseInstance = new DataBase();
      await this.dataBaseInstance.init();
    }
    return this.dataBaseInstance;
  }
}

export default DataBase;
