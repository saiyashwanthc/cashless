import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RecentTransactions } from "@/components/student/recent-transactions"
import { Highlights } from "./hightlights"
import { DashboardIcon } from "@radix-ui/react-icons"

export default function Overview() {
  return (
    <div className="flex flex-col h-4/5  space-y-4">
      {/* Highlights */}
      <Highlights />
      {/* Overview graph and recent transactions */}
      <div className="flex-grow grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>Sairam</CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Expenses </CardTitle>
            <CardDescription>This week your spent</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">Graph</CardContent>
        </Card>
      </div>{" "}
    </div>
  )
}