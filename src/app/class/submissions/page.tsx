
import Image from "next/image";
import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"

import { columns } from "@/components/columns"
import { DataTable } from "@/components/data-table"
import { UserNav } from "@/components/user-nav"
import { taskSchema } from "@/data/schema"
import { MainNav } from "@/components/main-nav";



interface Class {
  strength: number;
  name: string; 
 }

 async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/data/tasks.json")
  )
  // W:\Projects\professor_app\src\data\tasks.json
  
  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default async function Submissions() {
  const tasks = await getTasks()
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            {/* <TeamSwitcher /> */}
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              <UserNav />
            </div>
          </div>
        </div>
        {/* <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>

       
          
        </div> */}
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Submissions</h2>
            <p className="text-muted-foreground">
              Here&apos;s a view of all the submissions made by the students!
            </p>
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
      </div>
    </>
  );
}






// Simulate a database read for tasks.


