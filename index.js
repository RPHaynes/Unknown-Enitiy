const { token } = require("./config.json");
const { Client, Intents } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const flag = "!";

client.on("ready", () => {
	console.log("I am ready!");
	client.user.setPresence({
		activities: [
			{
				name: "Orb",
				type: "Pondering my",
			},
		],
		status: "Angry",
	});
});

client.on("messageCreate", async (message) => {
	console.log(message.author.username);
	if (message.channel.name !== "discordbottesting") return;
	if (message.author.username === "Unknown Entity") return;
	if (!message.content.startsWith(flag)) {
		message.react("⬆").then(message.react("⬇️"));
	} else {
		switch (message.content.split(" ")[0]) {
			case flag + "help":
				message.channel.send("no");
				break;
			case flag + "best":
				message.channel.messages.fetch().then((messages) => {
					console.log(`Received ${messages.size} messages`);
					//Iterate through the messages here with the variable "messages".
					let ar = messages
						.filter(
							(message) =>
								message.reactions.cache.has("⬆") &&
								message.reactions.cache.has("⬇️")
						)
						.map((message) => {
							return {
								up: message.reactions.cache.get("⬆").count,
								down: message.reactions.cache.get("⬇️").count,
								message: message,
							};
						});
					ar.sort((a, b) => (a.up > b.up ? -1 : 1));
					if (ar.length < 1) return;
					const row = new MessageActionRow().addComponents(
						new MessageButton()
							.setLabel("Go to Comment")
							.setStyle("LINK")
							.setURL(ar[0].message.url)
					);

					message.channel.send({
						content:
							"`" +
							ar[0].message.content +
							"`" +
							"\n" +
							" -" +
							ar[0].message.author.username +
							" with " +
							ar[0].up +
							" ups",
						components: [row],
					});
				});
				break;
			case flag + "fireball":
				if (message.author.username === "Cheff")
					message.channel.bulkDelete(100);
				break;
		}
	}
});

client.login(token);
