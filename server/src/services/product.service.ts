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

export async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      supplier: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
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