const { addMessage, getAllMessage } = require("../controllers/MessageController");

const router = require("express").Router()

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getAllMessage);

module.exports = router;