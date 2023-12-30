const website = "http://localhost:4000";
const sendButton = document.getElementById("send-button");
const messagesDiv = document.getElementById("messages-container");

const token = localStorage.getItem("chat-app-token");

(async function () {
  const joinedMessage = createMessage("You Joined");
  messagesDiv.appendChild(joinedMessage);

  const result = await axios.get(`${website}/chat/getmessages`, {
    headers: { authorization: token },
  });

  //   console.log(result);

  const userId = result.data.userId;
  result.data.result.forEach((message) => {
    if (message.id === userId) {
      const msg = createMessage(`You: ${message.message}`);
      messagesDiv.appendChild(msg);
    } else {
      const msg = createMessage(`${message.user.username}: ${message.message}`);
      messagesDiv.appendChild(msg);
    }
  });
})();

function createMessage(msg) {
  const message = document.createElement("div");
  message.className = "message";
  message.textContent = msg;

  return message;
}

sendButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const messageInput = document.getElementById("message-input");

  if (messageInput.value != "") {
    const message = messageInput.value;

    const msgDiv = createMessage(`You : ${message}`);
    messagesDiv.appendChild(msgDiv);

    messageInput.value = "";

    const token = localStorage.getItem("chat-app-token");
    const result = await axios.post(
      `${website}/chat/sendmessage`,
      {
        message: message,
      },
      { headers: { authorization: token } }
    );

    console.log(result);
  }
});
