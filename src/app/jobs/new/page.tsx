import { Metadata } from "next";
import NewJobForm from "./NewJobForm";

export const metadata: Metadata = {
  title: "Post new job",
};

export default function Page() {
  return <NewJobForm />;
}
