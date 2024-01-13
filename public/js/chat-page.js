const socket = io();

const sendButton = document.getElementById("send-button");
const messagesDiv = document.getElementById("messages");
const createChatGroup = document.getElementById("create-chat-group");
const chatList = document.getElementById("chat-list");
const groupChatList = document.getElementById("group-chat-list");

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

const privateChat = document.getElementById("privatechat");
const groupChat = document.getElementById("groupchat");

const searchBox = document.getElementById("chat-name");

const backArrow = document.getElementById("back-image");
let ACTIVE_CHAT = false;
let ACTIVE_GROUP = false;
let CHAT_LIST_DISPLAY = true;
let USER_ID = null;
let USER_NAME = null;
let MOBILE_NUMBER = null;
let SOCKET_ID = null;
let FRIEND_ID = null;
let GROUP_ID = null;
let IS_ADMIN = false;
let GROUP_NAME = null;
let FRIEND_NAME = null;
let PRIVATE_ID = null;
let FRIENDS_LIST = []; // [{id: id , name: username , privateid: privateId}]
let GROUP_LIST = []; // [{groupId: groupId , groupName: groupName}]
let SELECTED_GROUP_MEMBERS = {};
let SELECTED_USERS = {}; // while creating group.

const token = localStorage.getItem("chat-app-token");

(async function () {
  // function
  try {
    const result = await axios.get(`chat/getchats`, {
      headers: { authorization: token },
    });

    USER_ID = result.data.userId;
    USER_NAME = result.data.userName;
    MOBILE_NUMBER = result.data.mobileNumber;

    socket.emit("connected-user", USER_ID);
    result.data.result.forEach((friend) => {
      addPersonalChatToChatList(friend);
    });

    socket.emit("friends-list", FRIENDS_LIST);

    // get groups
    const groups = await axios.get(`group/getgroups`, {
      headers: { authorization: token },
    });

    const groupDetailsArr = groups.data.result[0].groupnames;
    GROUP_LIST = [...groupDetailsArr];
    groupDetailsArr.forEach((group) => {
      const groupDiv = createGroupChatDiv(group.groupname, group.groupId);
      groupChatList.appendChild(groupDiv);
    });

    // event for back arrow.
    const chats = document.querySelectorAll(".chat");
    const groupChats = document.querySelectorAll(".group-chat-div");
    backArrow.addEventListener("click", (e) => {
      e.preventDefault();

      if (ACTIVE_CHAT) {
        removeActiveClass(chats);
        ACTIVE_CHAT = false;
      } else {
        removeActiveClass(groupChats);
        ACTIVE_GROUP = false;
      }
      messagesContainer.style.display = "none";
      chatContainer.style.display = "flex";
      chatContainer.style.width = "100%";
    });
  } catch (err) {
    console.log(err);
  }
})();

// Socket.io

socket.on("connection-event", async (socketId) => {
  const result = await axios.post(
    `user/updatesocketid`,
    { socketId: socketId },
    { headers: { authorization: token } }
  );
});

socket.on("send-number", ({ msg, senderUserId }) => {
  socket.emit("sending-number", {
    msg,
    senderUserId, // my id
    mobile: MOBILE_NUMBER, // friend number
    userId: USER_ID, // friend userId
    privateId: getPrivateId(senderUserId),
  });
});

socket.on("receiving-first-msg", ({ mobile, userId, privateId }) => {
  FRIENDS_LIST.push({
    id: userId,
    name: mobile,
    privateid: privateId,
  });
  const saveButton = createSaveChatNameButton();
  const chat = createPersonalChat(mobile, userId, privateId, saveButton);
  chatList.appendChild(chat);
});

