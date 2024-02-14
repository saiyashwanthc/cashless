import { fetchFilteredStudents, fetchFilteredTransactions } from "@/lib/data"
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

export default async function TransactionsTable({
  query,
  dateFrom,
  dateTo,
  dept,
  currentPage,
}: {
  query: string
  dateFrom: string
  dateTo: string
  currentPage: number
  dept?: Dept
}) {
  const transactions = await fetchFilteredTransactions(
    query,
    dateFrom,
    dateTo,
    currentPage
  )

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg lg:p-2 md:pt-0">
          <div className="md:hidden">
            {transactions?.map((transaction) => (
              <Card
                key={transaction.id}
                // className="mb-2 w-full rounded-md dark:bg-stone-900 bg-white p-4"
                className="mb-2 p-2 w-full"
              >
                <CardHeader>
                  <CardTitle className="flex flex-row gap-2 justify-between items-center">
                    <div className="pl-2.5">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          className="object-cover"
                          src={transaction.student.photo}
                        />
                        <AvatarFallback>
                          {transaction.student.name.split(" ").map((n) => n[0])}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {format(transaction.date, "LLL dd, y")}
                  </CardTitle>
                  <div className="flex flex-row justify-between">
                    <RegdBadge
                      className="w-12 text-center"
                      regd_no={transaction.regd_no}
                    />
                    <div className="space-x-2 items-center">
                      <Badge className="w-min" variant={"outline"}>
                        {transaction.id}
                      </Badge>
                      <span> {transaction.particulars}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-row justify-between">
                  <Badge className="">{transaction.department}</Badge>
                  <span className="font-semibold">
                    <TransactedAmount amount={transaction.amount} />
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <Table className="hidden min-w-full md:table">
              <TableHeader className="rounded-lg text-left text-sm font-normal">
                <TableRow className="">
                  <TableHead
                    scope="col"
                    className="px-4 py-5 font-semibold sm:pl-6"
                  >
                    <span className="text-nowrap">TiD</span>
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="px-3 py-5 font-medium sm:pl-6"
                  >
                    Student
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="px-3 py-5 font-medium sm:pl-6"
                  >
                    Particulars
                  </TableHead>
                  <TableHead scope="col" className="px-3 py-5 font-medium">
                    Amount
                  </TableHead>
                  <TableHead scope="col" className="px-3 py-5 font-medium">
                    <SelectDate className="hidden lg:block" />
                    <span className="lg:hidden">Date</span>
                  </TableHead>
                  <TableHead scope="col" className=" py-5 font-medium">
                    Department
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="">
                {transactions?.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="w-full border-b py-2 text-sm  last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <TableCell className="whitespace-nowrap px-3 py-3">
                      <Badge variant="outline" className="text-md">
                        {transaction.id}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            className="object-cover"
                            src={transaction.student.photo}
                          />
                          <AvatarFallback>
                            {transaction.student.name
                              .split(" ")
                              .map((n) => n[0])}
                          </AvatarFallback>
                        </Avatar>
                        <div className="md:hidden lg:flex">
                          <RegdBadge regd_no={transaction.regd_no} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 py-3 ">
                      {transaction.particulars}
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-3 py-3">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 py-3 text-center ">
                      {format(transaction.date, "LLL dd, y")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 py-3 ">
                      <Badge variant="outline">{transaction.department}</Badge>
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