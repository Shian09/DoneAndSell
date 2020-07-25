import client from "./client";

const register = (pushToken, email) =>
  client.post(`${email}/pushTokens`, { token: pushToken });

export default {
  register,
};
