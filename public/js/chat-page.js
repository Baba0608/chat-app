const website = "http://localhost:4000";

const socket = io(`${website}`);

const sendButton = document.getElementById("send-button");
const messagesDiv = document.getElementById("messages");
const createChatGroup = document.getElementById("create-chat-group");
const chatList = document.getElementById("chat-list");

const container = document.getElementById("container");
const chatContainer = document.getElementById("chat-container");
const messagesContainer = document.getElementById("messages-container");
const messageInput = document.getElementById("message-input");
const emptyChatPage = document.getElementById("empty-chat-page");
const details = document.getElementById("details");

const saveChatNameOverlay = document.getElementById("save-chat-name-overlay");
const saveChatNameButton = document.getElementById("save-chat-name-button");

const createChatGroupOverlay = document.getElementById(
  "create-chat-group-overlay"
);

const backArrow = document.getElementById("back-image");
let ACTIVE_CHAT = false;
let USER_ID = null;
let SOCKET_ID = null;
let FRIEND_ID = null;
let FRIEND_NAME = null;
let PRIVATE_iD = null;
let FRIENDS_LIST = [];

const token = localStorage.getItem("chat-app-token");

(async function () {
  // function
  try {
    const result = await axios.get(`${website}/chat/getchats`, {
      headers: { authorization: token },
    });

    USER_ID = result.data.userId;

    socket.emit("connected-user", USER_ID);
    result.data.result.forEach(async (friend) => {
      FRIENDS_LIST.push({
        id: friend.friendId,
        name:
          friend.friendname != ""
            ? friend.friendname
            : friend.user.mobilenumber,
      });
      if (friend.friendname != "") {
        const chat = createPersonalChat(
          friend.friendname,
          friend.friendId,
          friend.privateId
        );
        chatList.appendChild(chat);
      } else {
        const saveButton = createSaveChatNameButton();
        const chat = createPersonalChat(
          friend.user.mobilenumber,
          friend.friendId,
          friend.privateId,
          saveButton
        );
        chatList.appendChild(chat);
      }
    });

    socket.emit("friends-list", FRIENDS_LIST);

    const saveButtons = document.querySelectorAll(".save-button");
    saveButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        USER_ID = e.target.parentElement.parentElement.id;
        PRIVATE_iD = e.target.parentElement.parentElement.privateId;
        console.log(PRIVATE_iD);
        displaySaveChatNameOverlay(e);
      });
    });

    const chats = document.querySelectorAll(".chat");
    chats.forEach((chat) => {
      chat.addEventListener("click", async (e) => {
        e.preventDefault();

        chats.forEach((chat) => {
          chat.classList.remove("active");
        });

        chat.classList.add("active");

        if (
          e.target.classList.contains("chat") ||
          e.target.parentElement.classList.contains("chat")
        ) {
          messagesDiv.innerHTML = "";
          const name = chat.firstChild.textContent;

          FRIEND_ID = chat.id;
          PRIVATE_iD = chat.privateId;
          FRIEND_NAME = name;

          const result = await axios.get(
            `${website}/user/getsocketid/${FRIEND_ID}`,
            {
              headers: {
                authorization: token,
              },
            }
          );

          const socketId = result.data.socketId;

          socket.emit("activity-check", FRIEND_ID);

          socket.on("activity-result", (activityResult) => {
            const nameActivityRemove = document.getElementById("name-activity");

            if (nameActivityRemove) {
              details.removeChild(nameActivityRemove);
            }

            if (activityResult) {
              SOCKET_ID = socketId;
              const nameActivity = createUserActivity(name, "Online");

              details.appendChild(nameActivity);
            } else {
              const nameActivity = createUserActivity(
                name,
                "last seen a while ago"
              );

              details.appendChild(nameActivity);
            }
          });

          // get private chat messages from database.
          const messages = await axios.get(
            `${website}/chat/getmessages/${PRIVATE_iD}`
          );

          messages.data.result.forEach((message) => {
            if (message.from === USER_ID) {
              const msg = createMessage(message.message, "message-sent");
              messagesDiv.appendChild(msg);
            } else {
              const msg = createMessage(message.message, "message-received");
              messagesDiv.appendChild(msg);
            }
          });

          emptyChatPage.style.display = "none";
          messagesContainer.style.display = "block";

          const lastMessage = messagesDiv.lastChild;
          lastMessage.scrollIntoView();

          ACTIVE_CHAT = true;

          const width = container.offsetWidth;
          if (width + 17 < 700) {
            chatContainer.style.display = "none";
            messagesContainer.style.display = "block";
          }
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
  } catch (err) {
    console.log(err);
  }
})();

// Socket.io

socket.on("connection-event", async (socketId) => {
  const result = await axios.post(
    `${website}/user/updatesocketid`,
    { socketId: socketId },
    { headers: { authorization: token } }
  );
});

socket.on("private-message", ({ msg, senderUserId }) => {
  if (senderUserId == FRIEND_ID) {
    const message = createMessage(msg, "message-received");
    messagesDiv.appendChild(message);
  }

  const lastMessage = messagesDiv.lastChild;
  lastMessage.scrollIntoView();
});

socket.on("user-online", (result) => {
  if (result == FRIEND_ID) {
    const nameActivityRemove = document.getElementById("name-activity");

    details.removeChild(nameActivityRemove);
    const nameActivity = createUserActivity(FRIEND_NAME, "Online");

    details.appendChild(nameActivity);
  }
});

socket.on("user-offline", (result) => {
  if (result == FRIEND_ID) {
    const nameActivityRemove = document.getElementById("name-activity");

    details.removeChild(nameActivityRemove);
    const nameActivity = createUserActivity(
      FRIEND_NAME,
      "last seen a while ago"
    );

    details.appendChild(nameActivity);
  }
});

// -----------------------------------------------------------
// media queries
let x = window.matchMedia("(min-width: 700px) and (max-width: 900px)");

function greaterThan700LessThan900(x) {
  if (x.matches) {
    chatContainer.style.display = "flex";
    chatContainer.style.width = "40%";
    if (ACTIVE_CHAT) {
      messagesContainer.style.display = "block";
      messagesContainer.style.width = "60%";
      emptyChatPage.style.display = "none";
    } else {
      emptyChatPage.style.display = "flex";
      emptyChatPage.style.width = "60%";
      messagesContainer.style.display = "none";
    }
  }
}

x.addEventListener("change", (e) => {
  e.preventDefault();
  greaterThan700LessThan900(x);
});

let y = window.matchMedia("(max-width: 699px)");

function lessThan750(y) {
  if (y.matches) {
    if (ACTIVE_CHAT) {
      messagesContainer.style.display = "block";
      messagesContainer.style.width = "100%";
      chatContainer.style.display = "none";
      emptyChatPage.style.display = "none";
    } else {
      chatContainer.style.display = "flex";
      chatContainer.style.width = "100%";
      messagesContainer.style.display = "none";
      emptyChatPage.style.display = "none";
    }
  }
}

y.addEventListener("change", (e) => {
  e.preventDefault();
  lessThan750(y);
});

let z = window.matchMedia("(min-width: 901px) and (max-width: 1100px)");

function greaterThan900LessThan1100(x) {
  if (x.matches) {
    chatContainer.style.display = "flex";
    chatContainer.style.width = "30%";
    if (ACTIVE_CHAT) {
      messagesContainer.style.display = "block";
      messagesContainer.style.width = "70%";
      emptyChatPage.style.display = "none";
    } else {
      emptyChatPage.style.display = "flex";
      emptyChatPage.style.width = "70%";
      messagesContainer.style.display = "none";
    }
  }
}

z.addEventListener("change", (e) => {
  e.preventDefault();
  greaterThan900LessThan1100(z);
});

let k = window.matchMedia("(min-width: 1101px)");

function greaterThan1100(y) {
  if (y.matches) {
    if (ACTIVE_CHAT) {
      messagesContainer.style.display = "block";
      messagesContainer.style.width = "75%";
      emptyChatPage.style.display = "none";
    } else {
      messagesContainer.style.display = "none";
      emptyChatPage.style.display = "flex";
      emptyChatPage.style.width = "75%";
    }

    chatContainer.style.display = "flex";
    chatContainer.style.width = "25%";
  }
}

k.addEventListener("change", (e) => {
  e.preventDefault();
  greaterThan1100(k);
});

// ----------------------------------------------------

// -------------------------------------------------------------
function createMessage(msg, classname) {
  const message = document.createElement("div");
  message.className = classname;
  message.classList.add("message");
  const p = document.createElement("p");
  p.textContent = msg;
  message.appendChild(p);

  return message;
}
// -----------------------------------------------------------

createChatGroup.addEventListener("click", (e) => {
  e.preventDefault();
  createChatGroupOverlay.style.display = "block";
});

createChatGroupOverlay.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("create-chat-group-overlay-inside")) {
    createChatGroupOverlay.style.display = "none";
  }
});

