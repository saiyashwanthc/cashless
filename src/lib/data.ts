import { unstable_noStore as noStore } from "next/cache"
import prisma from "@/lib/db"
import { Prisma, Room, UserRoles, subscriptions } from "@prisma/client"

export type RoomWithRelations = Prisma.roomsGetPayload<{
  include: {
    subscriptions: { include: { details: true } }
    room_leaders: { include: { profile: true } }
    members: true
  }
}>

export type SubscriptionWithDetails = Prisma.subscriptionsGetPayload<{
  include: { details: true }
}>

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

// STUDENTS
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
        AND: [
          {
            OR: [
              {
                role: "STUDENT",
              },

              {
                role: "PHOTOCOPY",
              },
            ],
          },
          {
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

// ROOMS
export async function fetchRooms(currentPage: number) {
  noStore()
  const offset = (currentPage - 1) * 8
  try {
    const rooms: RoomWithRelations[] = await prisma.rooms.findMany({
      include: {
        room_leaders: {
          include: {
            profile: true,
          },
        },
        members: true,
        subscriptions: {
          include: {
            details: true,
          },
        },
      },
      skip: offset,
      take: 8,
    })
    return rooms
  } catch (error) {
    console.error("Failed to fetch rooms", error)
  }
}

export async function fetchRoomById(id: Room) {
  noStore()

  try {
    const room = await prisma.rooms.findUnique({
      where: {
        room_no: id,
      },

      include: {
        members: true,
        subscriptions: {
          include: {
            details: true,
          },
        },
        room_leaders: {
          include: {
            profile: true,
          },
        },
      },
    })
    return room
  } catch (err) {
    console.error("Database Error:", err)
    throw new Error("Failed to fetch this student.")
  }
}
