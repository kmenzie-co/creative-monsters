import { getClassById } from "@/app/actions/classes";
import { ClassRunnerClient } from "@/components/ClassRunnerClient";
import { notFound } from "next/navigation";

export default async function ClassIdPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const classData = await getClassById(params.id);

  if (!classData) return notFound();

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center max-w-4xl">
      <ClassRunnerClient classData={classData} />
    </div>
  );
}
