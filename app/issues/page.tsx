import prisma from "@/prisma/client";
import { Button } from "@radix-ui/themes";
import Link from "next/link";
import IssuesList from "./IssuesList";

const IssuesPage = async () => {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Issues</h1>
        <Button>
          <Link href={"/issues/new"}>New Issue</Link>
        </Button>
      </div>

      <IssuesList initialIssues={issues} />
    </div>
  );
};

export default IssuesPage;
