import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useUser, Show } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetProject,
  getGetProjectQueryKey,
  useAddComment,
  useAddMilestone,
} from "@workspace/api-client-react";

const stageBadgeColors: Record<string, string> = {
  Planning: "bg-blue-100 text-blue-800",
  Building: "bg-amber-100 text-amber-800",
  Review: "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [commentText, setCommentText] = useState("");
  const [milestoneText, setMilestoneText] = useState("");
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [milestoneSuccess, setMilestoneSuccess] = useState(false);

  const { data: project, isLoading, error } = useGetProject(projectId, {
    query: { enabled: !!projectId, queryKey: getGetProjectQueryKey(projectId) },
  });

  const { mutate: addComment, isPending: addingComment } = useAddComment({
    mutation: {
      onSuccess: () => {
        setCommentText("");
        setCommentSuccess(true);
        setTimeout(() => setCommentSuccess(false), 3000);
        queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId) });
      },
    },
  });

  const { mutate: addMilestone, isPending: addingMilestone } = useAddMilestone({
    mutation: {
      onSuccess: () => {
        setMilestoneText("");
        setMilestoneSuccess(true);
        setTimeout(() => setMilestoneSuccess(false), 3000);
        queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId) });
      },
    },
  });

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment({
      id: projectId,
      data: {
        content: commentText,
        authorName: user?.fullName || user?.username || "Anonymous",
      },
    });
  };

  const handleMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneText.trim()) return;
    addMilestone({
      id: projectId,
      data: { description: milestoneText },
    });
  };

  const isOwner = project?.ownerClerkId === user?.id;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
        <div className="h-8 bg-gray-100 rounded w-2/3" />
        <div className="h-4 bg-gray-100 rounded w-1/4" />
        <div className="h-32 bg-gray-100 rounded" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium text-gray-500 mb-4">Project not found</p>
        <button onClick={() => setLocation("/feed")} className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          Back to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${stageBadgeColors[project.stage] ?? "bg-gray-100 text-gray-700"}`}>
            {project.stage}
          </span>
          {project.supportNeeded && (
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Needs: {project.supportNeeded}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-2">{project.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          By <span className="font-medium text-[#1A1A1A]">{project.ownerName}</span> &middot;{" "}
          {new Date(project.createdAt).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{project.description}</p>
        </div>
      </motion.div>

      {/* Milestones */}
      <div>
        <h2 className="text-xl font-bold mb-4">Milestones achieved ({project.milestones?.length ?? 0})</h2>
        {project.milestones && project.milestones.length > 0 ? (
          <div className="space-y-3">
            {project.milestones.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl"
              >
                <div className="mt-0.5 w-5 h-5 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#1A1A1A] font-medium">{m.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(m.createdAt).toLocaleDateString("en-ZA", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No milestones added yet.</p>
        )}

        {/* Add milestone (owner only) */}
        <Show when="signed-in">
          {isOwner && (
            <form onSubmit={handleMilestone} className="mt-6 bg-gray-50 border border-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-3">Add a milestone</h3>
              {milestoneSuccess && (
                <div className="mb-3 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                  Milestone added successfully!
                </div>
              )}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={milestoneText}
                  onChange={(e) => setMilestoneText(e.target.value)}
                  placeholder="Describe what you achieved..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  required
                />
                <button
                  type="submit"
                  disabled={addingMilestone}
                  className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {addingMilestone ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          )}
        </Show>
      </div>

      {/* Comments */}
      <div>
        <h2 className="text-xl font-bold mb-4">Comments ({project.comments?.length ?? 0})</h2>
        {project.comments && project.comments.length > 0 ? (
          <div className="space-y-4">
            {project.comments.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    {c.authorName?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <span className="font-medium text-sm text-[#1A1A1A]">{c.authorName}</span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(c.createdAt).toLocaleDateString("en-ZA", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{c.content}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No comments yet. Be the first to reach out!</p>
        )}

        {/* Add comment */}
        <Show when="signed-in">
          <form onSubmit={handleComment} className="mt-6">
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Leave a comment</h3>
            {commentSuccess && (
              <div className="mb-3 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                Comment posted!
              </div>
            )}
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Offer help, ask a question, or request collaboration..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              required
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={addingComment}
                className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {addingComment ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        </Show>
        <Show when="signed-out">
          <div className="mt-6 p-5 bg-gray-50 border border-gray-100 rounded-xl text-center">
            <p className="text-gray-500 text-sm mb-3">Sign in to leave a comment and collaborate</p>
            <a href="/sign-in" className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors inline-block">
              Sign In
            </a>
          </div>
        </Show>
      </div>
    </div>
  );
}
