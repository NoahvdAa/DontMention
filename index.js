const config = require('./config.json');

const { Client, Collection } = require('discord.js');
const fetch = require('node-fetch');
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

const eventsFolder = `${__dirname}/events`;
fs.readdir(eventsFolder, (err, files) => files.forEach((file) => {
	if (!file.endsWith('.js')) {
		return;
	}
	const eventName = file.split('.js')[0];
	const eventFile = `${__dirname}/events/${file}`;
	const event = require(eventFile);

	client.on(eventName, event.bind(null, client));
	console.log(`Loaded event: ${eventName}`);
}));

client.commands = new Collection();
const commandsFolder = `${__dirname}/commands`;
fs.readdir(commandsFolder, (err, files) => files.forEach((file) => {
	if (!file.endsWith('.js')) {
		return;
	}
	const commandFile = `${__dirname}/commands/${file}`;
	const command = require(commandFile);
	const commandName = command.command.name;

	client.commands.set(commandName, command);
	console.log(`Loaded command: ${commandName}`);
}));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

	postAnalytics();
	setInterval(postAnalytics, 10 * 60 * 1000);
});

client.login(config.discordToken);

function postAnalytics() {
	const guildCount = client.guilds.cache.size;

	if (config.botLists['discord.bots.ggToken'] !== '') {
		fetch(`https://discord.bots.gg/api/v1/bots/${client.user.id}/stats`, {
			method: 'post',
			body: JSON.stringify({
				guildCount
			}),
			headers: {
				'Authorization': config.botLists['discord.bots.ggToken'],
				'Content-Type': 'application/json'
			}
		});
	}
	if (config.botLists['discordbotlist.comToken'] !== '') {
		fetch(`https://discordbotlist.com/api/v1/bots/${client.user.id}/stats`, {
			method: 'post',
			body: JSON.stringify({
				guilds: guildCount
			}),
			headers: {
				'Authorization': config.botLists['discordbotlist.comToken'],
				'Content-Type': 'application/json'
			}
		});
	}
}
