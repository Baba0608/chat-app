const website = "http://localhost:4000";
const sendButton = document.getElementById("send-button");
const messagesDiv = document.getElementById("messages-container");

const container = document.getElementById("container");
const chatContainer = document.getElementById("chat-container");
const messagesContainer = document.getElementById("messages-container");

const chats = document.querySelectorAll(".chat");

const backArrow = document.getElementById("back-image");
let ACTIVE_CHAT = false;

const token = localStorage.getItem("chat-app-token");

(async function () {
  // const joinedMessage = createMessage("You Joined");
  // messagesDiv.appendChild(joinedMessage);
  // const result = await axios.get(`${website}/chat/getmessages`, {
  //   headers: { authorization: token },
  // });
  // const userId = result.data.userId;
  // result.data.result.forEach((message) => {
  //   if (message.id === userId) {
  //     const msg = createMessage(`You: ${message.message}`);
  //     messagesDiv.appendChild(msg);
  //   } else {
  //     const msg = createMessage(`${message.user.username}: ${message.message}`);
  //     messagesDiv.appendChild(msg);
  //   }
  // });
})();

// media queries
const x = window.matchMedia("(min-width: 750px)");

function greaterThan750(x) {
  if (x.matches) {
    messagesContainer.style.display = "block";
    chatContainer.style.display = "block";
  } else {
  }
}

x.addEventListener("change", (e) => {
  e.preventDefault();
  greaterThan750(x);
});

const y = window.matchMedia("(max-width: 750px)");

function lessThan750(y) {
  if (y.matches) {
    if (ACTIVE_CHAT) {
      messagesContainer.style.display = "block";
      chatContainer.style.display = "none";
    } else {
      chatContainer.style.display = "flex";
      messagesContainer.style.display = "none";
    }
  }
}

y.addEventListener("change", (e) => {
  e.preventDefault();
  lessThan750(y);
});

// ----------------------------------------------------

chats.forEach((chat) => {
  chat.addEventListener("click", (e) => {
    e.preventDefault();

    ACTIVE_CHAT = true;
    chats.forEach((chat) => {
      chat.classList.remove("active");
    });

    chat.classList.add("active");

    const width = container.offsetWidth;
    if (width < 750) {
      chatContainer.style.display = "none";
      messagesContainer.style.display = "block";
    }
  });
});

backArrow.addEventListener("click", (e) => {
  e.preventDefault();

  chats.forEach((chat) => {
    chat.classList.remove("active");
  });
  ACTIVE_CHAT = false;
  messagesContainer.style.display = "none";
  chatContainer.style.display = "flex";
});

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
