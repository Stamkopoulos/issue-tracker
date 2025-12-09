"use client";
import { Button, Callout, Spinner, TextField, Select } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateIssueSchema } from "@/app/validationSchemas";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";

type IssueForm = z.infer<typeof updateIssueSchema>;

interface Issue {
  id: number;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
}

const EditIssuePage = () => {
  const router = useRouter();
  const params = useParams();
  const issueId = params.id as string;
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IssueForm>({
    resolver: zodResolver(updateIssueSchema),
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await axios.get(`/api/issues/${issueId}`);
        setIssue(response.data);
        reset({
          title: response.data.title,
          description: response.data.description,
          status: response.data.status,
        });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError("Failed to load issue.");
      }
    };

    if (issueId) {
      fetchIssue();
    }
  }, [issueId, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      await axios.patch(`/api/issues/${issueId}`, data);
      router.push("/issues");
      router.refresh();
    } catch (error) {
      setIsSubmitting(false);
      setError("An error occurred. Please try again.");
    }
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (!issue) {
    return (
      <Callout.Root color="red">
        <Callout.Text>Issue not found.</Callout.Text>
      </Callout.Root>
    );
  }

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        <TextField.Root {...register("title")} placeholder="Title" />
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select.Root
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <Select.Trigger placeholder="Select status..." />
              <Select.Content>
                <Select.Item value="OPEN">Open</Select.Item>
                <Select.Item value="IN_PROGRESS">In Progress</Select.Item>
                <Select.Item value="CLOSED">Closed</Select.Item>
              </Select.Content>
            </Select.Root>
          )}
        />
        <ErrorMessage>{errors.status?.message}</ErrorMessage>
        <div className="flex gap-2">
          <Button disabled={isSubmitting}>
            Update Issue {isSubmitting && <Spinner />}
          </Button>
          <Button
            type="button"
            variant="soft"
            color="gray"
            onClick={() => router.push("/issues")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditIssuePage;

