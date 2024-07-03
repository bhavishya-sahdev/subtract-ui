const api = {
    auth: {
        signup: "/auth/signup",
        signin: "/auth/signin",
        google: "/auth/google",
    },
    user: {
        getDetails: "/user",
        getSubscriptions: "/user/subscriptions",
        getPayments: "/user/payments",
        updateOnboardingStatus: "/user/update-onboarding-status",
        mailAccess: "/user/google/access",
        readMails: "/user/google/mails",
        extract: "/user/google/mails/extract",
    },
    subscription: {
        create: "/subscription",
        createWithPayments: "/subscription/payments",
        remove: (id: string) => `/subscription/${id}/delete`,
        stats: "/subscription/by-timeframe",
        update: (id: string) => `/subscription/${id}/update`,
    },
    payment: {
        create: "/payment",
        remove: (id: string) => `/payment/${id}/delete`,
        stats: "/payment/by-timeframe",
    },
    utils: {
        currency: "/currency",
        prefab: "/prefab",
    },
}
export default api
