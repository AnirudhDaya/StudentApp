"use client"

import { CalendarIcon, Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  dialogClose,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

import { priorities, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Label } from "./ui/label"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import { format } from "date-fns"
import { Calendar } from "./ui/calendar"
import { toast } from "./ui/use-toast"
import { useSearchParams } from "next/navigation"
interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [file, setFile] = useState<File | null>()
  const [remarks, setRemarks] = React.useState("");
  const params = useSearchParams()
  const project_id = params.get('id')
  const handleSubmit: any = async (e:any) => {
    e.preventDefault();
    dialogClose();
    const formData = new FormData();
 
    
      
    if(!file) {
      toast({
        title: "Error!",
        description: "Please choose a file to upload",
        variant: "destructive",
      });
      return;
    }
    else
      formData.append("diary", file);
    formData.append("remark", remarks);
    formData.append("project_id", project_id as string);
    try {
      const res = await fetch("/api/login", {
        method: "GET",
      });
      if (res.status === 200) {
        const val = await res.json();
        const response = await fetch("https://proma-ai-uw7kj.ondigitalocean.app/diarySubmit/", {
          method: "POST",
          headers: {
            Authorization: `Token ${val.token.value}`,
            // "Content-Type": "application/json",
          },
          body: formData,
        });
    
        if (response.ok) {
          // Handle successful submission
          console.log("Submission successful");
          toast({
            title: "Success",
            description: "Your diary has been submitted successfully",
           
          });
          // Reset the form fields if needed
          // setDate(null);
          setFile(null);
          setRemarks("");
        } else {
          // Handle submission error
          toast({
            title: "Error!",
            description: "Failed to submit the diary",
            variant: "destructive",
          });
        }
        
      } else {
        toast({
          title: "Error!",
          description: "No session exists",
          variant: "destructive",
        });
      }
     
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-10">
      <Dialog>
      <DialogTrigger asChild>
        <Button >New Submission</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make a new Submission</DialogTitle>
          <DialogDescription>
            It&apos;s a new week! Update the status of your project. <br/><strong>Upload your diary as a PDF.</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="picture" className="text-right">
                      Upload
                    </Label>
                    <Input
                      id="picture"
                      type="file"
                      accept="application/pdf"
                      className="col-span-3"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setFile(e.target.files[0]);
                        } else {
                          setFile(null);
                        }
                      }}
                      // onChange={}
                    />
          </div>
          <div className="grid grid-cols- items-center gap-4">

                    <Textarea placeholder="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)}/>

          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

        
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  )
}