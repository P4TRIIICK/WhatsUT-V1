import React, { useEffect } from "react";
import { Avatar } from "@chakra-ui/avatar";
import io from 'socket.io-client';
import { Tooltip } from "@chakra-ui/tooltip";
import { DownloadIcon } from "@chakra-ui/icons";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../Context/ChatProvider";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics";
var socket;

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  useEffect(() => {
    socket = io('http://localhost:7777');  // Ensure the URL matches your backend server
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleFileDownload = (url, fileName) => {
    socket.emit('download-file', { url, fileName });
  };

  useEffect(() => {
    socket.on('file-data', ({ fileName, fileData }) => {
      const blob = new Blob([fileData], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }, []);

  const renderMessageContent = (message) => {
    if (message.filePath) {
      const fileName = message.filePath.substring(message.filePath.lastIndexOf('/') + 1);
      const url = `/api/message/downloads/${fileName}`;
      return (
        <a href="#" onClick={() => handleFileDownload(url, fileName)}>
          <u>{fileName.substring(fileName.indexOf('-') + 1)}</u>
          <DownloadIcon />
        </a>
      );
    } else {
      return message.content;
    }
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {renderMessageContent(m)}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
