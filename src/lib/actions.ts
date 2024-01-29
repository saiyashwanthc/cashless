"use server"

import { z } from "zod"
import prisma from "./db"
import { revalidatePath, unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
import { signIn, signOut } from "@/auth"
import { Room, Status, Subs, UserRoles } from "@prisma/client"
import { UpdateRoomFormSchema } from "@/app/admin/dashboard/rooms/[id]/edit/edit-form"
import fs from "fs"
import {
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
  status_options,
  room_numbers,
} from "./config"
import { UpdateUserFormSchema } from "@/app/settings/edit-form"
import { time } from "console"

export type State = {
  errors?: {
    photo?: string[]
    name?: string[]
    regd_no?: string[]
    password?: string[]
    balance?: string[]
    room_no?: string[]
    class?: string[]
    role?: string[]
    status?: string[]
    room_leaders?: string[]
    subscriptions?: []
  }
  message?: string | null
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials."
        default:
          return "Something went wrong."
      }
    }
    throw error
  }
}

// {Object.values(Room).map((num) => (
//   <option key={Room[num]} value={num}>
//     {Room[num]}
//   </option>
// ))}
const FormSchema = z.object({
  photo: z
    .any()
    .optional()
    .refine((file) => {
      return file?.size <= MAX_FILE_SIZE
    }, `Max image size is 3MB.`)
    .refine((file) => {
      if (file.size == 0) return true
      else return ACCEPTED_IMAGE_TYPES.includes(file?.type)
    }, "Only .png formats are supported."),

  regd_no: z.string().min(4),

  name: z.string().trim().min(1),

  password: z.string({}),

  balance: z.coerce
    .number()
    .gt(0, { message: "Please enter a number greater than $0 :/" }),

  room_no: z
    .enum(room_numbers, {
      invalid_type_error: "Room doesn't exist",
    })
    .optional(),

  _class: z.string({
    invalid_type_error: "Please Enter a class",
  }),

  role: z.enum([
    "STUDENT",
    "PHOTOCOPY",
    "ACCOUNTANT",
    "TEACHER_ADMIN",
    "CENTRAL_ADMIN",
  ]),

  status: z.enum(status_options, {
    invalid_type_error: "Please select an invoice status",
  }),
})

const UpdateStudent = FormSchema.omit({ regd_no: true, balance: true })

export async function updateUser(data: UpdateUserFormSchema, regd_no: string) {
  try {
    const userupdated = await prisma.users.update({
      where: {
        regd_no: regd_no,
      },
      data: {
        password: data.password,
      },
    })
  } catch (error) {
    return {
      message: "Database error: Failed to Update Student",
    }
  }

  redirect("/login")
}

export async function updateStudent(
  regd_no: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateStudent.safeParse({
    photo: formData.get("photo"),
    name: formData.get("name"),
    room_no: formData.get("room_no") ?? undefined,
    _class: formData.get("class"),
    role: formData.get("role"),
    status: formData.get("status"),
    password: formData.get("password"),
  })
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Student",
    }
  }
  const { photo, name, room_no, _class, role, status, password } =
    validatedFields.data

  try {
    const userupdated = await prisma.users.update({
      where: {
        regd_no: regd_no,
      },
      data: {
        name: name,
        room_no: room_no,
        class: _class,
        role: role,
        status: status,
        password: password,
        photo: `/images/users/${regd_no}.png`,
      },
    })
  } catch (error) {
    console.log(error)
    return {
      message: "Database error: Failed to Update Student",
    }
  }

  if (photo.size) {
    const formArray = new Int8Array(await photo.arrayBuffer())
    fs.writeFile(
      `${process.cwd()}/public/images/users/${regd_no}.png`,
      formArray,
      function (err) {
        if (err) return console.log(err)
      }
    )
  }

  revalidatePath("/admin/dashboard/student")
  redirect("/admin/dashboard/student")
}

export async function createStudent(regd_no: string, data: any) {
  console.log("check:", data)
}

export async function updateRoom(data: UpdateRoomFormSchema, room_no: Room) {
  try {
    await prisma.room_leaders.deleteMany({
      where: {
        room_no: room_no,
      },
    })
    const leadersend = [{ regd_no: data.room_leaderA, room_no: room_no }]
    if (data.room_leaderB)
      leadersend.push({ regd_no: data.room_leaderB, room_no: room_no })
    await prisma.room_leaders.createMany({
      data: leadersend,
    })
  } catch (err) {
    console.error("Database Error", err)
    throw new Error("Failed to update Leaders Info")
  }

  try {
    await prisma.subscriptions.deleteMany({
      where: {
        room_no: room_no,
        details: {
          department: "NEWSPAPER",
        },
      },
    })
    const subsend = []
    if (data.economic_times)
      subsend.push({ room_no: room_no, type: Subs.ECONOMIC_TIMES })
    if (data.the_hindu) subsend.push({ room_no: room_no, type: Subs.THE_HINDU })
    await prisma.subscriptions.createMany({
      data: subsend,
    })
  } catch (err) {
    console.error("Database Error", err)
    throw new Error("Failed to update Room Subscriptions Info")
  }

  revalidatePath("/admin/dashboard/rooms")
  redirect(
    `/admin/dashboard/rooms?page=${"ABCS".indexOf(Array.from(room_no)[0]) + 1}`
  )
}

async function seedDB() {}

async function setPhotos() {
  const students = await prisma?.users.findMany()
  students?.forEach(async (student) => {
    await prisma?.users.update({
      where: {
        regd_no: student.regd_no,
      },
      data: {
        photo: `/images/users/${student.regd_no}.png`,
      },
    })
  })
}
async function dada() {
  await prisma?.users.update({
    where: {
      regd_no: "%211207%",
    },
    data: {
      regd_no: "211217",
    },
  })
}

export async function signOutAction() {
  await signOut()
}
export async function runAction() {
  // dada()
  const timestart = new Date("Mon Jan 28 2024")
  const timeend = new Date("Mon Jan 28 2024")
  timeend.setHours(23, 59, 59)
  console.log(time)
  const output = await prisma?.transactions.findMany({
    where: {
      date: {
        gte: timestart,
        lte: timeend,
      },
    },
  })
  console.log(output)
  console.log("ran action successfully")
}
