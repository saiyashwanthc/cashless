import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchRecentTransactions } from "@/lib/data"
import { format } from "date-fns"
import { Session } from "next-auth"
import { TransactedAmount } from "../transacted-amount"

export async function RecentTransactions({
  authdata,
}: {
  authdata: Session | null
}) {
  const transactions = await fetchRecentTransactions(
    authdata?.user.regd_no ?? ""
  )
  return (
    <div className="space-y-5 text-[0.8rem]">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="font-medium leading-none">
              {format(transaction.date, "LLL dd, y")}
            </p>
            <p className="text-muted-foreground">{transaction.particulars}</p>
          </div>
          <div className="text-sm ml-auto font-medium">
            <TransactedAmount amount={transaction.amount} />
          </div>
        </div>
      ))}
    </div>
  )
}
