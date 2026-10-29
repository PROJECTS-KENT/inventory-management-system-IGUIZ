require("dotenv").config();
const prisma = require("./dist/config/prisma").default;

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      isActive: true,
    },
  });

  console.log(users);
}

main()
  .catch((error) => {
    console.error("Connection check failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });