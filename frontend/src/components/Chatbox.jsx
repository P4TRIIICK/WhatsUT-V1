import React from "react";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import "../components/styles.css";
import { Box } from "@chakra-ui/react"; // <-- ESTA É A LINHA QUE FALTAVA

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="#2D3748" // Fundo escuro do painel
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;