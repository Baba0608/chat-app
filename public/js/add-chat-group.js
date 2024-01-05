const privateChat = document.getElementById("private");
const groupChat = document.getElementById("group");

const privateInput = document.getElementById("private-details");
const groupInput = document.getElementById("group-details");

const createPrivateChatButton = document.getElementById(
  "create-private-chat-button"
);

const addGroupMembers = document.getElementById("add-group-members");

privateChat.addEventListener("click", (e) => {
  e.preventDefault();
  groupChat.classList.remove("active-div");
  privateChat.classList.add("active-div");

  groupInput.style.display = "none";
  privateInput.style.display = "block";
});

groupChat.addEventListener("click", (e) => {
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

  const word = addGroupMembers.value.toLowerCase();

  if (word != "") {
    FRIENDS_LIST.forEach((friend) => {
      const friendName = friend.name.toLowerCase();
      if (friendName.includes(word)) {
        console.log(friend.name);
      }
    });
  }
});
