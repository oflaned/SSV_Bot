
import TelegramApi from "node-telegram-bot-api"

const token = '5469811516:AAFc-5JWBoWYtpYJkH5Uig1yFwLWHInQ3VM'

const bot = new TelegramApi(token, {polling: true})


const start = () =>{

bot.setMyCommands([
  {
    command:'/start',
    description: 'Замотивируйся'
   },
    {
    command:'/you',
    description: 'Это ты)'
   },
])


bot.on('message', async msg=>{
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === '/start'){

    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/06c/d14/06cd1435-9376-40d1-b196-097f5c30515c/12.webp')
    return bot.sendMessage(chatId,`${msg.from.first_name}, Ты лучший!!!`)

  }
    
  if (text === '/you'){
    return bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/06c/d14/06cd1435-9376-40d1-b196-097f5c30515c/6.webp')
  }
  await bot.sendMessage(chatId,`Ты мне написал ${text} и ты крут!!`)
})

}

start()