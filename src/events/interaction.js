const { CommandInteraction, ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const BaseEvent = require("../classes/Event.js");
const Bot = require("../classes/Bot.js");

module.exports = class extends BaseEvent {
    constructor() {
        super('interactionCreate');
    };

    /**
     * @param {Bot} client 
     * @param {ButtonInteraction} interaction 
     */

    async run(client, interaction) {
        if(interaction.isButton() && interaction.customId === "verify_new") {
            let data = await client.schemas.verify.findOne({ user: interaction.user.id })
            if(data) {
                return interaction.reply({ ephemeral: true, content: ":x: Du hast bereits ein Bild mit einem Code per Privatnachricht bekommen!\n> :link: **Link:** https://discord.com/channels/@me/856647072622313472"})
            };

            let number = Math.floor(Math.random() * ((client.config.captchas.solutions.length-1) - 0 + 1) + 0);
            client.verifyLog.send(`:1234: \`${interaction.user.tag}\` *(ID: ${interaction.user.id})* hat Captcha Nummer \`${number}\`.`);

            let verfiyEmbed = new MessageEmbed()
                .setTitle(":white_check_mark: Verifizierung")
                .setDescription("Entschlüssle den Code auf diesem Bild und schicke ihn anschließend in den Kanal <#862383988084965387>\n> **Link:** https://discord.com/channels/699742385919229963/862383988084965387")
                .setImage(client.config.captchas.paths[number])
                .setFooter("Bei Fragen an das Team wenden!")
                .setTimestamp()
                .setColor("BLURPLE");

            interaction.member.send({ embeds: [
                verfiyEmbed
            ]}).then(async (message) => {
                let userData = new client.schemas.verify({
                    captcha: number,
                    user: interaction.user.id
                })
                await userData.save();
    
                interaction.reply({ ephemeral: true, content: `:white_check_mark: Entschlüssle jetzt den Code auf dem Bild, dass du per Privatnachricht bekommen hast und sende ihn in den Kanal <#862383988084965387>!\n> **Link:** ${message.url}`})

                return client.verifyLog.send(`✅ \`${interaction.user.tag}\` *(ID: ${interaction.member.user.id})* wurde der Code per DM geschickt. (\`${number}\`)`)
            }).catch(e => {
                console.log(e);

                interaction.reply({ ephemeral: true, components: [ new MessageActionRow()
                    .addComponents([
                        new MessageButton()
                            .setStyle("LINK")
                            .setURL("https://naaihr-community.de/activate-direct-messages")
                            .setDisabled(false)
                            .setEmoji("🔗")
                            .setLabel("Hilfe")
                    ])
                ], content: `:x: Du hast Privatnachrichten von Server Mitgliedern für diesen Server deaktiviert. Aktiviere bitte Privatnachrichten und versuche es erneut.`})
                
                return client.verifyLog.send(`:x: \`${interaction.user.tag}\` *(ID: ${interaction.user.id})* hat seine DM's geschlossen. (\`${number}\`)`)
            })
        };
    };
};