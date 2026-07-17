import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Room } from "@/types/room";
import type { Appliance } from "@/types/appliance";

const ROOMS_KEY = "energy_rooms";
const APPLIANCES_KEY = "energy_appliances";
const USER_KEY = "energy_user";

export interface UserData {
  location: string;
  people: number;
  weekdayOccupancy: string;
  cookingFrequency: string;
  onboarded: boolean;
}

export async function loadUser(): Promise<UserData | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function saveUser(user: UserData): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function loadRooms(): Promise<Room[] | null> {
  const raw = await AsyncStorage.getItem(ROOMS_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function saveRooms(rooms: Room[]): Promise<void> {
  await AsyncStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
}

export async function loadAppliances(): Promise<Appliance[] | null> {
  const raw = await AsyncStorage.getItem(APPLIANCES_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function saveAppliances(appliances: Appliance[]): Promise<void> {
  await AsyncStorage.setItem(APPLIANCES_KEY, JSON.stringify(appliances));
}
