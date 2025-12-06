"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function Navbar({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
        <>
            <Link
                href="/"
                onClick={() => mobile && setIsOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/" ? "text-foreground" : "text-muted-foreground"
                    } ${mobile ? "text-lg py-2" : ""}`}
            >
                Dashboard
            </Link>
            <Link
                href="/products"
                onClick={() => mobile && setIsOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/products" ? "text-foreground" : "text-muted-foreground"
                    } ${mobile ? "text-lg py-2" : ""}`}
            >
                All Products
            </Link>
        </>
    )

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
                        LoanPicks
                    </Link>
                    <nav className="flex items-center space-x-6">
                        <NavLinks />
                    </nav>
                </div>

                {/* Mobile Nav */}
                <div className="md:hidden flex items-center">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Open Menu">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col gap-4">
                            <Link href="/" onClick={() => setIsOpen(false)} className="font-bold text-xl mb-4">
                                LoanPicks
                            </Link>
                            <NavLinks mobile />
                        </SheetContent>
                    </Sheet>
                    <span className="font-bold ml-4 md:hidden">LoanPicks</span>
                </div>

                <div className="flex items-center space-x-2">
                    {children}
                </div>
            </div>
        </header>
    )
}
