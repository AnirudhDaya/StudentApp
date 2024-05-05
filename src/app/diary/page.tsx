"use client"

import { columns } from "@/components/diary-columns"
import { DataTable } from "@/components/data-table"
import { diarySchema } from "@/data/diary-schema"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { useState, useEffect } from "react"

export default function Diary({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const p_id = searchParams?.id
  const [members, setMembers] = useState<string[]>([]);
  const [fetchedTasks, setFetchedTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { members: fetchedMembers, tasks } = await getTasks2(p_id as string);
      setMembers(fetchedMembers);
      setFetchedTasks(tasks);
    };

    if (p_id) {
      fetchData();
    }
  }, [p_id]);

  function formatDateString(dateString: string) {
    const regex = /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}:\d{2}/;
    const match = dateString.match(regex);
  
    if (match) {
      const [, year, month, day] = match;
      return `${day}/${month}/${year}`;
    }
  
    return dateString; // Return the original string if it doesn't match the expected format
  }

  async function getTasks2(p_id: string) {
    const formdata = new FormData();
    formdata.append("project_id", p_id);

    try {
      const response = await fetch(
        "https://proma-ai-uw7kj.ondigitalocean.app/getDiary/",
        {
          method: "POST",
          body: formdata,
        }
      );

      const data = await response.json();
      console.log("BAKA MONO", data);

      const tasks = data.diaries.map((diary: any) => ({
        id: diary.id.toString(), // Convert id to string
        date: formatDateString(diary.created_at), // Convert created_at to dd/mm/yyyy format
        status: diary.status,
        priority: "high", // No priority information in the API response
        diary: diary.diaryfile,
        remarks: diary.Remarks.length > 0 ? diary.Remarks[0].remarkstr : "No remarks", // Assuming the first remark is displayed
        label: "Team Label", // No team information in the API response
      }));

      return { members: data.members, tasks };
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

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
              Here&apos;s a view of the weekly diary submitted by {members.join(', ')}!
            </p>
          </div>
        </div>
        <DataTable data={fetchedTasks} columns={columns} />
      </div>
    </>
  );
}