class DataBase {
  private static dataBase?: DataBase;
  readonly allPackingLists = ["mazury", "sando", "morze"];
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

  public getPackingItems(list: string) {
    return this.packingList;
  }

  static getInstance() {
    console.log(this.dataBase);
    if (this.dataBase === undefined) this.dataBase = new DataBase();
    return this.dataBase;
  }
}

export default DataBase;
