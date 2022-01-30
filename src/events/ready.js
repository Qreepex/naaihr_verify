const { MessageEmbed, GuildMemberManager, GuildAuditLogs, MessageAttachment, MessageActionRow, MessageButton } = require("discord.js");
const BaseEvent = require("../classes/Event.js");
const Bot = require("../classes/Bot.js");

module.exports = class extends BaseEvent {
    constructor() {
        super('ready');
    };

    /**
     * 
     * @param {Bot} client 
     */

    async run(client) {
        console.info(`Logged in at ${new Date().toLocaleString().replace(",","")} as ${client.user.tag} [${client.user.id}]`, "CLIENT");

        let channel = client.channels.cache.get(client.config.anleitung);
        return

        channel.send({ components: [ new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setStyle("PRIMARY")
                    .setLabel("Verifizieren")
                    .setCustomId("verify_new")
                    .setDisabled(false)
                    .setEmoji("✅"),

                new MessageButton()
                    .setStyle("LINK")
                    .setURL("https://naaihr-community.de/verify-help")
                    .setLabel("Hilfe")
                    .setEmoji("❓")
                    .setDisabled(false)
            ])
        ], embeds: [ new MessageEmbed()
            .setColor("BLURPLE")
            .setTimestamp().setTitle(":white_check_mark: Verifizierung")
            .setFooter({ iconURL: channel.guild.iconURL({ dynamic: true }), text: "Bei Fragen an das Team wenden!"})
            .setDescription(`Befolge diese Schritte um zu verifizieren, dass du kein Bot bist.
<:naaihrArrow:862437883624161290> Klicke auf den Knopf unter dieser Nachricht.
<:naaihrArrow:862437883624161290> Entziffere den Code auf dem Bild, dass du per Privatnachricht bekommst.
<:naaihrArrow:862437883624161290> Sende den Code in <#862383988084965387>. Fertig!
            
:pushpin: Achtung: Du musst Direktnachrichten von Server Mitgliedern hierfür aktivieren! **([?](https://naaihr-community.de/activate-direct-messages))**`)
        ]})
    };
};