'use client'

import * as React from "react"
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Search,
    Ticket,
    Video,
    Users,
    Loader2
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { globalSearch } from "@/lib/actions/search-actions"
import { useRouter } from "next/navigation"

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [data, setData] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    React.useEffect(() => {
        if (query.length < 2) {
            setData([])
            return
        }

        const timer = setTimeout(async () => {
            setLoading(true)
            const result = await globalSearch(query)
            if (result.success) {
                setData(result.data || [])
            }
            setLoading(false)
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-input bg-background/50 px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full sm:w-[250px] justify-between text-muted-foreground"
            >
                <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>Search...</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Type a command or search..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    {loading && <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Searching...</div>}

                    {!loading && data.length > 0 && (
                        <CommandGroup heading="Search Results">
                            {data.map((item) => (
                                <CommandItem
                                    key={`${item.type}-${item.id}`}
                                    value={item.title + item.subtitle}
                                    onSelect={() => runCommand(() => router.push(item.url))}
                                >
                                    {item.type === 'TICKET' && <Ticket className="mr-2 h-4 w-4" />}
                                    {item.type === 'CUSTOMER' && <Users className="mr-2 h-4 w-4" />}
                                    {item.type === 'TUTORIAL' && <Video className="mr-2 h-4 w-4" />}
                                    <div className="flex flex-col">
                                        <span>{item.title}</span>
                                        {item.subtitle && <span className="text-xs text-muted-foreground">{item.subtitle}</span>}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    <CommandSeparator />

                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
                            <Calculator className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/support'))}>
                            <Smile className="mr-2 h-4 w-4" />
                            <span>Support</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
