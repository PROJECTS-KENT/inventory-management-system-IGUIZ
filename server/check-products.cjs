const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Local categories:", await prisma.category.findMany({
    select: { name: true }
  }));

  console.log("Local suppliers:", await prisma.supplier.findMany({
    select: { name: true }
  }));

  console.log("Local products:", await prisma.product.findMany({
    select: {
      name: true,
      sku: true,
      category: { select: { name: true } },
      supplier: { select: { name: true } }
    }
  }));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());