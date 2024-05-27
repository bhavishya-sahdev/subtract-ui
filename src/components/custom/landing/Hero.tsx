import React from "react"

export default function Hero() {
    return (
        <div className="h-auto md:h-[60%] p-4">
            {/* Heading */}
            <div className="w-full text-center mb-4">
                <h1 className="text-2xl md:text-3xl font-bold">Take Control of Your Subscriptions</h1>
            </div>

            {/* Use Cases */}
            <div className="w-full flex flex-col md:flex-row justify-around mb-4">
                <div className="w-full md:w-1/3 p-2">
                    <div className="h-full bg-orange-400 rounded-sm shadow-xl hover:shadow-orange-300/30 ease-in duration-500 p-4">
                        <h2 className="text-lg md:text-xl font-semibold mb-2">Track</h2>
                        <p>Use case 1.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/3 p-2">
                    <div className="h-full bg-orange-400 rounded-sm shadow-xl hover:shadow-orange-300/30 ease-in duration-500 p-4">
                        <h2 className="text-lg md:text-xl font-semibold mb-2">Manage</h2>
                        <p>Use case 2.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/3 p-2">
                    <div className="h-full bg-orange-400 rounded-sm shadow-xl hover:shadow-orange-300/30 ease-in duration-500 p-4">
                        <h2 className="text-lg md:text-xl font-semibold mb-2">Save</h2>
                        <p>Use case 3.</p>
                    </div>
                </div>
            </div>

            {/* Subheading */}
            <div className="w-full text-center">
                <h2 className="text-xl md:text-2xl font-semibold">Your Subheading Here</h2>
            </div>
        </div>
    )
}
