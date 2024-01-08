const groupDescriptionOverlay = document.getElementById(
  "group-description-overlay"
);

const groupNameInDescription = document.getElementById(
  "groupname-in-description"
);

const groupMembersDetailsList = document.getElementById(
  "group-members-details-list"
);

const addExitButtons = document.getElementById("add-exit-buttons");

details.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    e.target.classList.contains("back-image") != true &&
    e.target.classList.contains("back") != true
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
          SELECTED_GROUP_MEMBERS[id][1]
        );
        groupMembersDetailsList.appendChild(participant);
      } else {
        const participant = createParticipant(
          SELECTED_GROUP_MEMBERS[id][0],
          SELECTED_GROUP_MEMBERS[id][1]
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

function createParticipant(name, admin) {
  const div = document.createElement("div");
  div.className = "participants-details";

  const p = document.createElement("p");
  p.textContent = name;
  div.appendChild(p);

  const div2 = document.createElement("div");
  div2.className = "admin-remove-details";
  if (IS_ADMIN) {
    if (admin) {
      const p1 = document.createElement("p");
      p1.className = "admin-display";
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
