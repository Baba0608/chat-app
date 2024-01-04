const website = "http://localhost:4000";
const token = localStorage.getItem("chat-app-token");

const privateChat = document.getElementById("private");
const groupChat = document.getElementById("group");

const privateInput = document.getElementById("private-details");
const groupInput = document.getElementById("group-details");

const createPrivateChatButton = document.getElementById(
  "create-private-chat-button"
);

privateChat.addEventListener("click", (e) => {
  e.preventDefault();
  groupChat.classList.remove("active");
  privateChat.classList.add("active");

  groupInput.style.display = "none";
  privateInput.style.display = "block";
});

groupChat.addEventListener("click", (e) => {
  e.preventDefault();
  privateChat.classList.remove("active");
  groupChat.classList.add("active");

  privateInput.style.display = "none";
  groupInput.style.display = "block";
});

createPrivateChatButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const privateChatName = document.getElementById("private-chat-name");
  const privateChatNumber = document.getElementById("private-chat-number");

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

    console.log(result);
  } catch (err) {
    console.log(err);
  }
});
