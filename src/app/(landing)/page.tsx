import { Button, Input } from "@/components/ui"
import { BellOff, Calendar, CirclePercent, Folders, LineChart, ListTodo, Telescope, Users } from "lucide-react"

export default function Home() {
    return (
        <>
            <section className="bg-gradient-to-b from-[#19191C] to-[#24242B] md:py-10">
                <div className="max-w-screen-lg px-4 space-y-4 mx-auto pb-20 sm:space-y-8 md:space-y-12 sm:pb-44">
                    <div className="max-w-[800px] mx-auto">
                        <h1 className="text-2xl md:text-3xl font-bold pt-6 mb-1 sm:text-center">
                            Take Control of Your Subscriptions with Subtract
                        </h1>
                        <p className="text-muted-foreground sm:text-center">
                            Never miss a renewal or get charged for something you&apos;re not using. Subtract makes
                            managing subscriptions effortless.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex gap-2 items-center sm:justify-center sm:gap-3">
                            <Input type="email" placeholder="email@example.com" className="w-full sm:w-[300px]" />
                            <Button size="sm">Sign Up</Button>
                        </div>
                        <p className="text-zinc-400 text-xs sm:text-center">Sign up to get notified when we launch.</p>
                    </div>

                    <div className="h-[600px] rounded-t-lg bg-zinc-800"></div>
                </div>
            </section>
            {/* About section */}
            <section id="about" className="bg-[#24242B] sm:py-10 md:py-20">
                <div className="max-w-screen-lg px-4 py-8 space-y-4 mx-auto">
                    <h2 className="text-2xl font-semibold">About</h2>
                    <p>
                        In today&apos;s world of streaming services, SaaS products, and monthly boxes, it&apos;s easy to
                        lose track of your subscriptions. That&apos;s where Subtract comes in - your personal
                        subscription tracking assistant.
                    </p>
                    <p>
                        With Subtract&apos;s innovative AI technology, we automatically detect new subscriptions from
                        your email and add them to your centralized dashboard. Say goodbye to forgotten renewals,
                        unwanted charges, and subscription sprawl.
                    </p>
                </div>
            </section>

            {/* Features section */}
            <section id="features" className="bg-[#1C1C21] sm:py-10 md:py-20">
                <div className="py-8 space-y-4 max-w-screen-lg mx-auto px-4">
                    <div>
                        <h2 className="text-2xl font-semibold">Features</h2>
                    </div>

                    <div className="flex gap-4 overflow-scroll scrollbar-hide [&>div]:bg-[#2F2F38] [&>div]:p-4 [&>div]:border [&>div]:rounded [&>div]:space-y-4 [&>div]:min-w-[300px]">
                        <div>
                            <CirclePercent size={36} className="stroke-zinc-300" />
                            <div className="space-y-1">
                                <h3 className="text-xl">Budget Tracking</h3>
                                <p className="text-zinc-300">
                                    Never go over budget again. Set custom limits and get alerts when you&apos;re
                                    approaching them.
                                </p>
                            </div>
                        </div>

                        <div>
                            <Folders size={36} className="stroke-zinc-300" />
                            <div className="space-y-1">
                                <h3 className="text-xl">Subscription Categories</h3>
                                <p className="text-zinc-300">
                                    Easily organize subscriptions into categories like streaming, productivity, and
                                    lifestyle.
                                </p>
                            </div>
                        </div>

                        <div>
                            <ListTodo size={36} className="stroke-zinc-300" />
                            <div className="space-y-1">
                                <h3 className="text-xl">Subscription Auditing</h3>
                                <p className="text-zinc-300">
                                    Subtract will prompt you to review and cancel any subscriptions you&apos;re no
                                    longer using.
                                </p>
                            </div>
                        </div>

                        <div>
                            <Users size={36} className="stroke-zinc-300" />
                            <div className="space-y-1">
                                <h3 className="text-xl">Family Sharing</h3>
                                <p className="text-zinc-300">
                                    Share subscription details seamlessly with family members on your plan.
                                </p>
                            </div>
                        </div>

                        <div>
                            <BellOff size={36} className="stroke-zinc-300" />
                            <div className="space-y-1">
                                <h3 className="text-xl">Snooze Renewals</h3>
                                <p className="text-zinc-300">
                                    Need a break? Snooze any subscription to temporarily pause renewals.
                                </p>
                            </div>
                        </div>

                        <div>
                            <Calendar size={36} className="stroke-zinc-300" />
                            <div className="space-y-1">
                                <h3 className="text-xl">Calendar Integration</h3>
                                <p className="text-zinc-300">
                                    View all your upcoming subscription renewals and billing dates in your calendar.
                                </p>
                            </div>
                        </div>

                        <div>
                            <Telescope size={36} className="stroke-zinc-300" />
                            <div className="space-y-1">
                                <h3 className="text-xl">Discovery Feed</h3>
                                <p className="text-zinc-300">
                                    Find new apps and services based on what others with similar interests are
                                    subscribing to.
                                </p>
                            </div>
                        </div>

                        <div>
                            <LineChart size={36} className="stroke-zinc-300" />
                            <div className="space-y-1">
                                <h3 className="text-xl">Premium Analytics</h3>
                                <p className="text-zinc-300">
                                    Unlock valuable insights into your subscription spend, trends, and cost savings over
                                    time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Pricing section */}
            <section id="pricing" className=" sm:py-10 md:py-20">
                <div className="max-w-screen-lg px-4 py-8 space-y-4 mx-auto">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold">Pricing</h2>
                        <p className="text-muted-foreground">
                            While Subtract is currently in development, we plan to offer flexible pricing options to
                            meet everyone&apos;s needs when we officially launch.
                        </p>
                    </div>
                    <div className="flex gap-4 overflow-scroll scrollbar-hide [&>div]:bg-[#2F2F38] [&>div]:p-4 [&>div]:border [&>div]:rounded [&>div]:space-y-4 [&>div]:min-w-[300px]">
                        <div className="p-4 border rounded-sm">
                            <h3 className="text-xl">Individual Plan (Coming Soon)</h3>
                            <div>
                                <p>$4.99 per month</p>
                                <p>$49.00 per year</p>
                            </div>
                            <div>
                                <p>Track up to 10 active subscriptions</p>
                                <p>AI subscription detection</p>
                                <p>Renewal reminders and insights</p>
                                <p>Web, mobile & desktop apps</p>
                            </div>
                        </div>

                        <div className="p-4 border rounded-sm">
                            <h3 className="text-xl">Family Plan (Coming Soon)</h3>
                            <div>
                                <p>$9.99 per month</p>
                                <p>$99.00 per year</p>
                            </div>
                            <div>
                                <p>For households of up to 6 members</p>
                                <p>Unlimited subscription tracking</p>
                                <p>AI detection across all linked accounts</p>
                                <p>Shared dashboard and billing</p>
                                <p>Premium cancel/pause functionality</p>
                            </div>
                        </div>

                        <div className="p-4 border rounded-sm">
                            <h3 className="text-xl">Business Plan (Coming Soon)</h3>
                            <div>
                                <p>Centralized subscription management</p>
                                <p>Employee expense tracking</p>
                                <p>Advanced reporting and analytics</p>
                                <p>Dedicated customer support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* CTA section*/}
            <section className="bg-zinc-600 sm:py-10 md:py-20">
                <div className="max-w-screen-lg px-4 py-8 space-y-4 mx-auto">
                    <h2 className="text-2xl">Ready to get started?</h2>

                    <Button>Get Started</Button>
                </div>
            </section>
            {/* Footer section*/}
            <footer className="p-4">
                <div className="max-w-screen-lg px-4 py-8 space-y-4 mx-auto">
                    <p>&copy; 2024 Subtract</p>
                </div>
            </footer>
        </>
    )
}
