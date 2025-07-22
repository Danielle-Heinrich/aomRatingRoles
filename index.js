const {
    token
} = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const {
    Client,
    Collection,
    Colors,
    Events,
    MessageFlags,
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
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const ratingRolesArray = [{
        "name": "tagPro",
        "value": "Pro (1900+)",
        "color": 0x9b59b6
    }, {
        "name": "tagAdvanced",
        "value": "Advanced (1600+)",
        "color": 0xed4245
    }, {
        "name": "tagCompetent",
        "value": "Competent (1300+)",
        "color": 0xf1c40f
    }, {
        "name": "tagIntermediate",
        "value": "Intermediate (1000+)",
        "color": 0x57f287
    }, {
        "name": "tagNovice",
        "value": "Novice (<1000)",
        "color": 0x3498db
    }
];

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

//THE AOMSTATS BOT ID
const aomstatsBot = "1396612628058734642";

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand())
        return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral
            });
        }
    }
});

client.on('messageCreate', (message) => {
    if ((message.author.id === aomstatsBot) && (ratingRolesArray.map(a => a.value).every(x => message.guild.roles.cache.map(c => c.name).includes(x)))) {
        if (message.embeds[0].footer.text.match("\u2705") !== null) {
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

                        const tagPro = thisGuild.roles.cache.find(r => r.name === (ratingRolesArray[ratingRolesArray.map(n => n.name).indexOf('tagPro')].value));
                        const tagAdvanced = thisGuild.roles.cache.find(r => r.name === (ratingRolesArray[ratingRolesArray.map(n => n.name).indexOf('tagAdvanced')].value));
                        const tagCompetent = thisGuild.roles.cache.find(r => r.name === (ratingRolesArray[ratingRolesArray.map(n => n.name).indexOf('tagCompetent')].value));
                        const tagIntermediate = thisGuild.roles.cache.find(r => r.name === (ratingRolesArray[ratingRolesArray.map(n => n.name).indexOf('tagIntermediate')].value));
                        const tagNovice = thisGuild.roles.cache.find(r => r.name === (ratingRolesArray[ratingRolesArray.map(n => n.name).indexOf('tagNovice')].value));

                        switch (true) {
                        case (rating == null || rating === undefined):
                            thisGuildMembers.roles.remove(tagPro);
                            thisGuildMembers.roles.remove(tagAdvanced);
                            thisGuildMembers.roles.remove(tagCompetent);
                            thisGuildMembers.roles.remove(tagIntermediate);
                            thisGuildMembers.roles.remove(tagNovice);
                            break;
                        case (rating > 1900):
                            thisGuildMembers.roles.add(tagPro);
                            thisGuildMembers.roles.remove(tagAdvanced);
                            thisGuildMembers.roles.remove(tagCompetent);
                            thisGuildMembers.roles.remove(tagIntermediate);
                            thisGuildMembers.roles.remove(tagNovice);
                            break;
                        case (rating > 1600):
                            thisGuildMembers.roles.remove(tagPro);
                            thisGuildMembers.roles.add(tagAdvanced);
                            thisGuildMembers.roles.remove(tagCompetent);
                            thisGuildMembers.roles.remove(tagIntermediate);
                            thisGuildMembers.roles.remove(tagNovice);
                            break;
                        case (rating > 1300):
                            thisGuildMembers.roles.remove(tagPro);
                            thisGuildMembers.roles.remove(tagAdvanced);
                            thisGuildMembers.roles.add(tagCompetent);
                            thisGuildMembers.roles.remove(tagIntermediate);
                            thisGuildMembers.roles.remove(tagNovice);
                            break;
                        case (rating > 1000):
                            thisGuildMembers.roles.remove(tagPro);
                            thisGuildMembers.roles.remove(tagAdvanced);
                            thisGuildMembers.roles.remove(tagCompetent);
                            thisGuildMembers.roles.add(tagIntermediate);
                            thisGuildMembers.roles.remove(tagNovice);
                            break;
                        default:
                            thisGuildMembers.roles.remove(tagPro);
                            thisGuildMembers.roles.remove(tagAdvanced);
                            thisGuildMembers.roles.remove(tagCompetent);
                            thisGuildMembers.roles.remove(tagIntermediate);
                            thisGuildMembers.roles.add(tagNovice);
                        }
                    }
                });
            });
        }
    }
});

client.login(token);
