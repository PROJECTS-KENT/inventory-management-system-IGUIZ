import prisma from "../config/prisma";

export async function getCustomer(id: string) {
  return prisma.customer.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateCustomer(
  id: string,
  data: any
) {
  return prisma.customer.update({
    where: {
      id,
    },
    data: {
      name: data.name,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
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

// ===============================
// NEW - Get One Customer Order
// ===============================

export async function getCustomerOrder(
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