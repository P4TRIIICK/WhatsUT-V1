const asyncHandler = require("express-async-handler");
const multer = require("multer");
const path = require("path");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

// @description     Get all Messages
// @route           GET /api/Message/:chatId
// @access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Directory where files will be uploaded
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file"); // Single file upload

// @description     Create New Message
// @route           POST /api/message/
// @access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: "File upload failed", error: err });
    }

    const { content, chatId } = req.body;
    let filePath, fileType;

    if (req.file) {
      filePath = `/uploads/${req.file.filename}`;
      fileType = req.file.mimetype;
    }

    if (!content && !filePath) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
      filePath: filePath,
      fileType: fileType,
    };

    try {
      var message = await Message.create(newMessage);

      // Using the latest Mongoose syntax for population
      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });

      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

      res.json(message);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });
});

// @description     Create New Message with File
// @route           POST /api/message/file
// @access          Protected
const uploadFile = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: "File upload failed", error: err });
    }

    const { content, chatId } = req.body;
    let filePath, fileType, fileName;

    if (req.file) {
      filePath = `/uploads/${req.file.filename}`;
      fileType = req.file.mimetype;
      fileName = req.file.originalname;
    }

    if (!content && !filePath) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
      filePath: filePath,
      fileType: fileType,
      fileName: fileName,
    };

    try {
      var message = await Message.create(newMessage);

      // Using the latest Mongoose syntax for population
      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });

      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

      res.json(message);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });
});

const downloadFile = asyncHandler(async (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  console.log('File requested for download:', filePath);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log('File not found');
      res.sendStatus(404);
      return;
    }

    // Send the file to the client
    res.download(filePath, (err) => {
      if (err) {
        console.log('Error downloading file:', err);
        res.sendStatus(404);
      } else {
        console.log('File downloaded successfully');
      }
    });
  });
});

module.exports = { sendMessage, allMessages, uploadFile, downloadFile };
