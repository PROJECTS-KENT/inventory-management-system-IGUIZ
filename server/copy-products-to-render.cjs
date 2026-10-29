const { PrismaClient } = require("@prisma/client");

const renderDb = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

const localDb = new PrismaClient({
  datasources: { db: { url: process.env.LOCAL_DATABASE_URL } },
});

async function main() {
  if (!process.env.DATABASE_URL || !process.env.LOCAL_DATABASE_URL) {
    throw new Error("Both database connections must be set.");
  }

  // Read local records before changing production.
  const products = await localDb.product.findMany({
    where: { sku: { in: ["1102322--232322", "1123122"] } },
  });

  if (products.length !== 2) {
    throw new Error(`Expected 2 local products; found ${products.length}.`);
  }

  console.log("Local products found:", products.map(p => p.name));

  // Stop if production is not empty.
  const [pc, cc, sc] = await Promise.all([
    renderDb.product.count(),
    renderDb.category.count(),
    renderDb.supplier.count(),
  ]);

  console.log("Render counts:", { products: pc, categories: cc, suppliers: sc });

  if (pc !== 0 || cc !== 0 || sc !== 0) {
    throw new Error("Render database is not empty. No records copied.");
  }

  // Create category and supplier first.
  const category = await renderDb.category.create({
    data: { name: "ELECTRONICS" },
  });

  const supplier = await renderDb.supplier.create({
    data: { name: "ABC " },
  });

  // Copy products without local image paths.
  for (const p of products) {
    await renderDb.product.create({
      data: {
        name: p.name,
        sku: p.sku,
        description: p.description,
        price: p.price,
        quantity: p.quantity,
        brand: p.brand,
        connection: p.connection,
        categoryId: category.id,
        supplierId: supplier.id,
      },
    });
    console.log("Copied:", p.name);
  }

  console.log("Copy complete!");
}

main()
  .catch(err => {
    console.error("Copy failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await localDb.$disconnect();
    await renderDb.$disconnect();
  });