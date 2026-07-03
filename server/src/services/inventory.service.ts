import prisma from "../config/prisma";

export async function stockIn(
  productId: string,
  quantity: number,
  remarks?: string
) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  await prisma.inventoryTransaction.create({
    data: {
      type: "IN",
      quantity,
      remarks,
      productId,
    },
  });

  return prisma.product.update({
    where: { id: productId },
    data: {
      quantity: {
        increment: quantity,
      },
    },
  });
}

export async function stockOut(
  productId: string,
  quantity: number,
  remarks?: string
) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  await prisma.inventoryTransaction.create({
    data: {
      type: "OUT",
      quantity,
      remarks,
      productId,
    },
  });

  return prisma.product.update({
    where: { id: productId },
    data: {
      quantity: {
        decrement: quantity,
      },
    },
  });
}

export async function getInventoryHistory() {
  return prisma.inventoryTransaction.findMany({
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}