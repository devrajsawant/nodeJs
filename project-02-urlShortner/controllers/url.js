const { nanoid } = require("nanoid");
const { URL } = require("../models/url");

const handleGenerateShortUrl = async (req, res) => {
  const body = req.body;
  if (!body.url) return res.status(400).json({ msg: "URL is required" });
  const shortId = nanoid(10);
  await URL.create({
    shortId: shortId,
    redirectUrl: body.url,
    visitHistory: [],
  });

  return res.json({ id: shortId });
};

const handleGetShortUrl = async (req, res) => {
  const shortId = req.params.id;
  if (!shortId) return res.status(404).json({ msg: "URL is not found" });
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timeStamp: Date.now(),
        },
      },
    },
  );

  res.redirect(entry.redirectUrl);

  return res.json({ id: shortId });
};

module.exports = {
  handleGenerateShortUrl,
  handleGetShortUrl,
};
