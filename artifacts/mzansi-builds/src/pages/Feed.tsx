import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListProjects, getListProjectsQueryKey } from "@workspace/api-client-react";

type Stage = "Planning" | "Building" | "Review" | "Completed";

const stages: Stage[] = ["Planning", "Building", "Review", "Completed"];

const stageBadgeColors: Record<Stage, string> = {
  Planning: "bg-blue-100 text-blue-800 border-blue-200",
  Building: "bg-amber-100 text-amber-800 border-amber-200",
  Review: "bg-purple-100 text-purple-800 border-purple-200",
  Completed: "bg-green-100 text-green-800 border-green-200",
};

export default function Feed() {
  const [selectedStage, setSelectedStage] = useState<Stage | undefined>(undefined);
  const { data: projects, isLoading } = useListProjects(
    { stage: selectedStage },
    { query: { queryKey: getListProjectsQueryKey({ stage: selectedStage }) } }
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-2">Project Feed</h1>
        <p className="text-gray-500">All the projects being built by the MzansiBuilds community</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedStage(undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            selectedStage === undefined
              ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
              : "border-gray-200 text-gray-600 hover:border-gray-400"
          }`}
        >
          All
        </button>
        {stages.map((stage) => (
          <button
            key={stage}
            onClick={() => setSelectedStage(stage === selectedStage ? undefined : stage)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              selectedStage === stage
                ? "bg-primary text-white border-primary"
                : "border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            {stage}
          </button>
        ))}
      </div>

      {/* Project grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-24 mb-4" />
              <div className="h-5 bg-gray-100 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-full mb-2" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/project/${project.id}`}>
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${stageBadgeColors[project.stage as Stage] ?? "bg-gray-100 text-gray-700"}`}>
                      {project.stage}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(project.createdAt).toLocaleDateString("en-ZA", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">{project.title}</h2>
                  <p className="text-gray-500 text-sm line-clamp-3 flex-1">{project.description}</p>

                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs text-gray-400">by {project.ownerName}</span>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{project.commentCount} comment{project.commentCount !== 1 ? "s" : ""}</span>
                      <span>{project.milestoneCount} milestone{project.milestoneCount !== 1 ? "s" : ""}</span>
                    </div>
                  </div>

                  {project.supportNeeded && (
                    <div className="mt-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        Needs: {project.supportNeeded}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium mb-2">No projects found</p>
          <p className="text-sm mb-6">Be the first to add a project!</p>
          <Link href="/project/new" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Add Your Project
          </Link>
        </div>
      )}
    </div>
  );
}
