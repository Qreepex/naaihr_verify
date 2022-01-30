const BaseEvent = require("../classes/Event");
const { MessageEmbed, Message, MessageActionRow, MessageButton } = require("discord.js")
const Bot = require("../classes/Bot.js");

class MessageEvent extends BaseEvent {
    constructor() {
        super('messageCreate');
    };

    /**
     * @param {Bot} client 
     * @param {Message} msg 
     */

    async run(client, msg) {
        if(msg.partial) await msg.fetch();
        if(msg.author.bot) return;

        if(msg.channel.id === client.config.verify) {
            let data = await client.schemas.verify.findOne({ user: msg.author.id });
            if(!data) {
                return msg.reply(":x: Bitte befolge die Schritt für Schritt Anleitung in <#862380551008157716>!");
            };

            if(msg.content.toLowerCase() === client.config.captchas.solutions[data.captcha]) {
                let roles = ["699742801939922966","850386602491641867", "829291475480477717", "829295761186488360"]
                roles.forEach(r => msg.member.roles.add(r).catch(e => console.log(e)))

                client.verifyLog.send(`✅ \`${msg.author.tag}\` *(ID: ${msg.author.id})* hat sich erfolgreich verifziert. (\`${data.captcha}\`)`);

                await client.schemas.verify.deleteOne({ user: msg.author.id });

                msg.guild.channels.cache.get("699742386376540352")?.send(`<a:peepoWave:831601702406455296> <@!${msg.author.id}> ist gejoint! <:PepeCuteHappy:896060970856767509>`);
            };
        };
    };
};

module.exports = MessageEvent;