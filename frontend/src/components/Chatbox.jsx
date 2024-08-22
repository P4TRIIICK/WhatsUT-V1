import React from "react";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import "../components/styles.css";

export const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <div className="chatbox-container">
      <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center",backgroundColor: "#2C2E54" }}>
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  );
};

export default Chatbox;
