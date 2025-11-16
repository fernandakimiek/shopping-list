import AsyncStorage from "@react-native-async-storage/async-storage";
import { FilterStatus } from "@/types/FilterStatus";

const ITEMS_STORAGE_KEY = "@shoppinglist:items";

export type ItemStorage = {
  id: string;
  status: FilterStatus;
  description: string;
};

async function get(): Promise<ItemStorage[]> {
  try {
    const storage = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    return storage ? JSON.parse(storage) : [];
  } catch (error) {
    throw new Error("GET_ITEMS_STORAGE_ERROR" + error);
  }
}

async function getByStatus(status: FilterStatus): Promise<ItemStorage[]> {
  const allItems = await get();
  return allItems.filter((item) => item.status === status);
}

async function save(items: ItemStorage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    throw new Error("SAVE_ITEMS_STORAGE_ERROR" + error);
  }
}

async function add(item: ItemStorage): Promise<ItemStorage[]> {
  const items = await get();
  const updatedItems = [...items, item];
  await save(updatedItems);
  return updatedItems;
}

async function remove(id: string): Promise<void> {
  const items = await get();
  const filteredItems = items.filter((item) => item.id !== id);
  await save(filteredItems);
}

async function clear(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ITEMS_STORAGE_KEY);
  } catch (error) {
    throw new Error("CLEAR_ITEMS_STORAGE_ERROR" + error);
  }
}

async function toggleStatus(id: string): Promise<void> {
  const items = await get();
  const updatedItems = items.map((item) =>
    item.id === id
      ? {
          ...item,
          status:
            item.status === FilterStatus.PENDING
              ? FilterStatus.DONE
              : FilterStatus.PENDING,
        }
      : item
  );
  await save(updatedItems);
}

export const itemsStorage = {
  get,
  getByStatus,
  save,
  add,
  remove,
  clear,
  toggleStatus,
};
