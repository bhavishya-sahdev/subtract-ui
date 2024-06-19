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
    },
    subscription: {
        create: "/subscription",
        createWithPayments: "/subscription/payments",
    },
    utils: {
        currency: "/currency",
        prefab: "/prefab",
    },
}
export default api
