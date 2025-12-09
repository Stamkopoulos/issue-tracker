"use client";
import { Button, Select, Spinner } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

interface Issue {
  id: number;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
}

interface IssuesListProps {
  initialIssues: Issue[];
}

const IssuesList = ({ initialIssues }: IssuesListProps) => {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleStatusChange = async (issueId: number, newStatus: "OPEN" | "IN_PROGRESS" | "CLOSED") => {
    setUpdatingStatus(issueId);
    try {
      await axios.patch(`/api/issues/${issueId}`, { status: newStatus });
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
      router.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (issueId: number) => {
    if (!confirm("Are you sure you want to delete this issue?")) {
      return;
    }

    setDeleting(issueId);
    try {
      await axios.delete(`/api/issues/${issueId}`);
      setIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== issueId));
      router.refresh();
    } catch (error) {
      console.error("Failed to delete issue:", error);
      alert("Failed to delete issue. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  if (issues.length === 0) {
    return <p>No issues yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {issues.map((issue) => (
        <li key={issue.id} className="border p-3 rounded">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="font-semibold">{issue.title}</div>
              <div className="text-sm text-gray-600 mt-1">
                {issue.description}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Status:</span>
                {updatingStatus === issue.id ? (
                  <Spinner size="1" />
                ) : (
                  <Select.Root
                    value={issue.status}
                    onValueChange={(value) =>
                      handleStatusChange(issue.id, value as "OPEN" | "IN_PROGRESS" | "CLOSED")
                    }
                  >
                    <Select.Trigger variant="soft" size="1" />
                    <Select.Content>
                      <Select.Item value="OPEN">Open</Select.Item>
                      <Select.Item value="IN_PROGRESS">In Progress</Select.Item>
                      <Select.Item value="CLOSED">Closed</Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="soft" size="2" asChild>
                <Link href={`/issues/${issue.id}/edit`}>Edit</Link>
              </Button>
              <Button
                variant="soft"
                color="red"
                size="2"
                onClick={() => handleDelete(issue.id)}
                disabled={deleting === issue.id}
              >
                {deleting === issue.id ? <Spinner /> : "Delete"}
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default IssuesList;

