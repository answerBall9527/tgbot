const { Bot, session } = require("grammy");
const { conversations, createConversation } = require("@grammyjs/conversations");

const bot = new Bot("7760913066:AAFooy8K0NduQasAlOG3_hlPlKqRLIa03XI");  // 你的 Bot Token 已填入

// 使用 session 插件，存储会话状态
bot.use(session({ initial: () => ({}) }));

// 启用 conversations 插件
bot.use(conversations());

console.log('Bot is starting...');

// 创建一个 conversation 函数
async function userInfoConversation(conversation, ctx) {
    // Step 1: 获取用户的名字
    await ctx.reply("输入 username:");
    const nameMessage = await conversation.waitFor("message:text");
    const userName = nameMessage.message.text;

    // Step 2: 获取用户的钱包地址
    await ctx.reply("输入钱包地址:");
    const walletMessage = await conversation.waitFor("message:text");
    const walletAddress = walletMessage.message.text;

    // Step 3: 确认用户信息
    await ctx.reply(`你输入的用户名是: ${userName}, 钱包地址是: ${walletAddress}。输入 'yes' 以确认，或 'no' 重新输入。`);
    const confirmationMessage = await conversation.waitFor("message:text");
    const confirmation = confirmationMessage.message.text.toLowerCase();

    if (confirmation === "yes") {
        await ctx.reply("信息已确认，感谢！");
    } else {
        await ctx.reply("请重新开始输入。");
        return await userInfoConversation(conversation, ctx);  // 重新开始对话
    }
}

// 注册 conversation
bot.use(createConversation(userInfoConversation));

// 设置 /start 命令为展示 "Start" 按钮并添加 Web App 和分享按钮
bot.command("start", async (ctx) => {
    await ctx.reply("点击按钮开始输入信息，打开 Web App 或分享给他人:", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Start", callback_data: "start_conversation" }],  // 启动对话的按钮
                [{ text: "Open Web App", web_app: { url: "https://test2-git-main-answerball9527s-projects.vercel.app/" } }],  // 打开 Web App 的按钮
                // [{ text: "Open localhost App", web_app: { url: "http://192.168.8.154:3000/u/tomoDemo" } }],  // 打开 Web App 的按钮
                [{ text: "Share with others", switch_inline_query: "Check this out!" }]  // 分享按钮
            ]
        }
    });
});

// 处理按钮点击事件，进入多步对话流程
bot.on("callback_query:data", async (ctx) => {
    if (ctx.callbackQuery.data === "start_conversation") {
        await ctx.conversation.enter("userInfoConversation");  // 进入多步对话
        await ctx.answerCallbackQuery();  // 关闭按钮的加载状态
    }
});

// 启动机器人
bot.start().then(() => {
    console.log('Bot started');
});


bot.command("ping", async (ctx) => {
    await ctx.reply("Pong!");
});