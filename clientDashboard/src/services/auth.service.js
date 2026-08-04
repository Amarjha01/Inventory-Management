import user from "../mock/user";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const login = async (phone, password) => {
  await delay(800);

  if (phone === user.phone && password === user.password) {
    return {
      success: true,
      token: "dummy-jwt-token",
      user,
    };
  }

  throw new Error("Invalid phone number or password");
};