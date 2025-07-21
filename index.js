const {
    token
} = require('./config.json');
const {
    Client,
    Intents,
    GatewayIntentBits
} = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ],
});

//PLACE YOUR ROLES IDS HERE
const tagPro = "1396382715850395719";
const tagExpert = "1396382552813604905";
const tagIntermediate = "1396382352996962384";
const tagInitiate = "1396382234696487033";

//THE AOMSTATS BOT ID
const aomstatsBot = "1396612628058734642";

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {	
    if (message.author.id === aomstatsBot) {
		if (message.embeds[0].footer.text.match("\u2705") !== null)
		{
        message.embeds.forEach((embed) => {
            let fields = embed.fields;
            fields.forEach((field) => {
                if (field.name == "Rating") {

					const rating = field.value;
                    const thisGuild = message.guild;
                    const thisUser = message.interactionMetadata.user;
                    const thisGuildMembers = message.guild.members.resolve(thisUser);
					//IF YOU ENCOUNTER ANY PERMISSION ERRORS, ENSURE THE BOT ROLE IS PLACED ABOVE ALL OTHER ROLES IN THE ROLES LIST
					//DISCORD > SERVER SETTINGS > ROLES > DRAG BOT ROLE TO THE TOP
					switch (true) {
							case (rating == null):
								thisGuildMembers.roles.remove(tagPro);
								thisGuildMembers.roles.remove(tagExpert);
								thisGuildMembers.roles.remove(tagIntermediate);
								thisGuildMembers.roles.remove(tagInitiate);
								break;
							case (rating >1700):
								thisGuildMembers.roles.add(tagPro);
								thisGuildMembers.roles.remove(tagExpert);
								thisGuildMembers.roles.remove(tagIntermediate);
								thisGuildMembers.roles.remove(tagInitiate);
								break;
							case (rating >1300):
								thisGuildMembers.roles.remove(tagPro);
								thisGuildMembers.roles.add(tagExpert);
								thisGuildMembers.roles.remove(tagIntermediate);
								thisGuildMembers.roles.remove(tagInitiate);
								break;
							case (rating>1000):
								thisGuildMembers.roles.remove(tagPro);
								thisGuildMembers.roles.remove(tagExpert);
								thisGuildMembers.roles.add(tagIntermediate);
								thisGuildMembers.roles.remove(tagInitiate);
								break;
							default:
								thisGuildMembers.roles.remove(tagPro);
								thisGuildMembers.roles.remove(tagExpert);
								thisGuildMembers.roles.remove(tagIntermediate);
								thisGuildMembers.roles.add(tagInitiate);
					}
                }
            });
        });
		}
    }
});

client.login(token);