socket.on("private-message", ({ msg, senderUserId }) => {
  const div = document.getElementById(senderUserId);
  if (div) {
    chatList.removeChild(div);
    chatList.prepend(div);
  }

  const name = inFriendsList(senderUserId, FRIENDS_LIST);
  if (name === false) {
    socket.emit("first-message", { senderUserId, msg, USER_ID });
  }

  if (senderUserId == FRIEND_ID) {
    const loadingMsgRemove = document.getElementById("loading");
    if (loadingMsgRemove) {
      const div = loadingMsgRemove.parentElement.parentElement;
      console.log(div);
      messagesDiv.removeChild(div);
    }
    const message = createMessage(msg, "message-received");
    messagesDiv.appendChild(message);

    const lastMessage = messagesDiv.lastChild;
    lastMessage.scrollIntoView();
  }
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

socket.on("message-in-group", ({ msg, groupId, senderId, senderNumber }) => {
  const loadingMsgRemove = document.getElementById("loading");
  if (loadingMsgRemove) {
    const div = loadingMsgRemove.parentElement.parentElement.parentElement;
    messagesDiv.removeChild(div);
  }

  if (groupId == GROUP_ID) {
    const id = +senderId;
    const name = inFriendsList(id, FRIENDS_LIST);
    if (name != false) {
      const message = createReceivedGroupMessage(msg, name);
      messagesDiv.appendChild(message);
    } else {
      const message = createReceivedGroupMessage(msg, senderNumber);
      messagesDiv.appendChild(message);
    }

    const lastMessage = messagesDiv.lastChild;
    if (lastMessage) {
      lastMessage.scrollIntoView();
    }
  }
});

// -----------------------------------------------------------
// media queries
let x = window.matchMedia("(min-width: 700px) and (max-width: 900px)");

function greaterThan700LessThan900(x) {
  if (x.matches) {
    chatContainer.style.display = "flex";
    chatContainer.style.width = "40%";
    if (ACTIVE_CHAT || ACTIVE_GROUP) {
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
    if (ACTIVE_CHAT || ACTIVE_GROUP) {
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
    if (ACTIVE_CHAT || ACTIVE_GROUP) {
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
    if (ACTIVE_CHAT || ACTIVE_GROUP) {
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

function getPrivateId(id) {
  let privateId;
  FRIENDS_LIST.forEach((friend) => {
    if (friend.id === id) {
      privateId = friend.privateid;
    }
  });

  return privateId;
}

// displaying chat of a particular friend
chatList.addEventListener("click", async (e) => {
  e.preventDefault();

  if (
    e.target.classList.contains("chat") ||
    e.target.parentElement.classList.contains("chat")
  ) {
    const chats = document.querySelectorAll(".chat");
    const groupChats = document.querySelectorAll(".group-chat-div");

    const chat = e.target.classList.contains("chat")
      ? e.target
      : e.target.parentElement;

    removeActiveClass(groupChats);
    removeActiveClass(chats);
    chat.classList.add("active");

    displayChatActivityDiv(chat);

    // get private chat messages from database.
    const messages = await axios.get(`chat/getmessages/${PRIVATE_ID}`);

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
    if (lastMessage) {
      lastMessage.scrollIntoView({ block: "nearest" });
    }

    ACTIVE_CHAT = true;
    ACTIVE_GROUP = false;

    const width = container.offsetWidth;
    if (width + 17 < 700) {
      chatContainer.style.display = "none";
      messagesContainer.style.display = "block";
    }
  }
});

groupChatList.addEventListener("click", async (e) => {
  e.preventDefault();

  if (
    e.target.classList.contains("group-chat-div") ||
    e.target.parentElement.classList.contains("group-chat-div")
  ) {
    const chats = document.querySelectorAll(".chat");
    const groupChats = document.querySelectorAll(".group-chat-div");

    const groupChat = e.target.classList.contains("group-chat-div")
      ? e.target
      : e.target.parentElement;
    removeActiveClass(groupChats);
    removeActiveClass(chats);
    groupChat.classList.add("active");

    SELECTED_GROUP_MEMBERS = {};
    displayGroupActivityHeader(groupChat);
    const groupId = groupChat.groupid;
    GROUP_ID = groupId;
    getMessagesInGroups(groupId);
  }
});

chatList.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("save-button")) {
    USER_ID = e.target.parentElement.parentElement.id;
    PRIVATE_ID = e.target.parentElement.parentElement.privateId;
    displaySaveChatNameOverlay(e);
  }
});
// -------------------------------------------------------------
function createMessage(msg, classname) {
  const message = document.createElement("div");
  message.className = classname;
  message.classList.add("message");
  const p = document.createElement("p");

  p.innerHTML = msg;
  message.appendChild(p);

  return message;
}
// ---------------------------------------------

const inFriendsList = (id, FRIENDS_LIST) => {
  let ans = false;
  FRIENDS_LIST.forEach((friend) => {
    if (friend.id === id) {
      ans = friend.name;
    }
  });

  return ans;
};

// -----------------------------------------------------------

createChatGroup.addEventListener("click", (e) => {
  e.preventDefault();
  createChatGroupOverlay.style.display = "block";
});

createChatGroupOverlay.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("create-chat-group-overlay-inside")) {
    createChatGroupOverlay.style.display = "none";
    document.getElementById("group-chat-name").value = "";
    document.getElementById("add-group-members").value = "";
    document.getElementById("private-chat-name").value = "";
    document.getElementById("private-chat-number").value = "";
    document.getElementById("filtered-list").innerHTML = "";
    document.getElementById("group-members-display").innerHTML = "";
    SELECTED_USERS = {};
  }
});

// -------------------------------------------------------------
sendButton.addEventListener("click", async (e) => {
  e.preventDefault();
  if (ACTIVE_CHAT) {
    sendMessagePrivate();
  } else {
    sendMessageIngroup();
  }
});
// ------------------------------------------------------------

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (ACTIVE_CHAT) {
      sendMessagePrivate();
    } else {
      sendMessageIngroup();
    }
  }
});

