import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"

import { columns } from "@/components/diary-columns"
import { DataTable } from "@/components/data-table"
import { diarySchema } from "@/data/diary-schema"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"




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

  return z.array(diarySchema).parse(tasks)
}

async function getTasks2(class_name:string) {

  const formdata = new FormData();
  formdata.append("batch", "R8B");

  try {
    const response = await fetch(
      "https://proma-ai-uw7kj.ondigitalocean.app/Projects/",
      {
        method: "POST",
        body: formdata,
      }
    );

    const data = await response.json();
    console.log("BAKA MONO", data);

    // Extract the required data from the API response
    const tasks = data.map((project: any) => ({
      id: project.project.id.toString(), // Convert id to string
      date: "today",
      status: project.project.status,
      priority: 'high', // No priority information in the API response
      diary: "https://variety.com/wp-content/uploads/2021/07/Rick-Astley-Never-Gonna-Give-You-Up.png?w=1024",
      remarks: "shit",
      label: project.project.team
    }));

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}
export default async function Diary({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const class_name = searchParams?.class
//   const tasks = await getTasks()
  const tasks = await getTasks2(class_name as string)

  return (
    <> 
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
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Diary</h2>
            <p className="text-muted-foreground">
              Here&apos;s a view of the weekly diary submitted by !
            </p>
          </div>
        </div>
         <DataTable data={tasks} columns={columns} />   
      </div>
     
    </>
  );
}






// Simulate a database read for tasks.


