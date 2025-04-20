"use client";

import { Button } from "@/components/ui/button"
import { ClapperboardIcon, UserCircleIcon } from "lucide-react"
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"

export const AuthButton = () => {
    // Add different auth states
    return (
        <>

            {/* this will appear if we are signed in */}
            <SignedIn>
                <UserButton>
                    <UserButton.MenuItems>
                        {/* Add User profile menu button */}
                        <UserButton.Link 
                            label="Studio"
                            href="/studio"
                            labelIcon={<ClapperboardIcon className="size-4"/>}
                        />
                        <UserButton.Action label="manageAccount" />
                    </UserButton.MenuItems>
                </UserButton>
            </SignedIn>

            {/* this will appear if we are signed out */}
            <SignedOut>
                <SignInButton mode="modal">
                    <Button
                        variant={"outline"}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none [&_svg]:size-4"
                    >
                        <UserCircleIcon />
                        Sign In
                    </Button>
                </SignInButton>
            </SignedOut>
            
        </>
    )
}