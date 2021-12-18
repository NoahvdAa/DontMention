const config = require('./config.json');

const { Client, Collection } = require('discord.js');
const fs = require('fs');

const knex = require('knex')(require('./knexfile.js'));

const client = new Client({
	intents: [
		'GUILDS',
		'GUILD_MESSAGES',
	],
	presence: {
		status: 'dnd',
		activities: [
			{
				type: 'WATCHING',
				name: 'pings'
			}
		]
	}
});
client.knex = knex;

fs.readdir(`${__dirname}/events`, (err, files) => files.forEach(file => {
	if (!file.endsWith('.js')) return;
	const eventName = file.split('.js')[0];
	const event = require(`${__dirname}/events/${file}`);

	client.on(eventName, event.bind(null, client));
	console.log(`Loaded event: ${eventName}`);
}));

client.commands = new Collection();
fs.readdir(`${__dirname}/commands`, (err, files) => files.forEach(file => {
	if (!file.endsWith('.js')) return;
	const command = require(`${__dirname}/commands/${file}`);
	const commandName = command.command.name;

	client.commands.set(commandName, command);
	console.log(`Loaded command: ${commandName}`);
}));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.discordToken);
