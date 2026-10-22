import prisma from "../config/prisma";

function generateReference() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return `ORD-${code}`;
}

export async function getOrderByReference(
  reference: string
) {
  return prisma.order.findUnique({
    where: {
      reference,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function createOrder(data: any) {
  const reference = generateReference();

  return prisma.order.create({
    data: {
      customerName: data.customerName,
      customerId: data.customerId,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      province: data.province,
      zip: data.zip,
      notes: data.notes,
      total: data.total,
      reference,

      items: {
        create: data.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function getOrders() {
  return prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function trackOrder(reference: string) {
  return prisma.order.findUnique({
    where: {
      reference,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function approveOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "PENDING") {
    throw new Error("Order already processed");
  }

  for (const item of order.items) {
    if (item.product.quantity < item.quantity) {
      throw new Error(
        `${item.product.name} has insufficient stock`
      );
    }
  }

  for (const item of order.items) {
    await prisma.product.update({
      where: {
        id: item.productId,
      },
      data: {
        quantity: {
          decrement: item.quantity,
        },
      },
    });

    await prisma.inventoryTransaction.create({
      data: {
        productId: item.productId,
        type: "OUT",
        quantity: item.quantity,
        remarks: `Customer Order ${order.reference}`,
      },
    });
  }

  return prisma.order.update({
    where: { id },
    data: {
      status: "APPROVED",
    },
  });
}

export async function rejectOrder(id: string) {
  return prisma.order.update({
    where: { id },
    data: {
      status: "REJECTED",
    },
  });
}

export async function getUnreadOrdersCount() {
  return prisma.order.count({
    where: {
      isViewed: false,
    },
  });
}

export async function markOrdersAsViewed() {
  return prisma.order.updateMany({
    where: {
      isViewed: false,
    },
    data: {
      isViewed: true,
    },
  });
}

export async function getCustomerOrders(
  customerId: string
) {
  return prisma.order.findMany({
    where: {
      customerId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// =====================================
// NEW - Customer Order Details
// =====================================

export async function getCustomerOrderById(
  customerId: string,
  orderId: string
) {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      customerId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}