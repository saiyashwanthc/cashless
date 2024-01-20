import { unstable_noStore as noStore } from "next/cache"
import prisma from "@/lib/db"
import { Room, UserRoles } from "@prisma/client"

const ITEMS_PER_PAGE = 10

export async function fetchStudentById(id: string) {
  noStore()

  try {
    const student = await prisma.users.findUnique({
      where: {
        regd_no: id,
      },
    })
    return student
  } catch (err) {
    console.error("Database Error:", err)
    throw new Error("Failed to fetch this student.")
  }
}

export async function fetchStudentPages(query: string) {
  noStore()
  try {
    const count = (await prisma.users.count({
      where: {
        OR: [
          {
            name: {
              contains: `%${query}%`,
            },
          },
          {
            roll_no: {
              contains: `%${query}%`,
            },
          },
          {
            class: {
              contains: `%${query}%`,
            },
          },
        ],
      },
    })) as Number
    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to Fetch total number of Student Pages")
  }
}

export async function fetchFilteredStudents(
  query: string,
  currentPage: number
) {
  noStore()
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  try {
    const students = await prisma.users.findMany({
      where: {
        OR: [
          {
            name: {
              contains: `%${query}%`,
            },
          },
          {
            roll_no: {
              contains: `%${query}%`,
            },
          },
          {
            class: {
              contains: `%${query}%`,
            },
          },
        ],
      },
      orderBy: {
        roll_no: "asc",
      },
      skip: offset,
      take: ITEMS_PER_PAGE,
    })
    return students
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch students")
  }
}