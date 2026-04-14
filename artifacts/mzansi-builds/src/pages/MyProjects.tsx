import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListMyProjects } from "@workspace/api-client-react";

const stageBadgeColors: Record<string, string> = {
  Planning: "bg-blue-100 text-blue-800",
  Building: "bg-amber-100 text-amber-800",
  Review: "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
};

export default function MyProjects() {
  const { data: projects, isLoading } = useListMyProjects();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-2">My Projects</h1>
          <p className="text-gray-500">Track and manage the projects you're building</p>
        </div>
        <Link
          href="/project/new"
          className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Add New Project
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-gray-100 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-full mb-2" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/project/${project.id}`}>
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/20 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${stageBadgeColors[project.stage] ?? "bg-gray-100 text-gray-700"}`}>
                          {project.stage}
                        </span>
                        {project.supportNeeded && (
                          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            Needs: {project.supportNeeded}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">{project.title}</h2>
                      <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                    </div>
                    <div className="ml-6 text-right text-xs text-gray-400 flex-shrink-0">
                      <div>{project.commentCount} comment{project.commentCount !== 1 ? "s" : ""}</div>
                      <div className="mt-1">{project.milestoneCount} milestone{project.milestoneCount !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-400">
                    Created {new Date(project.createdAt).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-500 mb-2">You haven't added any projects yet</p>
          <p className="text-sm text-gray-400 mb-6">Share what you're building with the community</p>
          <Link
            href="/project/new"
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors inline-block"
          >
            Add Your First Project
          </Link>
        </div>
      )}
    </div>
  );
}
