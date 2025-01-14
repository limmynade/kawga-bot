import {Client, IntentsBitField} from "discord.js";
import * as dotenv from "dotenv"

import {messageCreateListener} from "./listeners/messageCreate.js";
import {fetchChannels, updateHosts} from "./util.js";

dotenv.config();

const HOST_UPDATE_PERIOD = 100;

const client = new Client({
	intents : [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.MessageContent,
	]
});

client.on("ready", (c) => console.log(`${c.user.tag} is ready.`));
await client.login(process.env.BOT_TOKEN);

const sourceChannels = fetchChannels(client, process.env.SOURCE_CHANNEL_IDS.split(","));
const hostingChannel = await client.channels.fetch(process.env.HOST_CHANNEL_ID);
const hostMap = new Map();
const joinEmoji = client.emojis.cache.get(process.env.JOIN_EMOJI_ID);

client.on("messageCreate", (msg) => messageCreateListener(msg, hostingChannel, hostMap, joinEmoji, sourceChannels));


setInterval(() => {updateHosts(client, hostMap, joinEmoji)}, HOST_UPDATE_PERIOD);

