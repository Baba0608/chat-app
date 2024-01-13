// [{id: id , name: username , privateid: privateId}]

searchBox.addEventListener("keyup", (e) => {
  e.preventDefault();

  const data = searchBox.value;

  if (CHAT_LIST_DISPLAY) {
    // filter freinds list
    chatList.innerHTML = "";
    if (data === "") {
      FRIENDS_LIST.forEach((friend) => {
        const chat = createPersonalChat(
          friend.name,
          friend.id,
          friend.privateid
        );
        chatList.appendChild(chat);
      });

      return;
    }

    const filteredList = FRIENDS_LIST.filter((friend) => {
      return friend.name.toLowerCase().includes(data.toLowerCase());
    });

    filteredList.forEach((friend) => {
      const chat = createPersonalChat(friend.name, friend.id, friend.privateid);
      chatList.appendChild(chat);
    });
  } else {
    // filter group list
    groupChatList.innerHTML = "";
    if (data === "") {
      GROUP_LIST.forEach((group) => {
        const groupDiv = createGroupChatDiv(group.groupname, group.groupId);
        groupChatList.appendChild(groupDiv);
      });

      return;
    }

    // console.log(GROUP_LIST);
    const filteredList = GROUP_LIST.filter((group) => {
      return group.groupname.toLowerCase().includes(data.toLowerCase());
    });

    // console.log(filteredList);
    filteredList.forEach((group) => {
      const groupDiv = createGroupChatDiv(group.groupname, group.groupId);
      groupChatList.appendChild(groupDiv);
    });
  }
});
