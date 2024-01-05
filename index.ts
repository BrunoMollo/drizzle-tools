import {
  t_ingredient,
  t_product,
  t_supplier,
  tr_ingredient_ingredient,
  tr_ingredient_product,
  tr_supplier_product,
} from "./schema.js";
import { arrayify } from "./arrayify.js";
import { eq } from "drizzle-orm";
import { createClient } from "@libsql/client";
import * as schema from "./schema.js";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({ url: "http://127.0.0.1:8080" });
export const db = drizzle(client, { schema });

// DELETE ALL
await db.delete(tr_ingredient_product);
await db.delete(tr_ingredient_ingredient);
await db.delete(tr_supplier_product);
await db.delete(t_ingredient);
await db.delete(t_product);
await db.delete(t_supplier);

// SEED
await db.insert(t_ingredient).values({ id: 1, name: "Ingredient 1" });
await db.insert(t_ingredient).values({ id: 2, name: "Ingredient 2" });
await db.insert(t_ingredient).values({ id: 3, name: "Ingredient 3" });

await db.insert(t_supplier).values({ id: 1, fullname: "Supplier 1" });
await db.insert(t_supplier).values({ id: 2, fullname: "Supplier 2" });

await db.insert(t_product).values({ id: 1, name: "Product 1" });

await db.insert(t_product).values({ id: 2, name: "Product 2" });
await db
  .insert(tr_ingredient_product)
  .values({ ingredientId: 1, productId: 2, amount: 1000 });

await db
  .insert(tr_ingredient_product)
  .values({ ingredientId: 3, productId: 2, amount: 3000 });

await db.insert(tr_supplier_product).values({ supplierId: 1, productId: 2 });

await db.insert(t_product).values({ id: 3, name: "Product 3" });
await db
  .insert(tr_ingredient_product)
  .values({ ingredientId: 1, productId: 3, amount: 4000 });

await db.insert(tr_supplier_product).values({ supplierId: 1, productId: 3 });
await db.insert(tr_supplier_product).values({ supplierId: 2, productId: 3 });

// MAIN QUERY
const result = await db
  .select()
  .from(t_product)
  .leftJoin(
    tr_supplier_product,
    eq(tr_supplier_product.productId, t_product.id),
  )
  .leftJoin(t_supplier, eq(tr_supplier_product.supplierId, t_supplier.id))
  .leftJoin(
    tr_ingredient_product,
    eq(tr_ingredient_product.productId, t_product.id),
  )
  .leftJoin(
    t_ingredient,
    eq(t_ingredient.id, tr_ingredient_product.ingredientId),
  )
  .then(
    arrayify({
      one: { table: "product", id: "id" },
      manys: [
        {
          table: "ingredient",
          borrow: { from: "r_ingredient_product", field: "amount" },
        },
        { table: "supplier" },
      ],
    }),
  );

console.log(JSON.stringify(result, null, 2));
