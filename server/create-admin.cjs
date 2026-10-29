require("dotenv").config();
const bcrypt = require("bcrypt");
const prisma = require("./dist/config/prisma").default;

async function main() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD first."
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("That email already exists. No account was changed.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  console.log("Admin created:", user);
}

main()
  .catch((error) => {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });