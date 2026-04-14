import { Link } from "wouter";
import { useUser, useClerk } from "@clerk/react";
import { useListMyProjects } from "@workspace/api-client-react";

const stageBadgeColors: Record<string, string> = {
  Planning: "bg-blue-100 text-blue-800",
  Building: "bg-amber-100 text-amber-800",
  Review: "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
};

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { data: projects } = useListMyProjects();

  const completedCount = projects?.filter((p) => p.stage === "Completed").length ?? 0;
  const totalComments = projects?.reduce((sum, p) => sum + p.commentCount, 0) ?? 0;
  const totalMilestones = projects?.reduce((sum, p) => sum + p.milestoneCount, 0) ?? 0;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-8">Profile</h1>

      {/* Profile card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm mb-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
            {(user?.firstName?.[0] || user?.username?.[0] || "U").toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">
              {user?.fullName || user?.username || "Developer"}
            </h2>
            <p className="text-gray-500 text-sm">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-ZA", { month: "long", year: "numeric" }) : "recently"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-50">
          {[
            { label: "Projects", value: projects?.length ?? 0 },
            { label: "Completed", value: completedCount },
            { label: "Comments", value: totalComments },
            { label: "Milestones", value: totalMilestones },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-extrabold text-primary">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent projects */}
      {projects && projects.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1A1A1A]">Your Projects</h3>
            <Link href="/my-projects" className="text-primary text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 3).map((project) => (
              <Link key={project.id} href={`/project/${project.id}`}>
                <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${stageBadgeColors[project.stage] ?? "bg-gray-100 text-gray-700"}`}>
                      {project.stage}
                    </span>
                    <span className="font-medium text-[#1A1A1A] text-sm">{project.title}</span>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">
                    {project.commentCount} comments
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Account</h3>
        <Link href="/project/new" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-[#1A1A1A]">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">Add a new project</span>
        </Link>
        <Link href="/my-projects" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-[#1A1A1A]">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="font-medium">Manage my projects</span>
        </Link>
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 w-full text-left"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Sign out</span>
        </button>
      </div>
    </div>
  );
}
