export type ListingExchangeType = 'free' | 'points' | 'barter';

export type ListingCondition =
  | 'new-with-tag'
  | 'excellent'
  | 'good'
  | 'used';

export type ListingStatus =
  | 'draft'
  | 'active'
  | 'reserved'
  | 'completed';

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  size?: string;
  condition: ListingCondition;
  images?: string[];
  exchangeType?: ListingExchangeType;
  pointsCost?: number;
  status?: ListingStatus;
  city: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateListingDto {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  size?: string;
  condition: ListingCondition;
  images?: string[];
  exchangeType?: ListingExchangeType;
  pointsCost?: number;
  status?: 'draft' | 'active';
  city: string;
  userId: string;
}

export type UpdateListingDto = Partial<
  Omit<CreateListingDto, 'userId'>
>;