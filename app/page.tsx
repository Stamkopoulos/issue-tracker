import prisma from "@/prisma/client";

export default async function Home() {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div>
        {issues.length === 0 ? (
          <p>No issues yet.</p>
        ) : (
          <ul className="space-y-2">
            {issues.map((issue) => (
              <li key={issue.id} className="border p-3 rounded">
                <div className="font-semibold">{issue.title}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {issue.description}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Status: {issue.status}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
