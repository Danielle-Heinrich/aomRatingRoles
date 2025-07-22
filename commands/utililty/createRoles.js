const {
    SlashCommandBuilder
} = require('discord.js');

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

module.exports = {
    data: new SlashCommandBuilder()
    .setName('aomratingroles')
    .setDescription('Create Roles for aomstats Ratings')
    .addSubcommand(subcommand =>
        subcommand
        .setName('create')
        .setDescription('Create Roles for aomstats Ratings')),
    async execute(interaction) {
        if (interaction.guild.roles.cache.some(x => ratingRolesArray.map(a => a.value).includes(x.name))) {
            await interaction.reply(`One or more Rating Roles already exist. ${ratingRolesArray.map(a => a.value)}`);
        } else {
            ratingRolesArray.forEach((ratingRole) =>
                interaction.guild.roles.create({
                    name: ratingRole.value,
                    color: ratingRole.color,
                }));
            await interaction.reply(`Roles Created! ${ratingRolesArray.map(a=> a.value)}`);
        }
    },
};