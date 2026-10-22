import prisma from "../config/prisma";
import * as XLSX from "xlsx";

export async function createProduct(data: {
  name: string;
  sku: string;
  description?: string;
  image?: string;
  price: number;
  quantity: number;
  categoryId: string;
  supplierId: string;
}) {
  return prisma.product.create({
    data,
    include: {
      category: true,
      supplier: true,
    },
  });
}

export async function getProducts(
  search?: string,
  category?: string,
  supplier?: string,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        sku: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (category) {
    where.category = {
      name: category,
    };
  }

  if (supplier) {
    where.supplier = {
      name: supplier,
    };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      supplier: true,
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.product.count({
    where,
  });

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    products,
  };
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      supplier: true,

      transactions: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function updateProduct(
  id: string,
  data: {
  name?: string;
  sku?: string;
  description?: string;
  image?: string;
  price?: number;
  quantity?: number;
  categoryId?: string;
  supplierId?: string;
}
) {
  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
      supplier: true,
    },
  });
}

export async function deleteProduct(id: string) {
  // Delete inventory history first
  await prisma.inventoryTransaction.deleteMany({
    where: {
      productId: id,
    },
  });

  return prisma.product.delete({
    where: {
      id,
    },
  });
}

export async function getLowStockProducts(limit: number = 10) {
  return prisma.product.findMany({
    where: {
      quantity: {
        lte: limit,
      },
    },
    include: {
      category: true,
      supplier: true,
    },
    orderBy: {
      quantity: "asc",
    },
  });
}

/* ===========================================
   IMPORT PRODUCTS FROM EXCEL
=========================================== */

export async function importProductsFromExcel(
  buffer: Buffer
): Promise<number> {
  const workbook = XLSX.read(buffer, {
    type: "buffer",
  });

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  let imported = 0;

  for (const row of rows) {
    const category = await prisma.category.findFirst({
      where: {
        name: row.Category,
      },
    });

    const supplier = await prisma.supplier.findFirst({
      where: {
        name: row.Supplier,
      },
    });

    if (!category || !supplier) {
      console.log(
        `Skipped ${row.Name}: Category or Supplier not found.`
      );
      continue;
    }

    const existing = await prisma.product.findUnique({
      where: {
        sku: row.SKU,
      },
    });

    if (existing) {
      console.log(
        `Skipped ${row.Name}: SKU already exists.`
      );
      continue;
    }

    await prisma.product.create({
      data: {
        name: row.Name,
        sku: row.SKU,
        description: row.Description || "",
        price: Number(row.Price),
        quantity: Number(row.Quantity),
        categoryId: category.id,
        supplierId: supplier.id,
      },
    });

    imported++;
  }

  return imported;
}