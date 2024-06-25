import { fetchPrefabs } from "@/lib/serverUtils"
import { TSetterFunction } from "@/lib/types"
import { add } from "date-fns"
import { z } from "zod"
import { createStore } from "zustand/vanilla"

export const renewalPeriodEnum = z.enum(["annually", "monthly", "weekly", "custom"], {
    invalid_type_error: "Incorrect value",
    required_error: "Required",
    message: "Required",
})

export type TRenewalPeriodEnum = z.infer<typeof renewalPeriodEnum>

export const PaymentStatus = z.enum(["paid", "pending", "upcoming"], {
    invalid_type_error: "Incorrect value",
    required_error: "Required",
    message: "Required",
})
export type TPaymentStatus = z.infer<typeof PaymentStatus>

export const PaymentSchema = z.object({
    date: z.date(),
    paymentStatusEnum: PaymentStatus,
    amount: z.coerce.number().optional(),
    currencyId: z.string().uuid("Please select a currency").optional(),
})
export type TPayment = z.infer<typeof PaymentSchema>

export const SubscriptionFormSchema = z.object({
    name: z.string().min(3),
    creationDate: z.date(),
    currencyId: z.string().uuid("Please select a currency").optional(),
    renewalAmount: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.coerce.number({ message: "Required" }).nonnegative()
    ),
    renewalPeriodEnum: renewalPeriodEnum,
    renewalPeriodDays: z.coerce.number().gte(1).optional(),
    uuid: z.string().uuid(),
    upcomingPaymentDate: z.date().min(add(new Date(), { days: 1 })),
})

export type TSubscription = z.infer<typeof SubscriptionFormSchema>

export type TOnboardingForm = {
    subscriptions: TSubscription[]
}

export const PrefabSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    image: z.string(),
})

export type TPrefab = z.infer<typeof PrefabSchema>

export type TEmail = { subject: string; labels: string[]; body: string; sender: string }

export type TOnboardingState = {
    activePage: number
    selectedPrefabs: string[]
    prefabs: TPrefab[]
    selectedServiceId: string | null
    selectedEmails: TEmail[]
    emails: TEmail[] | null
    emailNextPageToken?: string
}

export type TOnboardingActions = {
    setSelectedPrefabs: TSetterFunction<[string[]]>
    setActivePage: TSetterFunction<[number]>
    setPrefabs: TSetterFunction<[]>
    setSelectedServiceId: TSetterFunction<[string]>
    setSelectedEmails: TSetterFunction<[TEmail[]]>
    setEmails: TSetterFunction<[TEmail[]]>
    setEmailNextPageToken: TSetterFunction<[string | undefined]>
}

export type TOnboardingStore = TOnboardingState & TOnboardingActions

export const createOnboardingStore = () => {
    return createStore<TOnboardingStore>((set) => ({
        activePage: 0,
        setActivePage: (newActivePage) => set({ activePage: newActivePage }),

        selectedPrefabs: [],
        setSelectedPrefabs: (values) => set({ selectedPrefabs: values }),

        prefabs: [],
        setPrefabs: async () => {
            const res = await fetchPrefabs()
            if (res.data) set({ prefabs: res.data })
        },

        selectedServiceId: null,
        setSelectedServiceId: (value) => set({ selectedServiceId: value }),

        selectedEmails: [],
        setSelectedEmails: (values) => set({ selectedEmails: values }),

        emails: null,
        setEmails: (values) => set({ emails: values }),

        emailNextPageToken: undefined,
        setEmailNextPageToken: (value) => set({ emailNextPageToken: value }),
    }))
}
