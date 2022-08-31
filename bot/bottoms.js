export const menu = {
    main: JSON.stringify({
        inline_keyboard: [
            [{ text: '📄Add node', callback_data: '/add' }],
            [{ text: '🗂Nodes list', callback_data: '/nodes' }],
            [{ text: '🗑Remove node', callback_data: '/rm' }],
            [{ text: '🤖Faucet bot (testing)', callback_data: '/faucetMenu' }],
        ],
    }),
    helpAndMenu: JSON.stringify({
        inline_keyboard: [
            [{ text: '🆘How to find id', callback_data: '/HowToFindAddress' }],
            [{ text: '🔙Menu', callback_data: '/start' }],
        ],
    }),
    addMain: JSON.stringify({
        inline_keyboard: [
            [{ text: '📄Add node', callback_data: '/add' }],
            [{ text: '🔙Menu', callback_data: '/start' }],
        ],
    }),
    addRmMain: JSON.stringify({
        inline_keyboard: [
            [{ text: '📄Add node', callback_data: '/add' }],
            [{ text: '🗑Remove node', callback_data: '/rm' }],
            [{ text: '🔙Menu', callback_data: '/start' }],
        ],
    }),
    goMain: JSON.stringify({
        inline_keyboard: [[{ text: '🔙Menu', callback_data: '/start' }]],
    }),
}
