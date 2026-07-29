export const CATEGORIES = [
  'Sedan',
  'SUV',
  'Truck',
  'Coupe',
  'Convertible',
  'Hatchback',
  'Van',
  'Electric',
  'Hybrid',
];

export const FUEL_TYPES = [
  'Gasoline',
  'Diesel',
  'Electric',
  'Hybrid',
  'Plug-in Hybrid',
];

export const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT'];

export const SORT_OPTIONS = [
  { label: 'Newest Additions', value: 'createdAt', order: 'desc' },
  { label: 'Price: Low to High', value: 'price', order: 'asc' },
  { label: 'Price: High to Low', value: 'price', order: 'desc' },
  { label: 'Year: Newest First', value: 'year', order: 'desc' },
];
