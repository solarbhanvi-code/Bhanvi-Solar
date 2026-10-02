import { AdminPageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/projects/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <AdminPageHeader title="New Project" description="Add a new project to your gallery." />
      <ProjectForm />
    </div>
  );
}
