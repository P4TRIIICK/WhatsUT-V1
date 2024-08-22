const express = require("express");
const {
  allMessages,
  sendMessage,
  uploadFile,
  downloadFile
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
router.post('/file', protect, uploadFile);
router.route('/downloads/:filename').get(protect, downloadFile);

module.exports = router;
