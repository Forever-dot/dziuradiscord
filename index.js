global.Discord = require('discord.js')
const chalk = require('chalk');
const { ShardingManager } = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
const config = require('./config.json')
const db = require('quick.db')

client.on('ready' , (shard) => {
  
  console.log(chalk.magentaBright(`[✅ DOGGYlogs] ${client.user.tag} połączył się z serwerami Discord.`))
  client.user.setActivity(`Dziura Discord`, { type: 'WATCHING' })
  
  
  // console.log(client.guilds.shard.memberCount);
  
})

client.on('guildMemberAdd', async (member) => {
    if(db.has(`captcha-${member.guild.id}`)=== false) return;
    const url = 'https://api.no-api-key.com/api/v2/captcha';
        try {
            fetch(url)
                .then(res => res.json())
                .then(async json => {
                    console.log(json)
                    const message = await member.send(
                        new MessageEmbed()
                            .setTitle('Proszę wprowadzić kod captcha')
                            .setImage(json.captcha)
                            .setColor("RANDOM")
                    )
                    try {
                        const filter = (m) => {
                            if(m.author.bot) return;
                            if(m.author.id === member.id && m.content === json.captcha_text) return true;
                            else {
                                member.send("Odpowiedziałeś nieprawidłowo na captcha!")
                            }
                        };
                        const response = await message.channel.awaitMessages(filter, {
                            max : 1,
                            time : 10000,
                            errors : ['time']
                        })
                        if(response) {
                            membersend('Gratulacje, zalogowano.')
                            member.roles.add("783410291957956619")
                        }
                    } catch (error) {
                        member.send(`Zostałeś wyrzucony z **${member.guild.name}** za niepoprawną odpowiedź na captcha.`)
                        member.kick()
                    }
                })
        } catch (error) {
            console.log(error)
        }
})


client.login(config.token)