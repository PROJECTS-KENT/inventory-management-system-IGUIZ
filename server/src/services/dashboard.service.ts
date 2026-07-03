import prisma from "../config/prisma";

export async function getDashboardData() {
  const totalProducts = await prisma.product.count();

  const totalCategories = await prisma.category.count();

  const totalSuppliers = await prisma.supplier.count();

  const products = await prisma.product.findMany();

  const totalInventory = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  const inventoryValue = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0
  );

  const recentTransactions =
    await prisma.inventoryTransaction.findMany({
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

  return {
    totalProducts,
    totalCategories,
    totalSuppliers,
    totalInventory,
    inventoryValue,
    recentTransactions,
  };
}