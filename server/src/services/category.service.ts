import prisma from "../config/prisma";

export async function createCategory(name: string) {
  return prisma.category.create({
    data: {
      name,
    },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}