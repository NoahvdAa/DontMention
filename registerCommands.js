const config = require('./config.json');

const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const rest = new REST({ version: '9' }).setToken(config.discordToken);

const commands = [];
const commandsFolder = `${__dirname}/commands`;
for (const file of fs.readdirSync(commandsFolder)) {
	if (!file.endsWith('.js')) {
		continue;
	}
	const commandName = file.split('.js')[0];
	const commandFile = `${__dirname}/commands/${file}`;
	const command = require(commandFile);

	commands.push(command.command.toJSON());
	console.log(`Loaded command: ${commandName}`);
}

console.log('Registering commands....');
rest.put(Routes.applicationCommands(config.discordClientID), { body: commands })
	.then(() => console.log('Registered application commands!'))
	.catch(console.error);
