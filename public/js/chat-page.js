const website = "http://localhost:4000";

const socket = io(`${website}`);

const sendButton = document.getElementById("send-button");
const messagesDiv = document.getElementById("messages");
const createChatGroup = document.getElementById("create-chat-group");
const chatList = document.getElementById("chat-list");

const container = document.getElementById("container");
const chatContainer = document.getElementById("chat-container");
const messagesContainer = document.getElementById("messages-container");
const emptyChatPage = document.getElementById("empty-chat-page");
const details = document.getElementById("details");

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
      FRIENDS_LIST.push(friend.friendId);
      if (friend.friendname != "") {
        const chat = createPersonalChat(
          friend.friendname,
          friend.friendId,
          friend.privateId
        );
        chatList.appendChild(chat);
      } else {
        const chat = createPersonalChat(
          friend.user.mobilenumber,
          friend.friendId,
          friend.privateId
        );
        chatList.appendChild(chat);
      }
    });

    // console.log(FRIENDS_LIST);

    socket.emit("friends-list", FRIENDS_LIST);

    const chats = document.querySelectorAll(".chat");
    chats.forEach((chat) => {
      chat.addEventListener("click", async (e) => {
        e.preventDefault();

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

        socket.on("activity-result", (result) => {
          const nameActivityRemove = document.getElementById("name-activity");

          if (nameActivityRemove) {
            details.removeChild(nameActivityRemove);
          }

          if (result) {
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

        console.log(messages);
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
  } catch (err) {
    console.log(err);
  }
})();

// Socket.io

socket.on("connection-event", async (msg) => {
  const result = await axios.post(
    `${website}/user/updatesocketid`,
    { socketId: msg },
    { headers: { authorization: token } }
  );
});

socket.on("private-message", (msg) => {
  const message = createMessage(msg, "message-received");
  messagesDiv.appendChild(message);
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
const x = window.matchMedia("(min-width: 750px)");

function greaterThan750(x) {
  if (x.matches) {
    if (ACTIVE_CHAT) {
      messagesContainer.style.display = "block";
      emptyChatPage.style.display = "none";
    } else {
      emptyChatPage.style.display = "flex";
      messagesContainer.style.display = "none";
    }

    chatContainer.style.display = "block";
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
      emptyChatPage.style.display = "none";
    }
  }
}

y.addEventListener("change", (e) => {
  e.preventDefault();
  lessThan750(y);
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
  window.location.assign("./add-chat-group.html");
});

// -------------------------------------------------------------
sendButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const messageInput = document.getElementById("message-input");

  if (messageInput.value != "") {
    const message = messageInput.value;

    // sending event to server
    socket.emit("send-message", { message, SOCKET_ID });

    const msgDiv = createMessage(message, "message-sent");
    messagesDiv.appendChild(msgDiv);

    messageInput.value = "";

    const token = localStorage.getItem("chat-app-token");
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
});

// -------------------------------------------------------------
function createPersonalChat(chatName, id, privateId) {
  const chat = document.createElement("div");
  chat.classList.add("chat");
  chat.id = id;
  chat.privateId = privateId;
  const p = document.createElement("p");
  p.textContent = chatName;

  chat.appendChild(p);

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
