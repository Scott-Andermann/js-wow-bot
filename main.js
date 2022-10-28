require('dotenv').config()
const {Client, Events, GatewayIntentBits, Collection} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.commands = new Collection();
const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
    const command = interaction.client.commands.get(interaction.commandName);
    // console.log(command);
    if (!command) {
        console.log(`No matching command for ${command}`);
        interaction.reply(`No matching command for ${command}`);
    } else {
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({content: 'There was an error while executing this command.', ephemeral: true})
        }
    }

    


	// if (commandName === 'ping') {
	// 	await interaction.reply('Pong!');
	// } else if (commandName === 'beep') {
	// 	await interaction.reply('Boop!');
	// }

    
});

client.login(process.env.DISCORD_TOKEN)

console.log(commandFiles);