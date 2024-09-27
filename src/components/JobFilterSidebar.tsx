import { jobTypes } from "@/lib/jop-types";
import prisma from "@/lib/prisma";
import { jobFilterSchema, JobFilterValues } from "@/lib/validation";
import { Label } from "@radix-ui/react-label";
import { redirect } from "next/navigation";
import FormSubmitButton from "./FormSubmitButton";
import { Input } from "./ui/input";
import Select from "./ui/select";

export async function filterJobs(formData: FormData) {
  "use server";

  const values = Object.fromEntries(formData.entries());

  const { q, type, location, remote } = jobFilterSchema.parse(values);

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  });

  redirect(`/?${searchParams.toString()}`);
}

interface JobFilterSidebarProps {
  defaultValues: JobFilterValues;
}

export default async function JobFilterSidebar({
  defaultValues: { q, type, location, remote },
}: JobFilterSidebarProps) {
  const distinctLocation = (await prisma.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean),
    )) as string[];

  return (
    <aside className="md:w[260px] sticky top-0 h-fit rounded-lg border bg-background p-2">
      <form action={filterJobs}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Title, company, etc."
              defaultValue={q || ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select id="type" name="type" defaultValue={type || ""}>
              <option value="">All type</option>
              {jobTypes.map((jobType, i) => (
                <option value={jobType} key={i}>
                  {jobType}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select id="location" name="location" defaultValue={location || ""}>
              <option value="">All location</option>
              {distinctLocation.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="remote"
              id="remote"
              className="scale-125 accent-black"
              defaultChecked={remote}
            />
            <Label htmlFor="remote">Remote jobs</Label>
          </div>
          <FormSubmitButton className="w-full">Filter jobs</FormSubmitButton>
        </div>
      </form>
    </aside>
  );
}
