import prisma from "../config/prisma";

export async function createSupplier(
  name: string,
  email?: string,
  phone?: string,
  address?: string
) {
  return prisma.supplier.create({
    data: {
      name,
      email,
      phone,
      address,
    },
  });
}

export async function getSuppliers() {
  return prisma.supplier.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateSupplier(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }
) {
  return prisma.supplier.update({
    where: { id },
    data,
  });
}

export async function deleteSupplier(id: string) {
  return prisma.supplier.delete({
    where: { id },
  });
}