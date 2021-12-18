const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports.command = new SlashCommandBuilder()
	.setName('dontmention')
	.setDescription('Toggles your mention preference')
	.addBooleanOption((option) => option.setName('allowmentions')
		.setDescription('Whether you want to be mentioned')
		.setRequired(false));

module.exports.run = async (client, interaction) => {
	var wantsMentions = interaction.options.getBoolean('allowmentions');
	if (wantsMentions === null) {
		// They didn't specify an option, invert their current value!
		const userResults = await client.knex('users').where('id', interaction.user.id);
		if (userResults.length === 0) {
			// Create their profile.
			await client.knex('users').insert({
				id: interaction.user.id,
				preference: false
			});
			wantsMentions = false;
		} else {
			wantsMentions = userResults[0].preference === 1;
			wantsMentions = !wantsMentions;
		}
	}

	const message = wantsMentions ? '**Got it.** I won\'t do anything when people ping you.' : '**Got it.** I\'ll inform users that try to ping you that you don\'t want to be pinged.';

	await client.knex('users').update({
		preference: wantsMentions
	}).where('id', interaction.user.id);

	await interaction.reply({ content: message, ephemeral: true });
};
