const api = {
    auth: {
        signup: "/auth/signup",
        signin: "/auth/signin",
    },
    user: {
        getDetails: "/user",
        getSubscriptions: "/user/subscriptions",
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
