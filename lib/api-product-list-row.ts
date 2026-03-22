export interface ApiProductListRow {
  id: string;
  slug: string;
  name: string;
  price: string;
  originalPrice?: string | null;
  image: string;
  rating?: string | null;
  reviewCount?: number | null;
  category?: { name?: string } | null;
  stock?: number | null;
  stockCapacity?: number | null;
  isNew?: boolean;
  isBestSeller?: boolean;
  isHandPicked?: boolean;
  isCeramicFeatured?: boolean;
}
