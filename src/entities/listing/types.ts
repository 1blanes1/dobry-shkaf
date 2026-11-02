export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  imageUrl?: string;
  city: string;
  userId: string;
  createdAt: string;
}

export interface CreateListingDto {
  title: string;
  description: string;
  category: string;
  condition: string;
  imageUrl?: string;
  city: string;
  userId: string;
}
