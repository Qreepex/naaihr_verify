const { MessageEmbed, GuildMemberManager, GuildAuditLogs, GuildMember, MessageActionRow, MessageButton, ReactionUserManager } = require("discord.js");
const BaseEvent = require("../classes/Event.js");
const Bot = require("../classes/Bot.js");

class GuildMemberAddEvent extends BaseEvent {
    constructor() {
        super('guildMemberAdd');
    };

    /**
     * 
     * @param {Bot} client 
     * @param {GuildMember} member
     */

    async run(client, member) {
        if(member.partial) await member.fetch();
        if(member.user.bot) return;

        let guild = client.guilds.cache.get(client.config.guild) || await client.guilds.fetch(client.config.guild).catch(e => {});
        if(!guild) return;

        let tutorialChannel = guild.channels.cache.get(client.config.anleitung) || await guild.channels.fetch(client.config.anleitung).catch(e => {});
        if(!tutorialChannel) return;

        client.verifyLog.send(`📤 \`${member.user.tag}\` *(ID: ${member.user.id})* joined.`);
    };
};

module.exports = GuildMemberAddEvent;