import type { Hotel } from './types';

const hotels: Hotel[] = [
  {
    id: '1',
    name: 'The Metropolitan',
    location: 'New York, USA',
    description: 'A stylish hotel in the heart of Manhattan, offering breathtaking city views and unparalleled luxury. Perfect for business and leisure travelers looking for a chic urban retreat.',
    pricePerNight: 350,
    rating: 4.8,
    amenities: ['wifi', 'gym', 'restaurant', 'spa', 'air-conditioning'],
    images: ['hotel-1-1', 'hotel-1-2', 'hotel-1-3'],
    reviews: [
      { id: 'r1', author: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', rating: 5, comment: 'Absolutely stunning hotel with the most comfortable beds!' },
      { id: 'r2', author: 'John Smith', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', rating: 4, comment: 'Great location and service. The rooftop bar is a must-visit.' },
    ],
  },
  {
    id: '2',
    name: 'Sunset Beach Resort',
    location: 'Maui, Hawaii',
    description: 'Escape to paradise at our beachfront resort. Enjoy private cabanas, infinity pools, and world-class dining while soaking up the Hawaiian sun.',
    pricePerNight: 550,
    rating: 4.9,
    amenities: ['wifi', 'pool', 'restaurant', 'spa', 'air-conditioning', 'parking'],
    images: ['hotel-2-1', 'hotel-2-2'],
    reviews: [
      { id: 'r3', author: 'Emily White', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', rating: 5, comment: 'A slice of heaven on earth. Worth every penny.' },
    ],
  },
  {
    id: '3',
    name: 'Whispering Pines Lodge',
    location: 'Aspen, Colorado',
    description: 'A cozy mountain lodge perfect for nature lovers. Explore hiking trails, enjoy the warmth of a log fire, and breathe in the fresh mountain air.',
    pricePerNight: 280,
    rating: 4.6,
    amenities: ['wifi', 'parking', 'pet-friendly', 'restaurant'],
    images: ['hotel-3-1', 'hotel-3-2'],
    reviews: [
      { id: 'r4', author: 'Michael Brown', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704a', rating: 5, comment: 'The perfect rustic getaway. So peaceful and beautiful.' },
    ],
  },
  {
    id: '4',
    name: 'Oasis Desert Retreat',
    location: 'Dubai, UAE',
    description: 'Experience luxury in the heart of the desert. Our retreat offers private villas with pools, camel treks, and stargazing tours for a truly unique adventure.',
    pricePerNight: 700,
    rating: 4.9,
    amenities: ['wifi', 'pool', 'spa', 'restaurant', 'air-conditioning'],
    images: ['hotel-4-1'],
    reviews: [],
  },
  {
    id: '5',
    name: 'Le Charme Parisien',
    location: 'Paris, France',
    description: 'A boutique hotel in the artistic district of Montmartre. Experience the charm of Paris with romantic rooms, a quaint courtyard, and authentic French breakfasts.',
    pricePerNight: 320,
    rating: 4.7,
    amenities: ['wifi', 'restaurant', 'air-conditioning', 'pet-friendly'],
    images: ['hotel-5-1'],
    reviews: [
      { id: 'r5', author: 'Sophia Dubois', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704b', rating: 5, comment: 'Incredibly romantic and perfectly located. The staff was wonderful.' },
    ],
  },
  {
    id: '6',
    name: 'Alpine Vista Chalet',
    location: 'Zermatt, Switzerland',
    description: 'A ski-in/ski-out chalet with stunning views of the Matterhorn. Perfect for winter sports enthusiasts seeking comfort and convenience.',
    pricePerNight: 450,
    rating: 4.8,
    amenities: ['wifi', 'spa', 'restaurant', 'parking'],
    images: ['hotel-6-1'],
    reviews: [],
  },
];

export function getHotels(filters: { location?: string } = {}): Hotel[] {
  let filteredHotels = hotels;

  if (filters.location) {
    filteredHotels = filteredHotels.filter(hotel =>
      hotel.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }

  return filteredHotels;
}

export function getHotelById(id: string): Hotel | undefined {
  return hotels.find(hotel => hotel.id === id);
}
