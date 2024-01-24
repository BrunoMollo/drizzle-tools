import { beforeAll, describe, expect, test } from "vitest";

import { db, delete_all, seed } from "./seed-db";
import {
  t_category,
  t_product,
  t_supplier,
  tr_supplier_product,
} from "./schema";
import { eq } from "drizzle-orm";
import { drizzle_map } from "../src/drizzle-map";
import { pick_columns, pick_merge } from "../src/pick-columns";

describe("index", () => {
  beforeAll(async () => {
    await delete_all();
    await seed();
  });
  test("one product with many suppliers (left join)", async () => {
    const res = await db
      .select({
        product: pick_columns(t_product, "id", "name"),
        suppliers: pick_columns(t_supplier, "id", "fullname"),
      })
      .from(t_product)
      .leftJoin(
        tr_supplier_product,
        eq(tr_supplier_product.productId, t_product.id),
      )
      .leftJoin(t_supplier, eq(tr_supplier_product.supplierId, t_supplier.id))
      .then(
        drizzle_map({
          one: "product",
          with_many: ["suppliers"],
          with_one: [],
        }),
      );
    expect(res.length).toBe(3);
    {
      const p1 = res.find((x) => x.id == 1);
      expect(p1?.id).toBe(1);
      expect(p1?.name).toBe("Product 1");
      expect(p1?.suppliers.length).toBe(0);
      //@ts-ignore
      expect(p1?.r_suppliers_ingredient).toBe(undefined);
    }
    {
      const p2 = res.find((x) => x.id == 2);
      expect(p2?.id).toBe(2);
      expect(p2?.name).toBe("Product 2");
      expect(p2?.suppliers.length).toBe(1);
      expect(p2?.suppliers[0].id).toBe(1);
      expect(p2?.suppliers[0].fullname).toBe("Supplier 1");
      //@ts-ignore
      expect(p2?.r_suppliers_ingredient).toBe(undefined);
    }
    {
      const p3 = res.find((x) => x.id == 3);
      expect(p3?.id).toBe(3);
      expect(p3?.name).toBe("Product 3");
      expect(p3?.suppliers.length).toBe(2);
      expect(p3?.suppliers[0].id).toBe(1);
      expect(p3?.suppliers[0].fullname).toBe("Supplier 1");
      expect(p3?.suppliers[1].id).toBe(2);
      expect(p3?.suppliers[1].fullname).toBe("Supplier 2");
    }
  });

  test("one product with one suppliers (with no fullname) (left join)", async () => {
    const res = await db
      .select({
        product: pick_columns(t_product, "id", "name"),
        supplier: pick_columns(t_supplier, "id", "fullname"),
      })
      .from(t_product)
      .leftJoin(
        tr_supplier_product,
        eq(tr_supplier_product.productId, t_product.id),
      )
      .leftJoin(t_supplier, eq(tr_supplier_product.supplierId, t_supplier.id))
      .then((x) => x)
      .then(
        drizzle_map({
          one: "product",
          with_many: [],
          with_one: ["supplier"],
        }),
      );

    expect(res.length).toBe(3);
    {
      const p1 = res.find((x) => x.id == 1);
      expect(p1?.id).toBe(1);
      expect(p1?.name).toBe("Product 1");
      expect(p1?.supplier).toBe(null);
      //@ts-ignore
      expect(p1?.r_supplier_ingredient).toBe(undefined);
    }
    {
      const p2 = res.find((x) => x.id == 2);
      expect(p2?.id).toBe(2);
      expect(p2?.name).toBe("Product 2");
      expect(p2?.supplier.id).toBe(1);
      //@ts-ignore
      expect(p2?.supplier.fullname).toBe(undefined);
      //@ts-ignore
      expect(p2?.r_supplier_ingredient).toBe(undefined);
    }
    {
      const p3 = res.find((x) => x.id == 3);
      expect(p3?.id).toBe(3);
      expect(p3?.name).toBe("Product 3");
      expect(p3?.supplier.id).toBe(1);
      //@ts-ignore
      expect(p3?.supplier.fullname).toBe(undefined);
    }
  });

  test("pick_merge", async () => {
    const res = await db
      .select(
        pick_merge()
          .table(t_product, "id", "name")
          .aliased(t_category, "name", "category")
          .build(),
      )
      .from(t_product)
      .leftJoin(t_category, eq(t_product.category_id, t_category.id));

    expect(res.length).toBe(3);
    {
      const id = 1;
      const p = res.find((x) => x.id == id);
      expect(p?.id).toBe(id);
      expect(p?.name).toBe("Product 1");
      expect(p?.category).toBe("Category 1");
    }

    {
      const id = 2;
      const p = res.find((x) => x.id == id);
      expect(p?.id).toBe(id);
      expect(p?.name).toBe("Product 2");
      expect(p?.category).toBe(null);
    }

    {
      const id = 3;
      const p = res.find((x) => x.id == id);
      expect(p?.id).toBe(id);
      expect(p?.name).toBe("Product 3");
      expect(p?.category).toBe(null);
    }
  });
});
