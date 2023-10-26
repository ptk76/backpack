class DataBase {
  static readonly DATABASE_VER = 1;
  static readonly DATABASE_NAME = "backpack";
  static readonly ITEMS_TABLE = "items";
  static readonly TRIPS_TABLE = "trips";
  static readonly TRIPS_AND_ITEMS_TABLE = "trips_and_items";

  static readonly initialPackingItems = [
    { name: "majtki" },
    { name: "koszulki" },
    { name: "spodenki" },
    { name: "spodnie" },
    { name: "garnek" },
  ];

  private db: any;

  constructor() {
    const openOrCreateDB = window.indexedDB.open(
      DataBase.DATABASE_NAME,
      DataBase.DATABASE_VER
    );

    openOrCreateDB.addEventListener("error", () =>
      console.error("Error opening DB")
    );

    openOrCreateDB.addEventListener("success", () => {
      this.db = openOrCreateDB.result;
    });

    openOrCreateDB.addEventListener("upgradeneeded", (init) => {
      console.log("init:", init);
      this.db = (init.target as IDBOpenDBRequest).result;
      this.db.onerror = () => {
        console.error("Error loading database.");
      };

      const itemsTable = this.db.createObjectStore(DataBase.ITEMS_TABLE, {
        keyPath: "id",
        autoIncrement: true,
      });
      itemsTable.createIndex("name", "name", { unique: true });
      var txn = (init.target as IDBOpenDBRequest).transaction;
      this.initItemTable(txn);

      const tripsTable = this.db.createObjectStore(DataBase.TRIPS_TABLE, {
        keyPath: "",
        autoIncrement: false,
      });
      tripsTable.createIndex("name", "name", { unique: false });

      const tripsAndItemsTable = this.db.createObjectStore(
        DataBase.TRIPS_AND_ITEMS_TABLE,
        {
          keyPath: "",
          autoIncrement: false,
        }
      );
      tripsAndItemsTable.createIndex("trip_id", "item_id", { unique: false });
    });
  }

  private initItemTable(transaction: IDBTransaction | null) {
    if (transaction === null) return;
    //   console.log(value);

    const objectStore = transaction.objectStore(DataBase.ITEMS_TABLE);
    DataBase.initialPackingItems.map((value) => {
      const query = objectStore.add({ name: value.name });
      // query.addEventListener("success", () => {
      //   console.log("success");
      // });
    });
    // transaction.addEventListener("complete", () => {
    //   console.log("complete");
    // });
    transaction.addEventListener("error", () =>
      console.error("Init: Transaction error")
    );
  }

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
      console.log("success");
    });
    transaction.addEventListener("complete", () => {
      console.log("complete");
    });
    transaction.addEventListener("error", () =>
      console.log("Transaction error")
    );
  }

  private readonly allPackingLists = [
    { key: 1, name: "mazury" },
    { key: 2, name: "sando" },
    { key: 3, name: "morze" },
  ];
  readonly allPackingItems = [
    { id: 0, name: "majtki" },
    { id: 1, name: "koszulki" },
    { id: 2, name: "spodenki" },
    { id: 3, name: "spodnie" },
    { id: 4, name: "garnek" },
  ];
  readonly packingList = ["koszulki", "spodenki", "garnek"];

  public getAllPackingLists() {
    return this.allPackingLists;
  }

  public getAllPackingItems() {
    return this.allPackingItems;
  }

  public getPackingItems(id: number) {
    return this.packingList;
  }

  private static dataBaseInstance?: DataBase;
  static getInstance() {
    if (this.dataBaseInstance === undefined)
      this.dataBaseInstance = new DataBase();
    return this.dataBaseInstance;
  }
}

export default DataBase;
