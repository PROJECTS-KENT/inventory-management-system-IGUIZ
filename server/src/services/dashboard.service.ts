import prisma from "../config/prisma";

export async function getDashboardData() {
  const totalProducts = await prisma.product.count();
  const totalCategories = await prisma.category.count();
  const totalSuppliers = await prisma.supplier.count();
  const totalUsers = await prisma.user.count();
  const totalActivities = await prisma.activityLog.count();

  // NEW ORDER COUNTS
  const totalOrders = await prisma.order.count();

  const pendingOrders = await prisma.order.count({
    where: {
      status: "PENDING",
    },
  });

  const approvedOrders = await prisma.order.count({
    where: {
      status: "APPROVED",
    },
  });

  const rejectedOrders = await prisma.order.count({
    where: {
      status: "REJECTED",
    },
  });

  // TOTAL SALES
const sales = await prisma.order.aggregate({
  _sum: {
    total: true,
  },
  where: {
    status: "APPROVED",
  },
});

const totalSales = sales._sum.total ?? 0;

const today = new Date();

today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const todaySalesResult = await prisma.order.aggregate({
  _sum: {
    total: true,
  },
  where: {
    status: "APPROVED",
    createdAt: {
      gte: today,
      lt: tomorrow,
    },
  },
});

const todaySales =
  todaySalesResult._sum.total ?? 0;

  // RECENT CUSTOMER ORDERS
  const recentOrders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  });

  const totalInventory = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  const inventoryValue = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0
  );

  const lowStockProducts = await prisma.product.findMany({
    where: {
      quantity: {
        lte: 5,
      },
    },
    orderBy: {
      quantity: "asc",
    },
    take: 5,
  });

  const lowStockCount = await prisma.product.count({
  where: {
    quantity: {
      lte: 5,
    },
  },
});

  const mostStockedProduct = await prisma.product.findFirst({
    orderBy: {
      quantity: "desc",
    },
  });

  const lowestStockProduct = await prisma.product.findFirst({
    orderBy: {
      quantity: "asc",
    },
  });

  const latestProduct = await prisma.product.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  const recentActivities = await prisma.activityLog.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

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

  const categoryMap: Record<string, number> = {};

  products.forEach((product) => {
    const category = product.category.name;

    categoryMap[category] =
      (categoryMap[category] || 0) + 1;
  });

  const categoryChart = Object.entries(categoryMap).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const transactions =
    await prisma.inventoryTransaction.findMany();

  let stockIn = 0;
  let stockOut = 0;

  transactions.forEach((t) => {
    if (t.type === "IN") {
      stockIn += t.quantity;
    } else {
      stockOut += t.quantity;
    }
  });

  const movementChart = [
    {
      name: "Stock In",
      quantity: stockIn,
    },
    {
      name: "Stock Out",
      quantity: stockOut,
    },
  ];

  
const bestSellingProducts = await prisma.orderItem.groupBy({
  by: ["productId"],
  where: {
    order: {
      status: "APPROVED",
    },
  },
  _sum: {
    quantity: true,
  },
  orderBy: {
    _sum: {
      quantity: "desc",
    },
  },
  take: 5,
});


const bestSelling = await Promise.all(
  bestSellingProducts.map(async (item) => {
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
    });

    return {
      name: product?.name,
      sold: item._sum.quantity,
    };
  })
);

  return {
    totalProducts,
    totalCategories,
    totalSuppliers,
    totalUsers,

    totalInventory,
    inventoryValue,

    lowStockCount,
    lowStockProducts,

    mostStockedProduct,
    lowestStockProduct,
    latestProduct,

    totalActivities,

    recentTransactions,
    recentActivities,

    categoryChart,
    movementChart,

    // NEW
    totalOrders,
    pendingOrders,
    approvedOrders,
    rejectedOrders,

    totalSales,
    todaySales,

    recentOrders,
    bestSelling,
  };
}