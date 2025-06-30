import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { Box, Stack, Text, Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import "./styles.css";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = useCallback(async () => {
    try {
      if (!user || !user.token) return;
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
  }, [user, setChats, toast]);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setLoggedUser(JSON.parse(userInfo));
    }
    if (user) {
        fetchChats();
    }
  }, [fetchAgain, user, fetchChats]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#2D3748"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
    >
      <Box
        pb={3} px={3} fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Montserrat" display="flex" w="100%"
        justifyContent="space-between" alignItems="center" color="white"
      >
        Minhas Conversas
        <GroupChatModal>
          <Button
            display="flex" fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />} colorScheme="teal"
          >
            Novo Grupo
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex" flexDir="column" p={3} bg="#2D3748"
        w="100%" h="100%" borderRadius="lg" overflowY="hidden"
      >
        {chats && loggedUser ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#4A5568"}
                color={selectedChat === chat ? "white" : "gray.200"}
                px={3} py={2} borderRadius="lg" key={chat._id}
                _hover={{
                  background: selectedChat === chat ? "#38B2AC" : "#2D3748"
                }}
              >
                <Text fontWeight={selectedChat === chat ? "bold" : "normal"}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {/* A MUDANÇA CRUCIAL ESTÁ AQUI ABAIXO */}
                {chat.latestMessage && (
                  <Text fontSize="xs" color={selectedChat === chat ? "white" : "gray.400"}>
                    <b>{chat.latestMessage.sender.name} : </b>
                    {/* Verificamos se 'content' existe ANTES de tentar ler o 'length' */}
                    {chat.latestMessage.content
                      ? chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content
                      : "Enviou um anexo" // Fallback para mensagens sem texto
                    }
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;