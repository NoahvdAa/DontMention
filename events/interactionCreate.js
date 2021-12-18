module.exports = async (client, interaction) => {
	if (!interaction.isCommand()) {
		return;
	}

	const command = client.commands.get(interaction.commandName);
	if (typeof command === 'undefined') {
		return;
	}
	command.run(client, interaction);
};
