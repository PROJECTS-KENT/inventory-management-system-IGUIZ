import prisma from "../config/prisma";

export async function getProductPerformance(productId: string) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      orderItems: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const timesOrdered = product.orderItems.length;

  const unitsSold = product.orderItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return {
    currentStock: product.quantity,
    timesOrdered,
    unitsSold,
  };
}