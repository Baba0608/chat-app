const groupDescriptionOverlay = document.getElementById(
  "group-description-overlay"
);

const groupNameInDescription = document.getElementById(
  "groupname-in-description"
);

const addParticipansInput = document.getElementById("add-participants-input");
const filteredParticipantsList = document.getElementById(
  "filtered-participants-list"
);

const addParticipansOverlay = document.getElementById(
  "add-participants-overlay"
);

const addedParticipantsDisplay = document.getElementById(
  "added-participants-display"
);

const addParticipansButton = document.getElementById("add-participants-button");

const addExitButtons = document.getElementById("add-exit-buttons");

let SELECTED_PARTICIPANTS = {};

details.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    e.target.classList.contains("back-image") != true &&
    e.target.classList.contains("back") != true &&
    ACTIVE_GROUP === true
  ) {
    groupMembersDetailsList.innerHTML = "";
    groupNameInDescription.textContent = GROUP_NAME;

    if (IS_ADMIN) {
      const addParticipantRemove = document.getElementById("add-participants");

      if (addParticipantRemove) {
        addExitButtons.removeChild(addParticipantRemove);
      }
      const addParticipantButton = addParticipantDiv();
      addExitButtons.appendChild(addParticipantButton);
    }

    // display participants
    const selfPartcipant = createSelfParticipant();
    groupMembersDetailsList.appendChild(selfPartcipant);

    const members = Object.keys(SELECTED_GROUP_MEMBERS);

    members.forEach((id) => {
      const name = inFriendsList(+id, FRIENDS_LIST);
      if (name != false) {
        const participant = createParticipant(
          name,
          SELECTED_GROUP_MEMBERS[id][1],
          id
        );
        groupMembersDetailsList.appendChild(participant);
      } else {
        const participant = createParticipant(
          SELECTED_GROUP_MEMBERS[id][0],
          SELECTED_GROUP_MEMBERS[id][1],
          id
        );
        groupMembersDetailsList.appendChild(participant);
      }
    });

    groupDescriptionOverlay.style.display = "block";
  }
});

groupDescriptionOverlay.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    e.target.classList.contains("group-description-overlay-inside") ||
    e.target.classList.contains("group-description-overlay")
  ) {
    groupDescriptionOverlay.style.display = "none";
  }
});

function addParticipantDiv() {
  const div = document.createElement("div");
  div.className = "add-participants";
  div.id = "add-participants";

  const button = document.createElement("button");
  button.textContent = "Add Participants";
  button.id = "add-participants-button";

  div.appendChild(button);

  return div;
}

function createSelfParticipant() {
  const div = document.createElement("div");
  div.className = "participants-details";

  const p = document.createElement("p");
  p.textContent = "You";

  div.appendChild(p);

  if (IS_ADMIN) {
    const p1 = document.createElement("p");
    p1.className = "admin-display";
    p1.textContent = "admin";

    div.appendChild(p1);
  }

  return div;
}

function createParticipant(name, admin, id) {
  const div = document.createElement("div");
  div.className = "participants-details";
  div.userId = id;

  const p = document.createElement("p");
  p.textContent = name;
  div.appendChild(p);

  const div2 = document.createElement("div");
  div2.className = "admin-remove-details";
  if (IS_ADMIN) {
    if (admin) {
      const p1 = document.createElement("p");
      p1.className = "admin-display click-remove-admin";
      p1.title = "click to remove as admin";
      p1.textContent = "admin";

      div2.appendChild(p1);
    } else {
      const p1 = document.createElement("p");
      p1.className = "make-admin";
      p1.textContent = "Make admin";

      div2.appendChild(p1);
    }

    const p2 = document.createElement("p");
    p2.className = "remove-participant";
    p2.textContent = "remove";
    p2.title = "click to remove user from group.";

    div2.appendChild(p2);

    div.appendChild(div2);
  } else {
    if (admin) {
      const p1 = document.createElement("p");
      p1.className = "admin-display";
      p1.textContent = "admin";
      p1.title = "click to remove as admin";
      div.appendChild(p1);
    }
  }

  return div;
}

