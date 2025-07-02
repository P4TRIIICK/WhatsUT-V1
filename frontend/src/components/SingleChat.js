import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { FormControl } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, Text } from '@chakra-ui/layout';
import { IconButton, Spinner, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { IoSend } from "react-icons/io5";
import Lottie from 'react-lottie';
import animationData from '../animations/typing.json';
import { ChatState } from '../Context/ChatProvider';
import ScrollableChat from './ScrollableChat';
import { getSender } from '../config/ChatLogics';
// ADIÇÃO 1: Importando o modal de informações do grupo de volta
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";

let socket;
let selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const messagesEndRef = useRef(null);
  
  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Ocorreu um erro!",
        description: "Falha ao carregar as mensagens",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  }, [selectedChat, user.token, toast]);

  useEffect(() => {
    socket = io();
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => socket.disconnect();
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, fetchAgain, fetchMessages]);

  useEffect(() => {
    const handleNewMessage = (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // Lógica de notificação
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
      
      const updatedChats = chats.map(chat => 
        chat._id === newMessageReceived.chat._id 
          ? { ...chat, latestMessage: newMessageReceived } 
          : chat
      );
      updatedChats.sort((a, b) => {
        if (!a.latestMessage) return 1;
        if (!b.latestMessage) return -1;
        return new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt);
      });
      setChats(updatedChats);
    };

    socket.on("message received", handleNewMessage);
    return () => socket.off("message received", handleNewMessage);
  }, [chats, setChats]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` } };
        const contentToSend = newMessage;
        setNewMessage("");
        const { data } = await axios.post("/api/message", { content: contentToSend, chatId: selectedChat._id }, config);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Erro ao enviar a mensagem", status: "error", duration: 5000,
          isClosable: true, position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected || typing) return;
    setTyping(true);
    socket.emit("typing", selectedChat._id);
    
    setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, 3000);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w="100%"
            fontFamily="Montserrat" display="flex" justifyContent="space-between"
            alignItems="center" color="white"
          >
            <IconButton
              d={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")} variant="ghost" colorScheme="teal"
            />
            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName.toUpperCase()}
                {/* ADIÇÃO 2: Renderizando o componente do modal aqui */}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            ) : (
              <>
                {getSender(user, selectedChat.users)}
                {/* Se quiser adicionar o ProfileModal para chats individuais, seria aqui */}
              </>
            )}
          </Text>
          <Box
            display="flex" flexDir="column" justifyContent="flex-end" p={3}
            bg="#1A202C" w="100%" h="100%" borderRadius="lg" overflowY="hidden"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" color="teal.500"/>
            ) : (
              <Box flex="1" overflowY="auto" className="messages">
                <ScrollableChat messages={messages} />
                <div ref={messagesEndRef} />
              </Box>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {istyping ? (<div> <Lottie options={{ loop: true, autoplay: true, animationData }} height={40} width={70} style={{ marginBottom: 15, marginLeft: 0 }} /> </div>) : (<></>)}
              <InputGroup>
                <Input
                  variant="filled" bg="gray.700" color="white"
                  _hover={{ bg: "gray.600" }} _placeholder={{ color: "gray.400" }}
                  focusBorderColor="teal.500" placeholder="Digite uma mensagem.."
                  onChange={typingHandler} value={newMessage}
                />
                <InputRightElement>
                   <IconButton aria-label="Enviar" icon={<IoSend />} colorScheme="teal" onClick={sendMessage} />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Montserrat" color="gray.400">
            Clique em um contato para iniciar a conversa!
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;