// ------------------------------------------------------------

async function sendMessagePrivate() {
  const messageInput = document.getElementById("message-input");
  const mediaFile = document.getElementById("my-file");

  if (messageInput.value != "" || mediaFile.value != "") {
    if (mediaFile.value != "") {
      const mediaType = mediaFile.files[0].type.split("/")[0];
      const fileName = mediaFile.files[0].name;
      const mediaTypeExt = mediaFile.files[0].type;

      const loading = `<div class="loading" id="loading"></div>`;
      const loadingMsg = createMessage(loading, "message-sent");
      messagesDiv.appendChild(loadingMsg);

      socket.emit("send-message", { message: loading, FRIEND_ID });

      // display at top
      const div = document.getElementById(FRIEND_ID);

      chatList.removeChild(div);
      chatList.prepend(div);
      try {
        const result = await sendFile(mediaFile);
        let msg;
        if (mediaType === "image") {
          msg = `<img src="${result}" class="media-file-image">`;
        } else if (mediaType === "video") {
          msg = `<video src="${result}" controls preload="none" class="media-file-video"></video>`;
        } else {
          msg = `<a href="${result}" >${fileName}</a>`;
        }

        const imageResult = await axios.post(
          `chat/sendmessage`,
          {
            message: msg,
            to: FRIEND_ID,
            privateId: PRIVATE_ID,
          },
          { headers: { authorization: token } }
        );

        const loadingMsgRemove = document.getElementById("loading");
        if (loadingMsgRemove) {
          const div = loadingMsgRemove.parentElement.parentElement;
          console.log(div);
          messagesDiv.removeChild(div);
        }

        const msgDiv = createMessage(msg, "message-sent");
        messagesDiv.appendChild(msgDiv);
        socket.emit("send-message", { message: msg, FRIEND_ID });
      } catch (err) {
        console.log(err);
        const loadingMsgRemove = document.getElementById("loading");
        if (loadingMsgRemove) {
          const div = loadingMsgRemove.parentElement.parentElement;
          console.log(div);
          messagesDiv.removeChild(div);
        }
        alert("Something went wrong..");
      }
    }

    const message = messageInput.value;
    // sending event to server
    if (messageInput.value != "") {
      const token = localStorage.getItem("chat-app-token");

      socket.emit("send-message", { message, FRIEND_ID });

      //display at top
      const div = document.getElementById(FRIEND_ID);

      chatList.removeChild(div);
      chatList.prepend(div);
      /////

      const msgDiv = createMessage(message, "message-sent");

      messagesDiv.appendChild(msgDiv);

      messageInput.value = "";

      const lastMessage = messagesDiv.lastChild;
      lastMessage.scrollIntoView();

      const result = await axios.post(
        `chat/sendmessage`,
        {
          message: message,
          to: FRIEND_ID,
          privateId: PRIVATE_ID,
        },
        { headers: { authorization: token } }
      );
    }
  }
}

// -------------------------------------------------------------
// adding the personal chats to chatlist div
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

