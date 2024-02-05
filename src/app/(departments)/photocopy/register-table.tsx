import { fetchFilteredRegisterEntries } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
// import { UpdateStudent } from "./buttons"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import StudentAvatar from "@/components/student-avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import SelectDate from "@/components/dashboard/transactions/select-date"
import { Dept } from "@prisma/client"
import { format } from "date-fns"
import { TransactedAmount } from "@/components/transacted-amount"
import { LightningBoltIcon } from "@radix-ui/react-icons"
import { Wallet } from "lucide-react"

export default async function PhotocopyRegisterTable({
  query,
  dateFrom,
  dateTo,
  currentPage,
}: {
  query: string
  dateFrom: string
  dateTo: string
  dept?: Dept
  currentPage: number
}) {
  const register_entries = await fetchFilteredRegisterEntries(
    query,
    dateFrom,
    dateTo,
    currentPage
  )
  // TODO Hover to show Print specifications
  return (
    <div className="mt-4 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="  md:pt-0">
          <div className="md:hidden">
            {register_entries?.map((entry) => (
              <Card
                key={entry.id}
                // className="mb-2 w-full rounded-md dark:bg-stone-900 bg-white p-4"
                className="mb-2 p-2 w-full"
              >
                <CardHeader>
                  <CardTitle className="flex flex-row gap-2 justify-between items-center">
                    <Badge
                      className="w-16 align-center"
                      content="hi"
                      variant={"outline"}
                    >
                      {entry.id}
                    </Badge>
                    <span>{format(entry.order_placed_at, "LLL dd, y")}</span>
                  </CardTitle>
                  <CardDescription className="text-right">
                    {entry.notes}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex  flex-row justify-between">
                  <Badge>{entry.status}</Badge>
                  <span className="text-lg font-semibold">
                    <TransactedAmount amount={entry.cost as number} />
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="hidden  min-w-full md:table">
            <Table>
              <TableHeader className=" text-left text-sm font-normal">
                <TableRow className="">
                  <TableHead scope="col" className="">
                    <span className="px-2">TiD</span>
                  </TableHead>
                  <TableHead scope="col" className="">
                    Notes
                  </TableHead>
                  <TableHead scope="col" className="">
                    Amount
                  </TableHead>
                  <TableHead scope="col" className="">
                    <SelectDate />
                  </TableHead>
                  <TableHead scope="col" className="">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="">
                {register_entries?.map((entry) => (
                  <TableRow
                    key={entry.id}
                    className="w-full border-b py-2 text-sm  "
                  >
                    <TableCell className="whitespace-nowrap px-3 py-3">
                      <Badge variant="outline" className="text-md">
                        {entry.id}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 py-3 ">
                      {entry.notes ? (
                        <span>{entry.notes}</span>
                      ) : (
                        <span className="text-muted-foreground">Empty</span>
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-3 py-3 text-right">
                      {entry.status === "PAID" ? (
                        <span className="flex flex-row">
                          <TransactedAmount amount={entry.cost as number} />
                          {entry.mode_of_pay === "CASHLESS" ? (
                            <LightningBoltIcon className="h-min text-muted-foreground" />
                          ) : null}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 py-3 text-center ">
                      {format(entry.order_placed_at, "LLL dd, y")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 py-3 ">
                      <Badge>{entry.status}</Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        {/* <UpdateStudent id={student.regd_no} /> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function RegdBadge({
  regd_no,
  className,
}: {
  regd_no: string
  className?: string
}) {
  return (
    <Badge variant="outline" className="h-min text-[14px]">
      <span>{regd_no}</span>
    </Badge>
  )
}
