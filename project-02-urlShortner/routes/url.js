const express = require("express");
const router = express.Router();
const {
  handleGenerateShortUrl,
  handleGetShortUrl,
} = require("../controllers/url");

router.post("/", handleGenerateShortUrl);

router.get("/:id", handleGetShortUrl);

module.exports = router;
