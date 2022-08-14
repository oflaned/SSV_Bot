export const menu = {
    main: JSON.stringify({
        inline_keyboard: [
            [{text: '📄Add node', callback_data: '/add'}],
            [{text: '🗂Nodes list', callback_data: '/nodes'}],
            [{text: '🗑Remove node', callback_data: '/rm'}]
        ]
    }),
    helpAddress: JSON.stringify({
        inline_keyboard: [
            [{text: '🆘How to find address', callback_data: '/HowToFindAddress'}]
        ]
    })
}
