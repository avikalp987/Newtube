"use client"

import { trpc } from "@/trpc/client"

export const PageClient = () => {
    const [data] = trpc.hello.useSuspenseQuery({
        text: "Vikalp"
    })

    return (
        <div className="">
            PageClient: {data.greeting}
        </div>
    )
}