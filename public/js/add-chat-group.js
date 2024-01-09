const private = document.getElementById("private");
const group = document.getElementById("group");

const privateInput = document.getElementById("private-details");
const groupInput = document.getElementById("group-details");
const filteredList = document.getElementById("filtered-list");

const createPrivateChatButton = document.getElementById(
  "create-private-chat-button"
);

const addGroupMembers = document.getElementById("add-group-members");
const groupMembersDisplay = document.getElementById("group-members-display");
const createGroupChatButton = document.getElementById(
  "create-group-chat-button"
);

const groupMembersDetailsList = document.getElementById(
  "group-members-details-list"
);

private.addEventListener("click", (e) => {
  e.preventDefault();
  groupChat.classList.remove("active-div");
  privateChat.classList.add("active-div");

  groupInput.style.display = "none";
  privateInput.style.display = "block";
});

group.addEventListener("click", (e) => {
  e.preventDefault();
  privateChat.classList.remove("active-div");
  groupChat.classList.add("active-div");

  privateInput.style.display = "none";
  groupInput.style.display = "block";
});

createPrivateChatButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const privateChatName = document.getElementById("private-chat-name");
  const privateChatNumber = document.getElementById("private-chat-number");

  if (privateChatName.value != "" && privateChatNumber.value != "") {
    try {
      const result = await axios.post(
        `${website}/user/createnewchat`,
        {
          friendName: privateChatName.value,
          friendNumber: privateChatNumber.value,
        },
        {
          headers: { authorization: token },
        }
      );

      createChatGroupOverlay.style.display = "none";
      alert("User created.");
      window.location.reload();
    } catch (err) {
      if (err.message === "Request failed with status code 404") {
        alert("User with the given contact number does not exits on the app");
      } else {
        alert("Something went wrong.");
      }
    }
  }
});

addGroupMembers.addEventListener("keyup", (e) => {
  e.preventDefault();

  filteredList.innerHTML = "";
  const word = addGroupMembers.value.toLowerCase();

  if (word != "") {
    FRIENDS_LIST.forEach((friend) => {
      const friendName = friend.name.toLowerCase();
      if (friendName.includes(word)) {
        const user = createFilteredUser(friend.name, friend.id);
        filteredList.appendChild(user);
      }
    });
  }
});

function createFilteredUser(user, userId) {
  const div = document.createElement("div");
  div.className = "filtered-user";
  div.id = user;
  div.userid = userId;
  div.textContent = user;

  return div;
}

filteredList.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("filtered-user")) {
    if (e.target.userid in SELECTED_USERS === false) {
      SELECTED_USERS[e.target.userid] = e.target.id;
      const selectedUser = createSelectedUser(e.target.id, e.target.userid);
      groupMembersDisplay.appendChild(selectedUser);
    }
  }
});

// removing selected users
groupMembersDisplay.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("remove-user")) {
    const userId = e.target.parentElement.userid;

    const removeEl = e.target.parentElement;

    groupMembersDisplay.removeChild(removeEl);
    delete SELECTED_USERS[userId];

    // console.log(SELECTED_USERS);
  }
});

function createSelectedUser(user, userId) {
  const div = document.createElement("div");
  div.className = "selected-user";
  div.id = user;
  div.userid = userId;

  const p = document.createElement("p");
  p.textContent = user;

  const remove = document.createElement("button");
  remove.className = "remove-user";
  remove.textContent = "X";

  div.appendChild(p);
  div.appendChild(remove);

  return div;
}

createGroupChatButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const groupChatName = document.getElementById("group-chat-name");
  if (groupChatName.value != "" && Object.keys(SELECTED_USERS).length != 0) {
    try {
      const result = await axios.post(
        `${website}/group/creategroup`,
        { SELECTED_USERS, groupName: groupChatName.value },
        {
          headers: {
            authorization: token,
          },
        }
      );

      alert("Group Created....");
      document.getElementById("create-chat-group-overlay").style.display =
        "none";
    } catch (err) {
      console.log(err);
      alert("Something went wrong. Try again.");
    }
  }
});

groupMembersDetailsList.addEventListener("click", async (e) => {
  e.preventDefault();

  if (e.target.classList.contains("make-admin")) {
    if (confirm("Are you sure want to make this participant admin ?")) {
      const userId = e.target.parentElement.parentElement.userId;
      try {
        await axios.patch(
          `${website}/group/updateadmin/${userId}/${GROUP_ID}`,
          {
            admin: true,
          }
        );

        const name =
          e.target.parentElement.parentElement.firstChild.textContent;
        alert(`${name} is an admin now.`);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  }
});
