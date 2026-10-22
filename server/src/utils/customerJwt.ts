import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "development_secret";

export function generateCustomerToken(customerId: string) {
  return jwt.sign(
    {
      id: customerId,
      type: "CUSTOMER",
    },
    JWT_SECRET,
    {
      expiresIn: "1h", // change to "5m" while testing if you want
    }
  );
}

export function verifyCustomerToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}