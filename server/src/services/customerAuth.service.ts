import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { generateCustomerToken } from "../utils/customerJwt";

export async function registerCustomer(
  name: string,
  email: string,
  password: string
) {
  const existing = await prisma.customer.findUnique({
    where: {
      email,
    },
  });

  if (existing) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const customer = await prisma.customer.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = generateCustomerToken(customer.id);

  const { password: _, ...customerWithoutPassword } = customer;

  return {
    customer: customerWithoutPassword,
    token,
  };
}

export async function loginCustomer(
  email: string,
  password: string
) {
  const customer = await prisma.customer.findUnique({
    where: {
      email,
    },
  });

  if (!customer) {
    throw new Error("Invalid email or password");
  }

  if (!customer.password) {
    throw new Error(
      "This account uses Google Sign In."
    );
  }

  const valid = await bcrypt.compare(
    password,
    customer.password
  );

  if (!valid) {
    throw new Error("Invalid email or password");
  }

  const token = generateCustomerToken(customer.id);

  const { password: _, ...customerWithoutPassword } =
    customer;

  return {
    customer: customerWithoutPassword,
    token,
  };
}