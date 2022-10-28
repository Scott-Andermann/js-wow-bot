const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Provide information about the server.'),
    async execute(interaction) {
        await interaction.reply(`This server ${interaction.guild.name}, and has ${interaction.guild.memberCount} members`);
    }
}