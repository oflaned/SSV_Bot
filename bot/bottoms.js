export const menu = {
    main: JSON.stringify({
        inline_keyboard: [
            [{text: '📄Add node', callback_data: '/add'}],
            [{text: '🗂Nodes list', callback_data: '/nodes'}],
            [{text: '🗑Remove node', callback_data: '/rm'}]
        ]
    }),
    helpId: JSON.stringify({
        inline_keyboard: [
            [{text: '🆘How to find id', callback_data: '/HowToFindAddress'}]
        ]
    })
}
