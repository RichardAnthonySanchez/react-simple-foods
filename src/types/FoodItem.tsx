export interface FoodItem {
  fdc_id: string;
  brand_owner: string | null;
  brand_name: string | null;
  subbrand_name: string | null;
  gtin_upc: string;
  ingredients: string | null;
  serving_size: string | null;
  serving_size_unit: string | null;
  household_serving_fulltext: string | null;
  branded_food_category: string | null;
  data_source: string | null;
  product_name: string;
  energy_kcal_100g: string | null;
  fat_100g: string | null;
  saturated_fat_100g: string | null;
}
