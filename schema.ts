import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

////-------------------------------------------------------------------------------------//
// INGREDIENTS
export const t_ingredient = sqliteTable("ingredient", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
export const tr_ingredient_ingredient = sqliteTable("r_ingredient_ingredient", {
  amount: real("amount").notNull(),
  derivedId: integer("derived_id")
    .notNull()
    .references(() => t_ingredient.id),
  sourceId: integer("source_id")
    .notNull()
    .references(() => t_ingredient.id),
});
//-------------------------------------------------------------------------------------////
//

////-------------------------------------------------------------------------------------//
// PRODUCTS
export const t_product = sqliteTable("product", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
//-------------------------------------------------------------------------------------////
//

////-------------------------------------------------------------------------------------//
// INGREDIENTS <-> PRODUCTS
export const tr_ingredient_product = sqliteTable(
  "r_ingredient_product",
  {
    ingredientId: integer("ingredient_id")
      .notNull()
      .references(() => t_ingredient.id),
    productId: integer("product_id")
      .notNull()
      .references(() => t_product.id),
    amount: real("amount").notNull(),
  },
  ({ ingredientId, productId }) => ({
    pk: primaryKey({ columns: [ingredientId, productId] }),
  }),
);
//-------------------------------------------------------------------------------------////
//

////-------------------------------------------------------------------------------------//
// SUPPLIER
export const t_supplier = sqliteTable("supplier", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
//-------------------------------------------------------------------------------------////
//

////-------------------------------------------------------------------------------------//
// SUPPLIER <-> PRODUCTS
export const tr_supplier_product = sqliteTable(
  "r_supplier_ingredient",
  {
    supplierId: integer("supplier_id")
      .notNull()
      .references(() => t_supplier.id),
    productId: integer("ingredient_id")
      .notNull()
      .references(() => t_product.id),
  },
  ({ supplierId, productId }) => ({
    pk: primaryKey({ columns: [supplierId, productId] }),
  }),
);
//-------------------------------------------------------------------------------------////
//
//
