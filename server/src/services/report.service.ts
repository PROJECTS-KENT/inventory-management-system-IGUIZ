import prisma from "../config/prisma";
import PDFDocument from "pdfkit";
import * as XLSX from "xlsx";

export async function generateInventoryPDF() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      supplier: true,
    },
  });

  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
  });

  const buffers: Buffer[] = [];

  doc.on("data", buffers.push.bind(buffers));

  return new Promise<Buffer>((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    doc.fontSize(22).text("Inventory Management System", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(18).text("Inventory Report", {
      align: "center",
    });

    doc.moveDown(2);

    doc.fontSize(12);

    doc.text(
      "--------------------------------------------------------------------------------------------"
    );

    doc.text(
      "Product              Category              Supplier              Stock        Price"
    );

    doc.text(
      "--------------------------------------------------------------------------------------------"
    );

    let totalValue = 0;

    products.forEach((product) => {
      totalValue += product.quantity * product.price;

      doc.text(
        `${product.name.padEnd(20)}
${product.category.name.padEnd(20)}
${product.supplier.name.padEnd(20)}
${String(product.quantity).padEnd(10)}
₱${product.price}`
      );
    });

    doc.moveDown();

    doc.text(
      "--------------------------------------------------------------------------------------------"
    );

    doc.fontSize(14).text(
      `Total Inventory Value: ₱${totalValue.toLocaleString()}`
    );

    doc.moveDown();

    doc.fontSize(10).text(
      `Generated: ${new Date().toLocaleString()}`
    );

    doc.end();
  });
}

export async function generateInventoryExcel() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      supplier: true,
    },
  });

  const rows = products.map((p) => ({
    Product: p.name,
    SKU: p.sku,
    Category: p.category.name,
    Supplier: p.supplier.name,
    Price: p.price,
    Quantity: p.quantity,
    Value: p.price * p.quantity,
  }));

  const workbook = XLSX.utils.book_new();

  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Inventory"
  );

  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });
}

export async function getAnalytics() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const week = new Date(today);
  week.setDate(today.getDate() - 6);

  const month = new Date(today.getFullYear(), today.getMonth(), 1);

  const year = new Date(today.getFullYear(), 0, 1);

  const [
    totalRevenue,
    todayRevenue,
    weekRevenue,
    monthRevenue,
    yearRevenue,
    approvedOrders,
    pendingOrders,
    rejectedOrders,
    totalOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "APPROVED" },
    }),

    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: "APPROVED",
        createdAt: {
          gte: today,
        },
      },
    }),

    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: "APPROVED",
        createdAt: {
          gte: week,
        },
      },
    }),

    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: "APPROVED",
        createdAt: {
          gte: month,
        },
      },
    }),

    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: "APPROVED",
        createdAt: {
          gte: year,
        },
      },
    }),

    prisma.order.count({
      where: { status: "APPROVED" },
    }),

    prisma.order.count({
      where: { status: "PENDING" },
    }),

    prisma.order.count({
      where: { status: "REJECTED" },
    }),

    prisma.order.count(),
  ]);

  const topProductsRaw = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    _count: {
      productId: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  const topProducts = await Promise.all(
    topProductsRaw.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      return {
        product: product?.name,
        sold: item._sum.quantity ?? 0,
        orders: item._count.productId,
      };
    })
  );

  const products = await prisma.product.findMany();

  const inventoryValue = products.reduce(
    (sum, p) => sum + p.quantity * p.price,
    0
  );

  const lowStock = products.filter(
    (p) => p.quantity <= 5
  ).length;

  const outOfStock = products.filter(
    (p) => p.quantity === 0
  ).length;

  return {
    totalRevenue: totalRevenue._sum.total ?? 0,
    todayRevenue: todayRevenue._sum.total ?? 0,
    weekRevenue: weekRevenue._sum.total ?? 0,
    monthRevenue: monthRevenue._sum.total ?? 0,
    yearRevenue: yearRevenue._sum.total ?? 0,

    totalOrders,
    approvedOrders,
    pendingOrders,
    rejectedOrders,

    inventoryValue,
    lowStock,
    outOfStock,

    topProducts,
  };
}