import {
  t_category,
  t_ingredient,
  t_product,
  t_supplier,
  tr_ingredient_ingredient,
  tr_ingredient_product,
  tr_supplier_product,
} from "./schema.js";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const mockDrizzleClient = new Database(":memory:");

export const db = drizzle(mockDrizzleClient, { schema });

migrate(db, { migrationsFolder: "./migrations/" });

export async function delete_all() {
  await db.delete(tr_ingredient_ingredient);
  await db.delete(tr_supplier_product);
  await db.delete(t_ingredient);
  await db.delete(t_product);
  await db.delete(t_supplier);
  await db.delete(t_supplier);
}

export async function seed() {
  // category
  await db.insert(t_category).values({ id: 1, name: "Category 1" });

  // Ingredients
  await db.insert(t_ingredient).values({ id: 1, name: "Ingredient 1" });
  await db.insert(t_ingredient).values({ id: 2, name: "Ingredient 2" });
  await db.insert(t_ingredient).values({ id: 3, name: "Ingredient 3" });

  // Suppliers
  await db.insert(t_supplier).values({ id: 1, fullname: "Supplier 1" });
  await db.insert(t_supplier).values({ id: 2, fullname: "Supplier 2" });

  //Product 1 -> 0 Suppliers & 0 Ingredients
  await db
    .insert(t_product)
    .values({ id: 1, name: "Product 1", category_id: 1 });

  //Product 2 -> 1 Suppliers & 2 Ingredients
  await db.insert(t_product).values({ id: 2, name: "Product 2" });
  await db
    .insert(tr_ingredient_product)
    .values({ productId: 2, ingredientId: 1, amount: 210 });

  await db
    .insert(tr_ingredient_product)
    .values({ productId: 2, ingredientId: 3, amount: 230 });

  await db.insert(tr_supplier_product).values({ productId: 2, supplierId: 1 });

  //Product 3 -> 2 Suppliers & 1 Ingredients
  await db.insert(t_product).values({ id: 3, name: "Product 3" });
  await db
    .insert(tr_ingredient_product)
    .values({ productId: 3, ingredientId: 1, amount: 310 });

  await db.insert(tr_supplier_product).values({ productId: 3, supplierId: 1 });
  await db.insert(tr_supplier_product).values({ productId: 3, supplierId: 2 });
}
