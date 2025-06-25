import { createContext } from "react";
import DataBase, { TABLE_CATEGORIES, TABLE_ITEMS, TABLE_TRIPS, TABLE_TRIPS_AND_ITEMS } from "./db";

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

export type ItemCategoryEnabledActiveType = {
  id: number;
  name: string;
  category_id: number;
  enabled: boolean;
  active: boolean;
};

class DataBaseFacade {
  private db: DataBase;

  constructor(db: DataBase) {
    this.db = db;
  }

  public async getItem(id: number): Promise<ItemType> {
    return await this.db.getRecord(TABLE_ITEMS, id);
  }

  public async getItems(): Promise<ItemType[]> {
    return await this.db.getTable(TABLE_ITEMS);
  }
  public async getItemsByCategory(categoryId: number): Promise<ItemType[]> {
    const items = await this.db.getTable(TABLE_ITEMS);
    const itemsByCategory = items.filter((item) => item.category_id === categoryId);
    return itemsByCategory;
  }

  public async selectItemCategoryActiveByTrip(tripId: number): Promise<ItemCategoryEnabledActiveType[]> {
    const tripAndItems = await this.db.getRecords(
      TABLE_TRIPS_AND_ITEMS,
      element => (element as TripItemType).trip_id === tripId) as unknown as TripItemType[];

    const items = await this.db.getTable(TABLE_ITEMS) as ItemType[]
    const itemCategoryActive: ItemCategoryEnabledActiveType[] = [];
    for (const record of tripAndItems) {
      const item = items.find(item => item.id === record.item_id);
      if (item)
        itemCategoryActive.push({ id: item.id, name: item.name, active: record.active, category_id: item.category_id, enabled: false } as ItemCategoryEnabledActiveType);

    }
    return itemCategoryActive;
  }

  public async getItemsByTripAndCategory(tripId: number, categoryId: number): Promise<ItemType[]> {
    const tripsAndItems = await this.db.getTable(TABLE_TRIPS_AND_ITEMS) as unknown as TripItemType[];
    console.log("tripsAndItems", tripsAndItems);
    const itemsIdsByTrip = tripsAndItems.filter((item) => item.trip_id === tripId);
    console.log("itemsIdsByTrip", itemsIdsByTrip);
    const items = await this.db.getTable(TABLE_ITEMS) as ItemType[];
    console.log("items", items);
    return items

    // let itemsByCategory: ItemType[] = [];
    const itemsByCategory = itemsIdsByTrip.map(async (i) => {
      const item = await this.getItem(i.item_id)
      if (item.category_id === categoryId) {
        // itemsByCategory.push(item);
        return item;
      } else {
        return null;
      }
    })
    // return itemsByCategory;
  }

  public async getCategories(): Promise<CategoryType[]> {
    return await this.db.getTable(TABLE_CATEGORIES);
  }

  public async getTrips(): Promise<TripType[]> {
    return await this.db.getTable(TABLE_TRIPS);
  }

  public async addTrip(name: string) {
    return this.db.addRecord(TABLE_TRIPS, { name: name });
  }

  public async getPackingList(tripId: number) {
    return (await this.db.getRecords(
      TABLE_TRIPS_AND_ITEMS,
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

    await this.db.addRecords(TABLE_TRIPS_AND_ITEMS, records);
    return tripId;
  }

  public delete() {
    DataBase.delete();
  }
}

export default DataBaseFacade;
export const DataBaseFacadeContext = createContext<DataBaseFacade>(null as unknown as DataBaseFacade);