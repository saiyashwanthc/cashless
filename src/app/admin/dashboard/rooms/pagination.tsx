"use client"

import { generatePagination } from "@/lib/utils"
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import Link from "next/link"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { usePathname, useSearchParams } from "next/navigation"

const floor = ["A", "B", "C", "S"]

export default function MyPagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  // NOTE: comment in this code when you get to this point in the course

  const allPages = generatePagination(currentPage, totalPages)

  return (
    <>
      {/* NOTE: comment in this code when you get to this point in the course */}

      <div className="inline-flex">
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: "first" | "last" | "single" | "middle" | undefined

            if (index === 0) position = "first"
            if (index === allPages.length - 1) position = "last"
            if (allPages.length === 1) position = "single"
            if (page === "...") position = "middle"

            return (
              <PaginationNumber
                key={page}
                href={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            )
          })}
        </div>

        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  )
  return (
    <Pagination>
      <PaginationContent>
        {currentPage === 1 ? null : (
          <PaginationItem>
            <PaginationPrevious
              href={`/admin/dashboard/rooms?page=${currentPage - 1}`}
            />
          </PaginationItem>
        )}
        {"ABCS".split("").map((e, index) => (
          <PaginationItem key={e}>
            <PaginationLink
              isActive={index === currentPage - 1}
              href={`/admin/dashboard/rooms?page=${index + 1}`}
            >
              {e}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage === 4 ? null : (
          <PaginationItem>
            <PaginationNext
              href={`/admin/dashboard/rooms?page=${currentPage + 1}`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string
  href: string
  position?: "first" | "last" | "middle" | "single"
  isActive: boolean
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center text-sm border",
    {
      "rounded-l-md": position === "first" || position === "single",
      "rounded-r-md": position === "last" || position === "single",
      "z-10 text-white": isActive,
      "hover:bg-gray-100 hover:dark:bg-stone-900":
        !isActive && position !== "middle",
      "text-gray-300": position === "middle",
    }
  )

  return isActive || position === "middle" ? (
    <div className={className}>{floor[Number(page) - 1]}</div>
  ) : (
    <Link href={href} className={className}>
      {floor[Number(page) - 1]}
    </Link>
  )
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string
  direction: "left" | "right"
  isDisabled?: boolean
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center rounded-md border",
    {
      "pointer-events-none text-gray-300": isDisabled,
      "hover:bg-gray-100 hover:dark:bg-stone-900": !isDisabled,
      "mr-2 md:mr-4": direction === "left",
      "ml-2 md:ml-4": direction === "right",
    }
  )

  const icon =
    direction === "left" ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    )

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  )
}