import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetStatsSummary, useGetStageBreakdown, useListProjects } from "@workspace/api-client-react";

const stageBadgeColors: Record<string, string> = {
  Planning: "bg-blue-100 text-blue-800",
  Building: "bg-amber-100 text-amber-800",
  Review: "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
};

export default function Home() {
  const { data: stats } = useGetStatsSummary();
  const { data: stages } = useGetStageBreakdown();
  const { data: projects } = useListProjects({ stage: undefined });

  const previewProjects = projects?.slice(0, 3) ?? [];

  return (
    <div className="min-h-[100dvh] bg-white text-[#1A1A1A]">
      {/* Hero */}
      <section className="bg-[#1A1A1A] text-white pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              Built by South Africa's developers
            </span>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Build together.
              <br />
              <span className="text-primary">Grow together.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              MzansiBuilds is where South African developers share what they're building, ask for help, and celebrate every milestone — no matter how small.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="px-8 py-4 rounded-lg bg-primary text-white font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
              >
                Join the Community
              </Link>
              <Link
                href="/feed"
                className="px-8 py-4 rounded-lg border border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Browse Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="py-14 bg-[#f9fafb] border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { label: "Projects", value: stats.totalProjects },
              { label: "Completed", value: stats.completedProjects },
              { label: "Comments", value: stats.totalComments },
              { label: "Milestones", value: stats.totalMilestones },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                <div className="text-4xl font-extrabold text-primary">{s.value}</div>
                <div className="text-gray-500 text-sm mt-1 uppercase tracking-wide">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Stage breakdown */}
      {stages && stages.length > 0 && (
        <section className="py-14 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">What's happening right now</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stages.map((s) => (
                <div key={s.stage} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-primary">{s.count}</div>
                  <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${stageBadgeColors[s.stage] ?? "bg-gray-100 text-gray-700"}`}>
                    {s.stage}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Project previews */}
      {previewProjects.length > 0 && (
        <section className="py-14 px-6 bg-[#f9fafb]">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Recent projects</h2>
              <Link href="/feed" className="text-primary text-sm font-medium hover:underline">
                View all
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {previewProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/project/${project.id}`}>
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${stageBadgeColors[project.stage] ?? "bg-gray-100 text-gray-700"}`}>
                          {project.stage}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#1A1A1A] mb-1">{project.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                      <div className="mt-4 text-xs text-gray-400">by {project.ownerName}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-6 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-4">Ready to share what you're building?</h2>
          <p className="text-white/80 mb-8 text-lg">Join South Africa's growing developer community and find the support you need.</p>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-4 rounded-lg bg-white text-primary font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
          >
            Get Started — It's Free
          </Link>
        </div>
      </section>
    </div>
  );
}
