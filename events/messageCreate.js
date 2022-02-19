function joinUsers(users) {
	var output = '';
	var i = 0;

	while (users.length !== 0) {
		i++;
		const user = users.shift();
		var suffix;
		if (users.length === 0) { suffix = ''; }
		else if (users.length === 1) { suffix = ' and '; }
		else { suffix = ', '; }

		output += user + suffix;
	}

	return output;
}

module.exports = async (client, message) => {
	// Bots have no rights.
	if (message.author.bot) {
		return;
	}

	const mentions = message.mentions.users;
	if (mentions.length === 0) {
		return;
	}

	var usersThatDontWantMentions = []; // Beautiful variable name, I know
	for (const user of mentions.values()) {
		// You can ping yourself all you want, I don't care.
		if (user.id === message.author.id) {
			return;
		}

		const userResults = await client.knex('users').where('id', user.id);
		if (userResults.length === 0) {
			continue;
		}

		const preference = userResults[0].preference === 1;
		if (preference) {
			continue;
		}

		usersThatDontWantMentions.push(user.username);
	}

	const userCount = usersThatDontWantMentions.length;
	if (userCount === 0) {
		return;
	}

	const joinedUsers = joinUsers(usersThatDontWantMentions);
	var reply = `Hey **${message.author.username}**! ${joinedUsers} prefer${userCount === 1 ? 's' : ''} to not be mentioned/tagged! Please respect their wishes by not mentioning them again.`;
	if (message.reference) {
		reply += '\nWhen using Discord\'s reply feature, click the @ button in the bottom right of your screen to disable mentions: <:reply_ping_on:921775902889771058> :arrow_right: <:reply_ping_off:921775905293086824>';
	}

	message.channel.send(reply).catch((e) => console.error('Failed to reply to message: ', e));
};
