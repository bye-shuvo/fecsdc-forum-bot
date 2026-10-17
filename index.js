require("dotenv").config();
const express = require("express");
const app = express();
const { Client, GatewayIntentBits } = require("discord.js");

app.get("/", (req, res) => {
  try {
    res.status(200).send("BYE-BOT IS LIVE");
  } catch (error) {
    req.status(500).send(error.message);
  }
});
app.get("/health", (req, res) => {
  try {
    res.status(200).json({
      up: true,
      ready: client.isReady(),
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started!");
});

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const { FORUM_ID, TAG_REQUEST, TAG_PROCESS, TAG_VERIFIED, TAG_CANCELLED } =
  process.env;

const MSG = {
  request: "Request submitted successfully. We will review it soon.",
  process:
    "Please confirm your membership by contacting one of the senior executives.",
  verified:
    "Your submission has been verified. You can now access the exclusive channels on the FECSDC server.",
  cancelled:
    "Your request has been cancelled due to not following server guidelines.",
};

const TAGS = {
  [TAG_REQUEST]: MSG.request,
  [TAG_PROCESS]: MSG.process,
  [TAG_VERIFIED]: MSG.verified,
  [TAG_CANCELLED]: MSG.cancelled,
};

async function notify(thread, text) {
  await thread.send(`<@${thread.ownerId}> ${text}`).catch(console.error);
  const user = await client.users.fetch(thread.ownerId);
  await user.send(`${text}\n${thread.url}`).catch(() => {});
}

client.once("clientReady", async () => {
  const forum = await client.channels.fetch(FORUM_ID);
  await forum.threads.fetchActive();
  console.log("Bye-Bot ready");
});

client.on("threadCreate", async (thread, isNew) => {
  if (!isNew || thread.parentId !== FORUM_ID) return;
  await notify(thread, MSG.request);
});

client.on("threadUpdate", async (oldT, newT) => {
  if (newT.parentId !== FORUM_ID) return;
  const added = newT.appliedTags.filter((t) => !oldT.appliedTags.includes(t));
  for (const id of added) {
    if (id === TAG_REQUEST) continue;
    const text = TAGS[id];
    if (text) await notify(newT, text);
  }
});

client.login(process.env.TOKEN);
