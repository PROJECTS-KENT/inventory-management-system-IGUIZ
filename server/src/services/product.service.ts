import prisma from "../config/prisma";

export async function createProduct(data: {
  name: string;
  sku: string;
  description?: string;
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
    },
  });
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    sku?: string;
    description?: string;
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
  return prisma.product.delete({
    where: { id },
  });
}