groupMembersDetailsList.addEventListener("click", async (e) => {
  e.preventDefault();

  if (e.target.classList.contains("remove-participant")) {
    if (confirm("Are you sure want to remove participant ?")) {
      const userId = e.target.parentElement.parentElement.userId;
      try {
        await axios.delete(`group/remove_participant/${userId}/${GROUP_ID}`);

        alert("User Removed from the group...");
        window.location.reload();
      } catch (err) {}
      console.log(err);
    }
  }
});

addExitButtons.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.parentElement.classList.contains("add-participants")) {
    groupDescriptionOverlay.style.display = "none";
    addParticipansOverlay.style.display = "block";
  }
});

addParticipansInput.addEventListener("keyup", (e) => {
  e.preventDefault();

  filteredParticipantsList.innerHTML = "";
  const word = addParticipansInput.value.toLowerCase();

  if (word != "") {
    FRIENDS_LIST.forEach((friend) => {
      const friendName = friend.name.toLowerCase();
      if (friendName.includes(word)) {
        const user = createFilteredParicipant(friend.name, friend.id);
        filteredParticipantsList.appendChild(user);
      }
    });
  }
});

function createFilteredParicipant(user, userId) {
  const div = document.createElement("div");
  div.className = "filtered-participant";
  div.id = user;
  div.userid = userId;
  div.textContent = user;

  return div;
}

addParticipansOverlay.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("add-participants-overlay-inside")) {
    addParticipansInput.value = "";
    filteredParticipantsList.innerHTML = "";
    addedParticipantsDisplay.innerHTML = "";
    addParticipansOverlay.style.display = "none";
  }
});

filteredParticipantsList.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("filtered-participant")) {
    if (
      e.target.userid in SELECTED_PARTICIPANTS === false &&
      e.target.userid in SELECTED_GROUP_MEMBERS === false
    ) {
      SELECTED_PARTICIPANTS[e.target.userid] = e.target.id;
      const selectedUser = createSelectedParticipant(
        e.target.id,
        e.target.userid
      );
      addedParticipantsDisplay.appendChild(selectedUser);
    }
  }
});

function createSelectedParticipant(user, userId) {
  const div = document.createElement("div");
  div.className = "selected-participant";
  div.id = user;
  div.userid = userId;

  const p = document.createElement("p");
  p.textContent = user;

  const remove = document.createElement("button");
  remove.className = "remove-selected-participant";
  remove.textContent = "X";

  div.appendChild(p);
  div.appendChild(remove);

  return div;
}

addedParticipantsDisplay.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("remove-selected-participant")) {
    const userId = e.target.parentElement.userid;

    const removeEl = e.target.parentElement;

    addedParticipantsDisplay.removeChild(removeEl);
    delete SELECTED_PARTICIPANTS[userId];

    // console.log(SELECTED_USERS);
  }
});

addParticipansButton.addEventListener("click", async (e) => {
  e.preventDefault();

  if (Object.keys(SELECTED_PARTICIPANTS) != 0) {
    try {
      await axios.post(`group/add_participants/${GROUP_ID}`, {
        SELECTED_PARTICIPANTS,
      });

      alert("Participants added to group.");
      window.location.reload();
    } catch (err) {
      alert("Something went wrong. Try again.");
      console.log(err);
    }

    addParticipansOverlay.style.display = "none";
  }
});

groupMembersDetailsList.addEventListener("click", async (e) => {
  e.preventDefault();

  if (e.target.classList.contains("click-remove-admin")) {
    if (confirm("Are you sure want to remove this participant as admin ?")) {
      const userId = e.target.parentElement.parentElement.userId;
      try {
        await axios.patch(`group/update_admin/${userId}/${GROUP_ID}`, {
          admin: false,
        });

        const name =
          e.target.parentElement.parentElement.firstChild.textContent;
        alert(`${name} is removed as admin.`);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  }
});

addExitButtons.addEventListener("click", async (e) => {
  e.preventDefault();

  if (e.target.parentElement.classList.contains("exit-group")) {
    if (confirm("Are you sure want to exit group ?")) {
      try {
        await axios.delete(`group/exit_group/${USER_ID}/${GROUP_ID}`);

        alert("You have exited from the group");
        window.location.reload();
      } catch (err) {
        console.log(err);
        alert("Something went wrong try again.");
      }
    }
  }
});
