export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  categories?: string[];
  workingHours?: string;
  phone?: string;
}