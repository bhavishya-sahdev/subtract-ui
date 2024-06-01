const api = {
    auth: {
        signup: "/auth/signup",
        signin: "/auth/signin",
    },
    user: {
        getDetails: "/user",
        getSubscriptions: "/user/subscriptions",
        updateOnboardingStatus: "/user/update-onboarding-status",
    },
    subscription: {
        create: "/subscription",
    },
    utils: {
        currency: "/currency",
        prefab: "/prefab",
    },
}
export default api
