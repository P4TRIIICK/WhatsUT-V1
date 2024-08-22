const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    content: { 
      type: String, 
      trim: true 
    },
    chat: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat" 
    },
    readBy: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }],
    filePath: {
      type: String, // Path to the uploaded file
    },
    fileType: {
      type: String, // Type of the file (e.g., image, video, document)
    },
    fileName: {
        type: String, // Name of the file
    }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