// -------------------------------------------------------------
sendButton.addEventListener("click", async (e) => {
  e.preventDefault();

  sendMessage(USER_ID);
});
// ------------------------------------------------------------

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// ------------------------------------------------------------

async function sendMessage() {
  const messageInput = document.getElementById("message-input");
  if (messageInput.value != "") {
    const message = messageInput.value;

    // sending event to server
    const token = localStorage.getItem("chat-app-token");
    const socketIdresult = await axios.get(
      `${website}/user/getsocketid/${FRIEND_ID}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    const socketId = socketIdresult.data.socketId;
    socket.emit("send-message", { message, socketId });

    const msgDiv = createMessage(message, "message-sent");
    messagesDiv.appendChild(msgDiv);

    messageInput.value = "";

    const lastMessage = messagesDiv.lastChild;
    lastMessage.scrollIntoView();

    const result = await axios.post(
      `${website}/chat/sendmessage`,
      {
        message: message,
        to: FRIEND_ID,
        privateId: PRIVATE_iD,
      },
      { headers: { authorization: token } }
    );
  }
}

// -------------------------------------------------------------
function createPersonalChat(chatName, id, privateId, button) {
  const chat = document.createElement("div");
  chat.classList.add("chat");
  chat.id = id;
  chat.privateId = privateId;
  const p = document.createElement("p");
  p.textContent = chatName;

  chat.appendChild(p);

  if (button) {
    chat.appendChild(button);
  }

  return chat;
}

// -------------------------------------------------------------

function createUserActivity(user, activity) {
  const nameActivity = document.createElement("div");
  nameActivity.className = "name-activity";
  nameActivity.id = "name-activity";

  const p1 = document.createElement("p");
  p1.id = "chat-name";
  p1.textContent = user;

  const p2 = document.createElement("p");
  p2.id = "activity-status";
  p2.textContent = activity;

  nameActivity.appendChild(p1);
  nameActivity.appendChild(p2);

  return nameActivity;
}

function createSaveChatNameButton() {
  const buttonDiv = document.createElement("div");
  buttonDiv.className = "save-button-div";

  const button = document.createElement("button");
  button.textContent = "+";
  button.className = "save-button";
  button.title = "Save";

  buttonDiv.appendChild(button);

  return buttonDiv;
}

const displaySaveChatNameOverlay = (e) => {
  const mobileInput = document.getElementById("mobile");
  const number = e.target.parentElement.parentElement.firstChild.textContent;
  mobileInput.value = number;
  saveChatNameOverlay.style.display = "block";
};

saveChatNameOverlay.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("save-chat-name-overlay") ||
    e.target.classList.contains("save-chat-name-overlay-inside")
  ) {
    const mobileInput = document.getElementById("mobile");
    mobileInput.value = "";
    saveChatNameOverlay.style.display = "none";
  }
});

saveChatNameButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const chatNameInput = document.getElementById("chat-name-input");

  if (chatNameInput.value != "") {
    const friendName = chatNameInput.value;
    try {
      await axios.post(
        `${website}/chat/savechatname`,
        {
          friendName: friendName,
          privateId: PRIVATE_iD,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
      const requiresChat = document.getElementById(USER_ID);
      requiresChat.firstChild.textContent = friendName;
      alert("Chat name saved.");
      window.location.reload();
    } catch (err) {
      // console.log(err);
      alert("Something went wrong. Chat name not saved try again");
    }

    saveChatNameOverlay.style.display = "none";
  }
});
