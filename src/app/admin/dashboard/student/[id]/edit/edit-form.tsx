"use client"

import {
  AcademicCapIcon,
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  KeyIcon,
  RocketLaunchIcon,
  SignalIcon,
  UserCircleIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { updateStudent } from "@/lib/actions"
import { useFormState } from "react-dom"
import { Room, Status, UserRoles, users } from "@prisma/client"
import { Cross1Icon } from "@radix-ui/react-icons"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React, { useEffect, useState } from "react"
import { State } from "@/lib/actions"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useToast } from "@/components/ui/use-toast"

export default function EditInvoiceForm({ student }: { student: users }) {
  const initialState = {
    errors: {
      picture: [],
      name: [],
      regd_no: [],
      password: [],
      balance: [],
      room_no: [],
      class: [],
      role: [],
      status: [],
    },
    message: "",
  }
  const updateStudentWithId = updateStudent.bind(null, student.regd_no)
  const [state, dispatch] = useFormState(updateStudentWithId, initialState)

  const [preview, setPreview] = useState(`${student.photo}`)
  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  const { toast } = useToast()

  return (
    <form
      action={async (formData) => {
        await dispatch(formData)
        const m = state.message
        if (!m.toLowerCase().includes("fail")) {
          toast({
            className: "text-xl dark:bg-stone-700 bg-emerald-200",
            title: "Successful Operation!",
            description: `Updated Student REGD ${student.regd_no}`,
          })
        }
      }}
    >
      <div className="">
        <div className="mb-3 flex flex-col justify-between items-center text-lg gap-2 font-semibold">
          <div className="flex flex-row min-w-full gap-4 align-baseline">
            <ProfilePic
              preview={preview}
              name={student.name}
              handleChangeImage={handleChangeImage}
            />
            <div className="flex-col w-full items-center gap-2 pt-4">
              <Label className="ml-1" htmlFor="picture">
                Update Profile Picture
              </Label>
              <Input
                id="picture"
                name="picture"
                type="file"
                onChange={handleChangeImage}
                accept="image/png"
              />
            </div>
          </div>
        </div>
        {/* Student Name */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Enter Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                defaultValue={student.name} //default
                placeholder="Enter name of student or Staff"
                className="peer block w-full rounded-md border border-gray-200 dark:border-stone-700 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />

              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-stone-200 peer-focus:dark:text-emerald-200  peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* Room Number */}
        <div className="mb-4">
          <label htmlFor="room_no" className="mb-2 block text-sm font-medium">
            Choose Room Number
          </label>
          <div className="relative">
            <select
              id="room_no"
              name="room_no"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 dark:border-stone-700 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-stone-950"
              defaultValue={student.room_no} //default
            >
              <option value="" disabled>
                Select a Room
              </option>
              {Object.values(Room).map((num) => (
                <option key={Room[num]} value={num}>
                  {Room[num]}
                </option>
              ))}
            </select>
            <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-stone-200 peer-focus:dark:text-emerald-200  peer-focus:text-gray-900" />
          </div>
        </div>

        {/* Class */}
        <div className="mb-4">
          <label htmlFor="class" className="mb-2 block text-sm font-medium">
            Enter Class
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="class"
                name="class"
                defaultValue={student.class} //default
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 dark:border-stone-700 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <AcademicCapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-stone-200 peer-focus:dark:text-emerald-200  peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Role */}
        <div className="mb-4">
          <label htmlFor="role" className="mb-2 block text-sm font-medium">
            Choose Role
          </label>
          <div className="relative">
            <select
              id="role"
              name="role"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 dark:border-stone-700 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-stone-950"
              defaultValue={student.role} //default
            >
              <option value="" disabled>
                Select a Role
              </option>
              {Object.values(UserRoles).map((role) => (
                <option key={UserRoles[role]} value={role}>
                  {UserRoles[role]}
                </option>
              ))}
            </select>
            <RocketLaunchIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-stone-200 peer-focus:dark:text-emerald-200  peer-focus:text-gray-900" />
          </div>
        </div>
        {/* password */}
        <fieldset>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Change Password
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue={student.password} //default
                  placeholder="Enter name of student or Staff"
                  className="peer block w-full rounded-md border border-gray-200 dark:border-stone-700 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />

                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-stone-200 peer-focus:dark:text-emerald-200  peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Account Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Select Account Status
          </legend>
          <div className="rounded-md border border-gray-200 dark:border-stone-700 dark:border-thin dark:bg-black bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="disabled"
                  name="status"
                  type="radio"
                  value={Status.DISABLED}
                  defaultChecked={student.status === Status.DISABLED}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="disabled"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-stone-900 text-white px-3 py-1.5 text-xs font-medium "
                >
                  DISABLED <Cross1Icon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="active"
                  name="status"
                  type="radio"
                  value={Status.ACTIVE}
                  defaultChecked={student.status === Status.ACTIVE} //default
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="active"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  {Status.ACTIVE} <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin/dashboard/student"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Student</Button>
      </div>
    </form>
  )
}

function ProfilePic({
  preview,
  name,
  handleChangeImage,
}: {
  preview: string
  name: string
  handleChangeImage: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <Avatar className="w-24 h-24">
      <AvatarImage className="object-cover" src={preview} />
      <AvatarFallback>{name.split(" ").map((n) => n[0])}</AvatarFallback>
    </Avatar>
  )
}
// // {
//   regd_no: '213309',
//   roll_no: '213309',
//   name: 'B Saisudharshan',
//   password: '1000',
//   balance: 0,
//   room_no: 'B6',
//   class: 'III BCOM',
//   status: 'ACTIVE',
//   photo: null,
//   role: 'STUDENT'
// }
