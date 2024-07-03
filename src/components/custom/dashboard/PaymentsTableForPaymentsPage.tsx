// tanstack table with shadcn, show subscription name. show payment method. show amount. show status. show date. show actions.

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { format } from "date-fns"
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui"
import { MoreHorizontal, SortAsc, SortDesc } from "lucide-react"
import { TAxiosPaymentDetails } from "@/lib/types"
import { useState } from "react"
import { useUserStore } from "@/state/context/UserContext"
import { useRenderAmount } from "@/lib/utils"
import { PaymentStatus } from "@/state/onboarding"

export default function PaymentsTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const currencies = useUserStore((state) => state.currencies)
    const subscriptions = useUserStore((state) => state.subscriptions)
    const payments = useUserStore((state) => state.payments)

    const renderAmount = useRenderAmount(currencies)

    const columns: ColumnDef<TAxiosPaymentDetails>[] = [
        {
            id: "subscription",
            header: "Subscription",
            cell: ({ row }) => {
                const { subscriptionId } = row.original
                const subscription = subscriptions.find((sub) => sub.uuid === subscriptionId)

                return <span>{subscription ? subscription.name : "-"}</span>
            },
            enableSorting: true,
            enableGrouping: true,
            filterFn: (row, _id, value) => {
                const subscription = subscriptions.find((sub) => sub.uuid === row.original.subscriptionId)

                return subscription?.name.toLowerCase().includes(value.toLowerCase()) ?? false
            },
        },
        {
            id: "date",
            accessorKey: "date",
            header: ({ column }) => (
                <div className="flex items-center gap-2">
                    Payment Date
                    <Button
                        variant={column.getIsSorted() ? "secondary" : "ghost"}
                        size="icon"
                        className="size-8"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {
                            {
                                asc: <SortAsc className="h-4 w-4 " />,
                                desc: <SortDesc className="h-4 w-4" />,
                                none: <SortAsc className="h-4 w-4" />,
                            }[column.getIsSorted() === false ? "none" : column.getIsSorted() === "asc" ? "asc" : "desc"]
                        }
                    </Button>
                </div>
            ),
            cell: ({ row }) => <span>{format(new Date(row.getValue("date")), "MMMM dd, yyyy")} </span>,
            enableSorting: true,
            enableHiding: true,
            enableGrouping: true,
            enableResizing: true,
            sortingFn: (rowA, rowB) => {
                const dateA = new Date(rowA.getValue("date")).getTime()
                const dateB = new Date(rowB.getValue("date")).getTime()
                return dateA - dateB
            },
        },
        {
            id: "amount",
            accessorKey: "amount",
            header: ({ column }) => (
                <div className="flex items-center gap-2 justify-end">
                    Amount
                    <Button
                        variant={column.getIsSorted() ? "secondary" : "ghost"}
                        size="icon"
                        className="size-8"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {
                            {
                                asc: <SortAsc className="h-4 w-4 " />,
                                desc: <SortDesc className="h-4 w-4" />,
                                none: <SortAsc className="h-4 w-4" />,
                            }[column.getIsSorted() === false ? "none" : column.getIsSorted() === "asc" ? "asc" : "desc"]
                        }
                    </Button>
                </div>
            ),
            sortingFn: (rowA, rowB) => {
                const amountA = rowA.original.amount
                const amountB = rowB.original.amount
                return amountA - amountB
            },
            cell: ({ row }) => {
                const { currencyId, amount } = row.original
                return <div className="text-right font-medium">{renderAmount(currencyId, amount)}</div>
            },
            enableSorting: true,
            enableHiding: false,
        },
        {
            header: "Status",
            accessorKey: "paymentStatusEnum",
            cell: ({ row }) => <span className="uppercase">{row.getValue("paymentStatusEnum")}</span>,
            enableSorting: true,
            enableHiding: false,
            enableGrouping: true,
        },

        {
            header: "Payment Method",
            accessorKey: "paymentMethod",
            cell: ({ row }) => <span>{row.getValue("paymentMethod") || "-"}</span>,
            enableSorting: true,
            enableHiding: false,
            enableGrouping: true,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const payment = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.uuid)}>
                                Copy payment ID
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: payments,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    if (!payments) return null
    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search By Subscription"
                    value={(table.getColumn("subscription")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("subscription")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />

                {/* filter by payment status render a select here */}
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter By Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value={PaymentStatus.Values.paid}>Paid</SelectItem>
                        <SelectItem value={PaymentStatus.Values.pending}>Pending</SelectItem>
                        <SelectItem value={PaymentStatus.Values.upcoming}>Upcoming</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{" "}
                    row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
