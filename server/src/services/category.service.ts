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

export async function updateCategory(id: string, name: string) {
  return prisma.category.update({
    where: { id },
    data: { name },
  });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({
    where: { id },
  });
}