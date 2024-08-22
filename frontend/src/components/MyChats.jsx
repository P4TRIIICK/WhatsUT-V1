import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { ChatState } from "../Context/ChatProvider";
import { Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import "./styles.css";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className="mychats-container">
      <div className="top-chats">
        <h2 className="my-chats-text">Minhas Conversas</h2>
        <GroupChatModal>
          <Button className="btn-add-gp" rightIcon={<AddIcon />}>Novo Grupo</Button>
        </GroupChatModal>
      </div>
      <div className="chat-list">
        {chats ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`chat-item ${selectedChat === chat ? "selected" : ""}`}
            >
              <div>
                {!chat.isGroupChat ? (
                  <b className="chat-name">{getSender(loggedUser, chat.users)}</b>
                ) : (
                  <b className="chat-name">{chat.chatName}</b>
                )}
              </div> 
              {chat.latestMessage && (
                <div className="latest-message">
                  <b>{chat.latestMessage.sender.name}:</b> {chat.latestMessage.content}
                </div>
              )}
            </div>
          ))
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
