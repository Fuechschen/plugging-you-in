module.exports = {
    methods: {
        get: 'get',
        post: 'post',
        put: 'put',
        delete: 'delete'
    },
    baseUrl: 'https://plug.dj',
    endpoints: {
        csrf: '',
        news: '/_/news',
        bans: '/_/bans',
        staff: '/_/staff',
        rooms: '/_/rooms',
        mutes: '/_/mutes',
        token: '/_/auth/token',
        friends: '/_/friends',
        history: '/_/rooms/history',
        ignores: '/_/ignores',
        invites: '/_/friends/invites',
        products: '/_/store/products',
        inventory: '/_/store/inventory',
        roomState: '/_/rooms/state',
        userStats: '/_/users/',
        playlists: '/_/playlists',
        userHistory: '/_/users/me/history',
        transaction: '/_/users/me/transactions',
        favoriteRooms: '/_/rooms/favorites',
        validateUser: '/_/users/validate/',
        validateRoom: '/_/rooms/validate/',

        lock: '/_/booth/lock',
        blurb: '/_/profile/blurb',
        cycle: '/_/booth/cycle',
        login: '/_/auth/login',
        badge: '/_/users/badge',
        avatar: '/_/users/avatar',
        settings: '/_/users/settings',
        language: '/_/users/language',
        ignorefirend: '/_/friends/ignore',
        addBan: '/_/bans/add',

        grabs: '/_/grabs',
        votes: '/_/votes',
        reset: '/_/auth/reset/me',
        purchase: '/_/store/purchase',
        facebook: '/_/auth/facebook',
        joinRoom: '/_/rooms/join',
        addBooth: '/_/booth/add',
        bulkUsers: '/_/users/bulk',
        joinBooth: '/_/booth',
        skip: '/_/booth/skip',
        move: '/_/booth/move',
        createRoom: '/_/rooms',
        updateRoom: '/_/rooms/update',
        updateStaff: '/_/staff/update',

        chat: '/_/chat/',
        session: '/_/auth/session',
        remove: '/_/booth/remove/',
        notification: '/_/notifications/'
    },
    socket: 'wss://godj.plug.dj/socket',
    packetTypes: {
        auth: 'auth',
        chat: 'chat'
    },
    invalidRooms: ['dashboard', 'ba', 'about', 'terms'],
    banDurations: {
        hour: 'h',
        day: 'd',
        permanent: 'f'
    },
    banReasons: {
        violatingCommunityRules: 1,
        verbalAbuse: 2,
        spamming: 3,
        offensiveLanguage: 4,
        negativeAttitude: 5
    }
}
;