import DataBase, { TABLES, TripItemType } from "./db";

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

class DataBaseFacade {
  constructor(private db: DataBase) {}

  public async getItem(id: number): Promise<ItemType> {
    return await this.db.getRecord(TABLES.ITEMS, id);
  }

  public async getItems(): Promise<ItemType[]> {
    return await this.db.getTable(TABLES.ITEMS);
  }

  public async getCategories(): Promise<CategoryType[]> {
    return await this.db.getTable(TABLES.CATEGORIES);
  }

  public async getTrips(): Promise<TripType[]> {
    return await this.db.getTable(TABLES.TRIPS);
  }

  public async addTrip(name: string) {
    return this.db.addRecord(TABLES.TRIPS, { name: name });
  }

  public async getPackingList(tripId: number) {
    return (await this.db.getRecords(
      TABLES.TRIPS_AND_ITEMS,
      (item) => (item as TripItemType).trip_id === tripId
    )) as TripItemType[];
  }

  public async getCategoryMap() {
    const categoriesDB: Array<CategoryType> = await this.getCategories();
    const categories = new Map();

    categoriesDB.forEach((e) => {
      categories.set(e.id, e.name);
    });
    return categories;
  }

  public async createTrip(name: string) {
    const tripId = await this.addTrip(name);
    const items = await this.getItems();

    const records = items.map((item) => {
      return { trip_id: tripId, item_id: item.id, active: true };
    });

    await this.db.addRecords(TABLES.TRIPS_AND_ITEMS, records);
    return tripId;
  }

  public delete() {
    DataBase.delete();
  }
}

export default DataBaseFacade;
