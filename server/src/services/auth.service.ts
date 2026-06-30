import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const { password: _, ...userWithoutPassword } = user;

return userWithoutPassword;
}

export async function loginUser(
  email: string,
  password: string
) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id, user.role);

const { password: _, ...userWithoutPassword } = user;

return {
  user: userWithoutPassword,
  token,
};
}