// adding groups to list.
function createGroupChatDiv(groupName, groupId) {
  const div = document.createElement("div");
  div.className = "group-chat-div";
  div.id = groupName;
  div.groupid = groupId;

  div.textContent = groupName;

  return div;
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

function createGroupHeader(groupName, users) {
  const nameActivity = document.createElement("div");
  nameActivity.className = "name-activity group-header";
  nameActivity.id = "name-activity";

  const p1 = document.createElement("p");
  p1.id = "group-name";
  p1.textContent = groupName;
  GROUP_NAME = groupName;

  const p2 = document.createElement("p");
  p2.textContent = createGroupMembersList(users);

  nameActivity.appendChild(p1);
  nameActivity.appendChild(p2);

  return nameActivity;
}

const createGroupMembersList = (users) => {
  let groupMembers = "You , ";
  const members = Object.keys(users);
  if (members.length <= 2) {
    for (let i = 0; i < members.length; i++) {
      const name = inFriendsList(+members[i], FRIENDS_LIST);
      if (name != false) {
        if (i != members.length - 1) {
          groupMembers += `${name} , `;
        } else {
          groupMembers += name;
        }
      } else {
        if (i != members.length - 1) {
          groupMembers += `${SELECTED_GROUP_MEMBERS[members[i]][0]} , `;
        } else {
          groupMembers += SELECTED_GROUP_MEMBERS[members[i]][0];
        }
      }
    }
  } else {
    for (let i = 0; i < 2; i++) {
      const name = inFriendsList(+members[i], FRIENDS_LIST);
      if (name != false) {
        groupMembers += `${name} , `;
      } else {
        groupMembers += `${SELECTED_GROUP_MEMBERS[members[i]][0]} , `;
      }
    }

    groupMembers += "...";
  }

  return groupMembers;
};

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
        `chat/savechatname`,
        {
          friendName: friendName,
          privateId: PRIVATE_ID,
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

privateChat.addEventListener("click", (e) => {
  e.preventDefault();
  searchBox.value = "";
  CHAT_LIST_DISPLAY = true;
  groupChatList.style.display = "none";
  chatList.style.display = "block";

  groupChat.classList.remove("active-div");
  privateChat.classList.add("active-div");

  // removing the searching effect.
  groupChatList.innerHTML = "";
  GROUP_LIST.forEach((group) => {
    const groupDiv = createGroupChatDiv(group.groupname, group.groupId);
    groupChatList.appendChild(groupDiv);
  });
});

groupChat.addEventListener("click", (e) => {
  e.preventDefault();
  searchBox.value = "";
  CHAT_LIST_DISPLAY = false;
  chatList.style.display = "none";
  groupChatList.style.display = "block";

  privateChat.classList.remove("active-div");
  groupChat.classList.add("active-div");

  // removing the search effect
  chatList.innerHTML = "";
  FRIENDS_LIST.forEach((friend) => {
    const chat = createPersonalChat(friend.name, friend.id, friend.privateid);
    chatList.appendChild(chat);
  });
});

// function for adding personal chats to chatlist.
function addPersonalChatToChatList(friend) {
  FRIENDS_LIST.push({
    id: friend.friendId,
    name:
      friend.friendname != "" ? friend.friendname : friend.user.mobilenumber,
    privateid: friend.privateId,
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
}

// removing active class to all the chats.
function removeActiveClass(chats) {
  chats.forEach((chat) => {
    chat.classList.remove("active");
  });
}

async function displayChatActivityDiv(chat) {
  messagesDiv.innerHTML = "";
  const name = chat.firstChild.textContent;

  GROUP_ID = null;
  SELECTED_GROUP_MEMBERS = {};

  FRIEND_ID = chat.id;
  PRIVATE_ID = chat.privateId;
  FRIEND_NAME = name;

  const result = await axios.get(`user/getsocketid/${FRIEND_ID}`, {
    headers: {
      authorization: token,
    },
  });

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
      const nameActivity = createUserActivity(name, "last seen a while ago");

      details.appendChild(nameActivity);
    }
  });
}

async function displayGroupActivityHeader(group) {
  messagesDiv.innerHTML = "";
  const name = group.firstChild.textContent;

  FRIEND_ID = null;
  ACTIVE_CHAT = null;
  FRIEND_NAME = null;

  GROUP_ID = group.groupid;

  const result = await axios.get(`group/getgroupmembers/${GROUP_ID}`, {
    headers: {
      authorization: token,
    },
  });
  IS_ADMIN = result.data.admin[0].groupnames[0].groupmembers.admin;
  result.data.result.forEach((user) => {
    const admin = user.groupnames[0].groupmembers.admin;
    SELECTED_GROUP_MEMBERS[user.id] = [user.mobilenumber, admin];
  });

  const nameActivityRemove = document.getElementById("name-activity");

  if (nameActivityRemove) {
    details.removeChild(nameActivityRemove);
  }

  const groupHeader = createGroupHeader(name, SELECTED_GROUP_MEMBERS);
  details.appendChild(groupHeader);
}

// event to get messages in groupchats

async function getMessagesInGroups(groupId) {
  const messages = await axios.get(`group/getmessages/${groupId}`);

  messages.data.result.forEach((message) => {
    if (message.userId === USER_ID) {
      const msg = createSendGroupMessage(message.message);
      messagesDiv.appendChild(msg);
    } else {
      const name = inFriendsList(message.userId, FRIENDS_LIST);
      if (name != false) {
        const msg = createReceivedGroupMessage(message.message, name);
        messagesDiv.appendChild(msg);
      } else {
        const msg = createReceivedGroupMessage(
          message.message,
          message.user.mobilenumber
        );
        messagesDiv.appendChild(msg);
      }
    }
  });

  emptyChatPage.style.display = "none";
  messagesContainer.style.display = "block";

  const lastMessage = messagesDiv.lastChild;
  if (lastMessage) {
    lastMessage.scrollIntoView();
  }

  ACTIVE_CHAT = false;
  ACTIVE_GROUP = true;

  const width = container.offsetWidth;
  if (width + 17 < 700) {
    chatContainer.style.display = "none";
    messagesContainer.style.display = "block";
  }
}

function createSendGroupMessage(message) {
  const groupMessageDiv = document.createElement("div");
  groupMessageDiv.className = "group-message-div-sent";

  const div = document.createElement("div");
  div.className = "group-message";

  const p1 = document.createElement("p");
  p1.className = "message-display-name-sent";
  p1.textContent = "You";

  const p2 = document.createElement("p");
  p2.innerHTML = message;

  div.appendChild(p1);
  div.appendChild(p2);

  groupMessageDiv.appendChild(div);
  return groupMessageDiv;
}

function createReceivedGroupMessage(message, name) {
  const groupMessageDiv = document.createElement("div");
  groupMessageDiv.className = "group-message-div-received";

  const div = document.createElement("div");
  div.className = "group-message";

  const p1 = document.createElement("p");
  p1.className = "message-display-name-received";
  p1.textContent = name;

  const p2 = document.createElement("p");
  p2.innerHTML = message;

  div.appendChild(p1);
  div.appendChild(p2);

  groupMessageDiv.appendChild(div);
  return groupMessageDiv;
}

async function sendMessageIngroup() {
  const messageInput = document.getElementById("message-input");
  const mediaFile = document.getElementById("my-file");

  if (messageInput.value != "" || mediaFile.value != "") {
    if (mediaFile.value != "") {
      const mediaType = mediaFile.files[0].type.split("/")[0];
      const fileName = mediaFile.files[0].name;

      const loading = `<div class="loading" id="loading"></div>`;
      const loadingMsg = createSendGroupMessage(loading);
      messagesDiv.appendChild(loadingMsg);
      socket.emit("send-group-message", {
        message: loading,
        SELECTED_GROUP_MEMBERS,
        GROUP_ID,
        USER_ID,
      });
      const result = await sendFile(mediaFile);
      console.log(result);
      let msg;
      if (mediaType === "image") {
        msg = `<img src="${result}" class="media-file-image">`;
      } else if (mediaType === "video") {
        msg = `<video src="${result}" controls preload="none" class="media-file-video"></video>`;
      } else {
        msg = `<a href="${result}" >${fileName}</a>`;
      }

      await axios.post(
        `group/sendmessage/${GROUP_ID}`,
        { message: msg },
        {
          headers: {
            authorization: token,
          },
        }
      );

      const loadingMsgRemove = document.getElementById("loading");
      if (loadingMsgRemove) {
        const div = loadingMsgRemove.parentElement.parentElement.parentElement;
        messagesDiv.removeChild(div);
      }

      const msgDiv = createSendGroupMessage(msg);
      messagesDiv.appendChild(msgDiv);
      socket.emit("send-group-message", {
        message: msg,
        SELECTED_GROUP_MEMBERS,
        GROUP_ID,
        USER_ID,
      });
    }

    if (messageInput.value != "") {
      const message = messageInput.value;

      try {
        // store in database.
        await axios.post(
          `group/sendmessage/${GROUP_ID}`,
          { message: message },
          {
            headers: {
              authorization: token,
            },
          }
        );

        socket.emit("send-group-message", {
          message,
          SELECTED_GROUP_MEMBERS,
          GROUP_ID,
          USER_ID,
        });

        const msg = createSendGroupMessage(message);
        messagesDiv.appendChild(msg);
      } catch (err) {
        console.log(err);
      }
      messageInput.value = "";

      const lastMessage = messagesDiv.lastChild;
      if (lastMessage) {
        lastMessage.scrollIntoView();
      }
    }
  }
}
