export type AmenityName = 'wifi' | 'pool' | 'parking' | 'restaurant' | 'gym' | 'spa' | 'pet-friendly' | 'air-conditioning';

export type Amenity = {
  name: AmenityName;
  label: string;
};

export type Review = {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number;
  comment: string;
};

export type Hotel = {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerNight: number;
  rating: number;
  amenities: AmenityName[];
  images: string[];
  reviews: Review[];
};
