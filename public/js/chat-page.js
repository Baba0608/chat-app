const messagesDiv = document.getElementById("messages-container");

(function () {
  const joinedMessage = createMessage("You Joined");
  messagesDiv.appendChild(joinedMessage);

  const msg1 = createMessage("Hiii hello Good morning.");
  messagesDiv.appendChild(msg1);
})();

function createMessage(msg) {
  const message = document.createElement("div");
  message.className = "message";
  message.textContent = msg;

  return message;
}
