"use client"

import {
    Button,
    Card,
    CardContent,
    Label,
    Separator,
    ToggleGroup,
    ToggleGroupItem,
    useToast,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Checkbox,
} from "@/components/ui"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import api from "@/lib/api"
import { client } from "@/lib/axiosClient"
import { initiateNewSubscription } from "@/lib/utils"
import { useOnboardingStore } from "@/state/context/OnboardingContext"
import { useUserStore } from "@/state/context/UserContext"
import { TSubscription } from "@/state/onboarding"
import { useGoogleLogin } from "@react-oauth/google"
import { xor, intersection, union } from "lodash"
import { Loader2, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import { useFieldArray } from "react-hook-form"

export type TPickSubscriptionsProps = {
    fieldArray: ReturnType<typeof useFieldArray<{ subscriptions: TSubscription[] }>>
}

export default function PickSubscriptions({ fieldArray: { fields, remove, append } }: TPickSubscriptionsProps) {
    const { setActivePage, setSelectedServiceId, prefabs, selectedPrefabs, setSelectedPrefabs } = useOnboardingStore(
        (state) => state
    )
    const { user } = useUserStore((state) => state)

    const { toast } = useToast()

    const [openPermissionsDialog, setOpenPermissionsDialog] = useState(false)
    const [inProgress, setInProgress] = useState(false)

    const [selectedEmails, setSelectedEmails] = useState<{ subject: string; labels: string[]; body: string }[]>([])
    const [emails, setEmails] = useState<{ subject: string; labels: string[]; body: string }[] | null>(null)
    const [nextPageToken, setNextPageToken] = useState<string>()
    const [activeEmail, setActiveEmail] = useState<{ subject: string; labels: string[]; body: string } | null>(null)

    const handleGoogleAuth = useGoogleLogin({
        onSuccess: async (res) => {
            await client.post(api.auth.google, {
                code: res.code,
            })
            proceedWithSync()
        },
        flow: "auth-code",
        scope: "email profile https://www.googleapis.com/auth/gmail.readonly",
    })

    const handleSyncWithEmail = async () => {
        if (!user) return
        try {
            if (user.isGoogleUser) {
                const res = await client.get(api.user.mailAccess)
                if (res.data.error !== null) {
                    if ("code" in res.data.error && res.data.error.code === "G-403") {
                        setOpenPermissionsDialog(true)
                    }
                    return
                }
            } else {
                handleGoogleAuth()
            }
        } catch (e: any) {
            handleGoogleAuth()
        } finally {
            proceedWithSync()
        }
    }

    const proceedWithSync = async () => {
        try {
            const res = await client.get(api.user.readMails, {
                params: {
                    pageToken: nextPageToken,
                },
            })
            if (res.data.data.messages.length === 0) return toast({ title: "No emails found" })

            if (emails) setEmails([...emails, ...res.data.data.messages])
            else {
                setEmails(res.data.data.messages)

                setActiveEmail(res.data.data[0])
            }

            if (res.data.data.nextPageToken) setNextPageToken(res.data.data.nextPageToken)
            else setNextPageToken(undefined)
        } catch (e: any) {
            toast({ title: "Failed to sync emails", description: "Please try again later" })
            console.error(e)
        } finally {
            setInProgress(false)
        }
    }

    useEffect(() => {
        console.log(selectedEmails)
    }, [selectedEmails])

    const handleToggleSelection = (v: string[]) => {
        let updated: string[] = []
        const diff = xor(v, selectedPrefabs)[0]
        const selectedPrefab = prefabs.filter((p) => p.id === diff)[0]

        if (v.length > selectedPrefabs.length) {
            updated = union(v, selectedPrefabs)
            append(initiateNewSubscription({ uuid: selectedPrefab.id, name: selectedPrefab.name }))
            setSelectedServiceId(selectedPrefab.id)
        } else {
            updated = intersection(v, selectedPrefabs)
            const getIndex = fields.findIndex((item) => item.id === diff)
            remove(getIndex)
        }
        setSelectedPrefabs(updated)
    }

    const handleSubmit = async () => {
        // default the selected subscription to either a newly created empty object's id
        // the first selected service's id
        if (fields.length === 0) {
            const newSub = initiateNewSubscription()
            append(newSub)
            setSelectedServiceId(newSub.uuid)
        }
        if (selectedEmails.length > 0) {
            const res = await client.post(api.user.extract, {
                messages: selectedEmails,
            })
            console.log(res)
        }
        setActivePage(2)
    }

    return (
        <div>
            <p className="text-2xl">Add subscriptions</p>

            {emails !== null ? (
                <>
                    <p className="text-muted-foreground mb-2">Please select relavent emails from the list below.</p>
                    <div className="flex flex-col md:flex-row flex-grow-0 w-full h-[700px] bg-zinc-900 rounded-sm">
                        {/* email subject */}
                        {emails.length > 0 ? (
                            <>
                                <div className="overflow-y-auto shrink-0 h-[200px] w-full md:h-full md:w-[250px] rounded-l-sm bg-zinc-800 [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-zinc-700">
                                    {emails
                                        .filter((email) => !email.labels.includes("CATEGORY_PROMOTIONS"))
                                        .map((email, idx) => (
                                            <div key={idx} className="flex gap-2 p-2 items-center">
                                                <Checkbox
                                                    onCheckedChange={(checked) => {
                                                        if (!checked) {
                                                            // Deselect
                                                            setSelectedEmails(
                                                                selectedEmails.filter(
                                                                    (e) => e.subject !== email.subject
                                                                )
                                                            )
                                                        } else {
                                                            // Select
                                                            setSelectedEmails([...selectedEmails, email])
                                                        }
                                                    }}
                                                />
                                                <button
                                                    className="w-full text-left whitespace-nowrap overflow-hidden overflow-ellipsis text-sm"
                                                    onClick={() => setActiveEmail(email)}
                                                >
                                                    <span className="">{email.subject}</span>
                                                </button>
                                            </div>
                                        ))}
                                    {nextPageToken !== undefined ? (
                                        <button
                                            onClick={() => {
                                                setInProgress(true)
                                                proceedWithSync()
                                            }}
                                            disabled={inProgress}
                                            className="flex items-center justify-center w-full p-3 bg-zinc-600 hover:bg-zinc-500 gap-1"
                                        >
                                            {inProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Load more
                                        </button>
                                    ) : null}
                                </div>
                                <div className="space-y-2 md:h-full w-full flex-shrink flex flex-col overflow-auto ">
                                    {activeEmail ? (
                                        <>
                                            <p className="text-lg font-semibold bg-zinc-800 px-4 py-2 rounded-tr-sm">
                                                {activeEmail.subject}
                                            </p>
                                            <div className="flex-shrink px-4 py-2">
                                                <p className="text-sm">{activeEmail.body}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-lg font-semibold bg-zinc-800 px-4 py-2 w-full">
                                            Select an email to view
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-lg font-semibold bg-zinc-800 px-4 py-2 w-full">No emails found</p>
                        )}
                    </div>
                </>
            ) : (
                <Button size="sm" className="space-x-2 justify-start mt-2" onClick={handleSyncWithEmail}>
                    {inProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Mail className="stroke-1 w-5 h-5" /> <p>Import from email</p>
                </Button>
            )}

            <Separator className="bg-zinc-600 my-4" />
            <p className="text-muted-foreground">
                You can also pick from the list below to get you started. You can always skip this step.
            </p>
            <Card className="mt-4 max-h-[400px] overflow-auto">
                <CardContent className="p-4">
                    <ToggleGroup
                        type="multiple"
                        className="flex flex-wrap justify-start overflow-x-hidden gap-4"
                        size="custom"
                        onValueChange={(v: string[]) => handleToggleSelection(v)}
                        value={selectedPrefabs}
                    >
                        {prefabs.map((prefab) => (
                            <ToggleGroupItem
                                key={prefab.id}
                                value={prefab.id}
                                aria-label={`Select ${prefab.name}`}
                                className="flex flex-col items-center gap-2 p-2 rounded-md w-24 h-24 box-border"
                            >
                                <Avatar>
                                    <AvatarImage src={prefab.image} alt={prefab.name} />
                                    <AvatarFallback>{prefab.name.replace(" ", "").slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <Label
                                    className={`${
                                        prefab.name.length > 10 ? "line-clamp-2 max-w-16" : "truncate max-w-[100px]"
                                    } text-center`}
                                >
                                    {prefab.name}
                                </Label>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </CardContent>
            </Card>
            <Button className="mt-4" onClick={handleSubmit} disabled={inProgress}>
                {inProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedPrefabs.length > 0 || selectedEmails.length > 0 ? "Next" : "Skip"}
            </Button>

            {/* Auth dialog */}
            <Dialog open={false} onOpenChange={() => setOpenPermissionsDialog(!openPermissionsDialog)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Additional permission required</DialogTitle>
                        <DialogDescription>
                            To sync your email with your subscriptions, we need additional permissions. Please click the
                            button below to proceed.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button size="sm" variant="ghost" onClick={() => setOpenPermissionsDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                handleGoogleAuth()
                                setOpenPermissionsDialog(false)
                            }}
                        >
                            Proceed
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
