import client from "./client";

const send = async (messageCred) => await client.post("/message", messageCred);
const getMessages = async (email) => client.get(`/messages/${email}`);
const deleteMessage = async (messageId) =>
  client.delete(`/message/${messageId}`);

export default {
  send,
  getMessages,
  deleteMessage,
};
