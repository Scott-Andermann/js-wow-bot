require('dotenv').config()
const {REST, Routes} = require('discord.js');
const fs = require('node:fs');
// const {Routes} = require('discord-api-types/v9');

const commands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    // const filePath = path.join('./commands', file);
    const command = require(`./commands/${file}`);

    commands.push(command.data.toJSON());
}

// console.log(commands);

const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands...`);

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID), {body: commands},
        );
        console.log(`Successfully loaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();