import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListCompletedProjects } from "@workspace/api-client-react";

export default function Celebration() {
  const { data: projects, isLoading } = useListCompletedProjects();

  return (
    <div>
      {/* Hero banner */}
      <div className="bg-[#1A1A1A] text-white rounded-2xl p-10 mb-10 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(46,125,50,0.3)_0%,_transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/30 text-primary text-sm font-medium mb-4">
            Hall of Fame
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">
            Celebration Wall
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Every completed project deserves to be celebrated. These builders shipped it.
          </p>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 animate-pulse">
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 20 }}
            >
              <Link href={`/project/${project.id}`}>
                <div className="group bg-white border-2 border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden">
                  {/* Celebration ribbon */}
                  <div className="absolute top-0 right-0 w-16 h-16">
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold mb-3">
                      Completed
                    </span>
                    <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{project.description}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                    <span className="font-medium text-gray-600">{project.ownerName}</span>
                    <div className="flex items-center gap-3">
                      <span>{project.milestoneCount} milestone{project.milestoneCount !== 1 ? "s" : ""}</span>
                      <span>{project.commentCount} comment{project.commentCount !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-500 mb-2">No completed projects yet</p>
          <p className="text-sm text-gray-400 mb-6">Be the first to complete a project and get featured here!</p>
          <Link href="/project/new" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors inline-block">
            Start a Project
          </Link>
        </div>
      )}
    </div>
  );
}
