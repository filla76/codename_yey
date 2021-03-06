module.exports = {
	name: "language",
	group: "settingsGroup",
	description: "languageDescription",
	usage: "languageUsage",
	async run(client, msg, args, prefix, lang) {
		let langName = args[0];
		if (!langName) {
			let userLanguage = await languages.findOne({ where: { user: msg.author.id } })
				.then(l => l.lang);

			let embed = {
				title: lang.availableLanguages,
				description: Array.from(client.languages.keys()).map(l => `\`${l}\``)
					.join(", "),
				color: Math.round(Math.random() * 16777216) + 1,
				footer: { text: lang.languagesTip(prefix) },
				fields: [
					{
						name: lang.yourLanguage,
						value: `\`${userLanguage}\``,
					},
				],
			};
			await msg.channel.createMessage({ embed });
		} else {
			if (!client.languages.has(langName)) {
				return msg.channel.createMessage(lang.langDoesntExist);
			}

			await languages.update(
				{ lang: langName },
				{ where: { user: msg.author.id } }
			);

			let newLang = client.languages.get(langName);
			await msg.channel.createMessage(newLang.langSuccess(langName));
		}
	}
};
