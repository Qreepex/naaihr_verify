const { MessageEmbed, CommandInteraction } = require("discord.js");
const Bot = require("./Bot.js")

class BaseCommand {
    constructor(client, {
		name = "expample",
        description = "description",

		options = [],
    }) {
        /**
         * @type {Bot}
         */
		this.client = client;

		this.config = { name, description, options };
		this.help = { name, description, options };
        this.Logger = client?.Logger
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

	async run(interaction) {
        this.Logger.warn("Ended up in command.js [" + JSON.stringify(this.config) + "]")
    };

    /**
     * 
     * @param {String} guildId 
     */

	async initialize(guildId) {
        let guild = await this.client.guilds.fetch(guildId)

        guild.commands.create({
            name: this.help.name,
            description: this.help.description,
            defaultPermission: false,
            options: this.config.options
        }).then(cmd => {
            cmd.permissions.add({ command: cmd.id, permissions: [{
                id: "699743915628036189",
                type: "ROLE",
                permission: true
            }] }).then(() => {
                this.Logger.info(`Created /${this.help.name}`, "COMMANDS");
            })
        }).catch(this.client.Logger.error);
	}

    /**
     * 
     * @param {[MessageEmbed, String, Array]} input 
     * @param {Array} components 
     * @returns 
     */

	async response(interaction, input, components = []) {
        if(typeof input === "object") {
            if(input.description) return await interaction.reply({ embeds: [ input ], components: components }).catch(this.client.Logger.error);
            else return await interaction.reply({ embeds: input, components: components }).catch(this.client.Logger.error)
        } else if(typeof input === "string") {
            return await interaction.reply({ content: input, components: components }).catch(this.client.Logger.error);
        }
	}

    /**
     * 
     * @param {String} text 
     * @returns 
     */

	error(interaction, text) {
        return interaction.reply({ embeds: [new MessageEmbed().setColor('#ff0000').setDescription(":x: " + text)] }).catch(this.client.Logger.error);
	}

	get rest() {
        return this.client.api;
    }
}

module.exports = BaseCommand;