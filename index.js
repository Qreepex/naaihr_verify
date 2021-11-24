const { Client, MessageEmbed, Intents, MessageAttachment, MessageButton } = require("discord.js")
const { writeFileSync } = require("fs")
const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ],    
})
const users = require("./db/users.json")
const config = require("./config.json")

client.login(config.token)

let captachas = require("./captchas.json")

client.on("ready", async () => {
    let guild = await client.guilds.fetch("699742385919229963")
    let anleitungChannel = await guild.channels.fetch("862380551008157716")

    console.log("ready")
    if(!config.message || config.message === null) {
        let button = new MessageButton()
            .setCustomId('verify_1')
            .setLabel('Verifizierung')
            .setStyle('PRIMARY')

        let howToEmbed = new MessageEmbed()
            .setTitle(":white_check_mark: Verifizierung")
            .setDescription(`So verifizierst du dich:\n1. Klicke auf den Knopf unter dieser Nachricht (DEINE DM'S MÜSSEN OFFEN SEIN)\n2. Entziffere den Code auf dem Bild\n3. Sende den Code in <#862383988084965387>`)
            .setFooter("Bei Fragen an das Team wenden")
            .setTimestamp()

        anleitungChannel.send({ embeds: [ howToEmbed ], components: [[button]]}).then(m => {
            config.message = m.id
            writeFileSync("./config.json", JSON.stringify(config))
        })
    }
})

client.on("guildMemberAdd", async member => {
    if(member.user.bot) return

    let guild = await client.guilds.fetch("699742385919229963")
    let anleitungChannel = await guild.channels.fetch("862380551008157716")
    let verifyLog = await guild.channels.fetch("862612445804363806")

    anleitungChannel.send(`<@!${member.user.id}>`).then(m => m.delete())
    verifyLog.send(`📤 \`${member.user.tag}\` *(ID: ${member.user.id})* joined.`)
})

client.ws.on("INTERACTION_CREATE", async interaction => {  
    let guild = await client.guilds.fetch("699742385919229963")
    let anleitungChannel = await guild.channels.fetch("862380551008157716")
    let verifyLog = await guild.channels.fetch("862612445804363806")
    
    if(interaction.type === 3 && interaction.data.custom_id === "verify_1") {
        let member = guild.members.cache.get(interaction.member.user.id)

        let data = { data: {
            type: 4,
            data: {
                content: `:x: Du hast bereits einen Code per DM bekommen.`,
                flags: 64
            }
        } };
        if(users[member.user.id]) {
            verifyLog.send(`❌ \`${member.user.tag}\` *(ID: ${member.user.id})* hat bereits einen Code bekommen. (\`${users[member.user.id]}\`)`)
            client.api.interactions(interaction.id, interaction.token).callback.post(data)
            return
        }

        let number = Math.floor(Math.random() * ((captachas.solutions.length-1) - 0 + 1) + 0)
        verifyLog.send(`:1234: \`${member.user.tag}\` *(ID: ${member.user.id})* hat Captcha Nummer \`${number}\`.`)

        let verfiyEmbed = new MessageEmbed()
            .setTitle("Verify")
            .setDescription("Schreibe den Code auf diesem Bild in <#862383988084965387>.")
            .setImage(captachas.paths[number])
            .setFooter("Bei Fragen an das Team wenden")
            .setTimestamp()
            .setColor("BLUE")

        member.send({ embeds: [
            verfiyEmbed
        ]}).then(() => {
            users[member.user.id] = number
            writeFileSync("./db/users.json", JSON.stringify(users))

            let data = { data: {
                type: 4,
                data: {
                    content: `Überprüfe jetzt deine DM's ^^`,
                    flags: 64
                }
            } };
    
            client.api.interactions(interaction.id, interaction.token).callback.post(data)
            verifyLog.send(`✅ \`${member.user.tag}\` *(ID: ${member.user.id})* wurde der Code per DM geschickt. (\`${users[member.user.id]}\`)`)
            return
        }).catch(e => {
            console.log(e);
            let data = { data: {
                type: 4,
                data: {
                    content: `:x: Bitte aktiviere deine DM's. Du kannst dich nicht verifizieren, wenn der Bot dir keine Nachrichten senden kann.`,
                    flags: 64
                }
            } };
    
            client.api.interactions(interaction.id, interaction.token).callback.post(data)
            verifyLog.send(`:x: \`${member.user.tag}\` *(ID: ${member.user.id})* hat seine DM's geschlossen. (\`${users[member.user.id]}\`)`)
            return
        })
    }
})

client.on("messageCreate", async msg => {
    if(msg.author.id === "552530299423293441") {
        if(msg.content.startsWith("!add")) {
            var args = msg.content.split(" ")
            if(!args[1]) msg.channel.send(":x: Kein Link")
            if(!args[2]) msg.channel.send(":x: Keine Lösung")
            captachas.paths.push(args[1])
            captachas.solutions.push(args[2])
            writeFileSync("./captchas.json", JSON.stringify(captachas))
        }
    }

    if(msg.channel.id === "862383988084965387") {
        let guild = await client.guilds.fetch("699742385919229963")
        let anleitungChannel = await guild.channels.fetch("862380551008157716")
        let verifyLog = await guild.channels.fetch("862612445804363806")

        if(users[msg.author.id.toString()] === undefined) return

        if(msg.content.toLowerCase() === captachas.solutions[users[msg.author.id]]) {
            let roles = ["699742801939922966","850386602491641867"]
            roles.forEach(r => msg.member.roles.add(r).catch(e => console.log(e)))

            let member = msg.member
            verifyLog.send(`✅ \`${member.user.tag}\` *(ID: ${member.user.id})* hat sich erfolgreich verifziert. (\`${users[member.user.id]}\`)`)

            delete users[msg.author.id]
            writeFileSync("./db/users.json", JSON.stringify(users))

            msg.channel.send("✅ Du hast dich erfolgreich verifiziert!").then(m => {
                guild.channels.cache.get("699742386376540352").send(`🌴 <@!${msg.author.id}> ist gejoint!`)
                setTimeout(() => {
                    m.delete()
                    msg.delete()
                }, 5000)
            })
        } else {
            msg.reply({ content: ":x: Der Code ist falsch."})
            verifyLog.send(`:x: \`${member.user.tag}\` *(ID: ${member.user.id})* hat den falschen Code \`${msg.content}\` benutzt. (Richtiger Code: \`${users[member.user.id]}\`)`)
            return
        }
    }
})