import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Button } from '@chakra-ui/react';
import { Box, Text } from '@chakra-ui/layout';
import { IconButton, Spinner, useToast } from '@chakra-ui/react';
import { ArrowBackIcon, AttachmentIcon } from '@chakra-ui/icons';
import { FaPlay } from "react-icons/fa6";
import ProfileModal from './miscellaneous/ProfileModal';
import ScrollableChat from './ScrollableChat';
import Lottie from 'react-lottie';
import animationData from '../animations/typing.json';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import { ChatState } from '../Context/ChatProvider';
import { getSender, getSenderFull } from '../config/ChatLogics';

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const { selectedChat, setSelectedChat, user, setChats, chats } = ChatState();
  const messagesEndRef = useRef(null);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    socket = io();
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // Not in the selected chat, so no need to update the messages array
        return;
      }

      let formattedMessage = { ...newMessageReceived };

      if (formattedMessage.filePath) {
        formattedMessage.content = (
          <div>
            File: <a href={formattedMessage.filePath} download>{formattedMessage.fileName}</a>
          </div>
        );
      }

      setMessages((prevMessages) => [...prevMessages, formattedMessage]);

      // Update the latest message in chats and move the chat to the top of the list
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) =>
          chat._id === newMessageReceived.chat._id ? { ...chat, latestMessage: newMessageReceived } : chat
        );

        // Move the updated chat to the top of the list
        const chatIndex = updatedChats.findIndex(chat => chat._id === newMessageReceived.chat._id);
        const [movedChat] = updatedChats.splice(chatIndex, 1);
        return [movedChat, ...updatedChats];
      });
    });
  }, [setChats]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error Occurred!',
        description: 'Failed to Load the Messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      console.error('Failed to fetch messages:', error);
    }
  };

  const fileChangeHandler = (event) => {
    setFile(event.target.files[0]);
    sendFileMessage(event.target.files[0]);
  };

  const sendFileMessage = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('chatId', selectedChat._id);

        const fileConfig = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        };

        const response = await axios.post('/api/message/file', formData, fileConfig);
        const data = response.data;
        setFile(null);

        socket.emit('new message', data);
        setMessages((prevMessages) => [...prevMessages, data]);

        // Update the latest message in chats and move the chat to the top of the list
        setChats((prevChats) => {
          const updatedChats = prevChats.map((chat) =>
            chat._id === data.chat._id ? { ...chat, latestMessage: data } : chat
          );

          // Move the updated chat to the top of the list
          const chatIndex = updatedChats.findIndex(chat => chat._id === data.chat._id);
          const [movedChat] = updatedChats.splice(chatIndex, 1);
          return [movedChat, ...updatedChats];
        });
      } catch (error) {
        console.error('Error sending file message:', error.response?.data || error.message);
        toast({
          title: 'Error Occurred!',
          description: 'Failed to send the file',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  const sendMessage = async (event) => {
    if (newMessage || file) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };

        let data;

        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('chatId', selectedChat._id);

          const fileConfig = {
            headers: {
              Authorization: `Bearer ${user.token}`,
              'Content-Type': 'multipart/form-data',
            },
          };

          const response = await axios.post('/api/message/file', formData, fileConfig);
          data = response.data;
          setFile(null);
        } else {
          const messagePayload = {
            content: newMessage,
            chatId: selectedChat._id,
          };
          setNewMessage('');
          const response = await axios.post('/api/message', messagePayload, config);
          data = response.data;
        }

        socket.emit('new message', data);
        setMessages((prevMessages) => [...prevMessages, data]);

        // Update the latest message in chats and move the chat to the top of the list
        setChats((prevChats) => {
          const updatedChats = prevChats.map((chat) =>
            chat._id === data.chat._id ? { ...chat, latestMessage: data } : chat
          );

          // Move the updated chat to the top of the list
          const chatIndex = updatedChats.findIndex(chat => chat._id === data.chat._id);
          const [movedChat] = updatedChats.splice(chatIndex, 1);
          return [movedChat, ...updatedChats];
        });
      } catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
        toast({
          title: 'Error Occurred!',
          description: 'Failed to send the message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="center"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            backgroundColor="#2C2E54"
          >
            <Text
              fontSize={{ base: '20px', md: '30px' }}
              pb={3}
              px={2}
              w="100%"
              fontFamily="Work Sans"
              d="flex"
              justifyContent={{ base: 'space-between' }}
              alignItems="center"
              color="#ffffff"
              fontWeight="400"
              
            >
              <IconButton
                d={{ base: 'flex', md: 'none' }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat('')}
                marginRight="12px"
                backgroundColor="#3c2980"
                color="#ffffff"
                _hover={{ backgroundColor: '#724DF3' }} 
              />
              {messages &&
                (!selectedChat.isGroupChat ? (
                  <>
                    {getSender(user, selectedChat.users)}
                    <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                  </>
                ) : (
                  <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                      fetchMessages={fetchMessages}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    />
                  </>
                ))}
            </Text>

            <Box
              d="flex"
              flexDir="column"
              justifyContent="flex-end"
              p={3}
              bg="#E8E8E8"
              w="100%"
              h="85%"
              borderRadius="lg"
              overflowY="auto"
              
            >
              {loading ? (
                <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
              ) : (
                <div className="messages" style={{ overflowY: 'scroll' }}>
                  <ScrollableChat messages={messages} />
                  <div ref={messagesEndRef} />
                </div>
              )}

              {istyping ? (
                <div>
                  <Lottie options={defaultOptions} width={70} />
                </div>
              ) : (
                <></>
              )}
            </Box>

            <FormControl
              id="message-form"
              isRequired
              mt={3}
              position="sticky"
              bottom={0}
              bg="#E8E8E8"
              zIndex={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
              backgroundColor="#2C2E54"
            >
          
              <Button
                as="label"
                htmlFor="file-upload"
                leftIcon={<AttachmentIcon />}
                variant="solid"
                colorScheme="blue"
                paddingLeft={"24px"}
              >
                <Input
                  type="file"
                  id="file-upload"
                  onChange={fileChangeHandler}
                  hidden
                />
              </Button>
              <Input
                variant="filled"
                bg="#E2E8F0"
                placeholder="Digite algo.."
                value={newMessage}
                onChange={typingHandler}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
                width={'80%'}
                marginLeft={'2%'}
                marginRight={'2%'}
                color="#ffffff"
              />
              <Button
                onClick={sendMessage}
                colorScheme="blue"
                variant="solid"
                size="md"
                width="10%"
                marginLeft={'1%'}
                leftIcon={<FaPlay />}
                paddingRight={"24px"}
              >
                Enviar
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work Sans" textAlign="center">
            Clique em uma mensagem para começar a conversar!
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
