import { useState } from "react";
import { useLocation } from "wouter";
import { useUser } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateProject, getListProjectsQueryKey } from "@workspace/api-client-react";

type Stage = "Planning" | "Building" | "Review" | "Completed";
const stages: Stage[] = ["Planning", "Building", "Review", "Completed"];

const supportOptions = [
  "Code Review",
  "UI Help",
  "Backend Dev",
  "Testing Help",
  "Documentation",
  "Community",
  "Mentorship",
  "Other",
];

export default function NewProject() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<Stage>("Planning");
  const [supportNeeded, setSupportNeeded] = useState("Code Review");
  const [error, setError] = useState("");

  const { mutate: createProject, isPending } = useCreateProject({
    mutation: {
      onSuccess: (project) => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        setLocation(`/project/${project.id}`);
      },
      onError: () => {
        setError("Failed to create project. Please try again.");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    createProject({
      data: {
        title: title.trim(),
        description: description.trim(),
        stage,
        supportNeeded,
        ownerName: user?.fullName || user?.username || "Anonymous",
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-2">Add Your Project</h1>
        <p className="text-gray-500">Share what you're building with the MzansiBuilds community</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your project a name"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you building? What problem does it solve? Who is it for?"
            rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
            Current Stage
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stages.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStage(s)}
                className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                  stage === s
                    ? "bg-primary text-white border-primary"
                    : "border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
            Support Needed
          </label>
          <div className="flex flex-wrap gap-2">
            {supportOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSupportNeeded(option)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  supportNeeded === option
                    ? "bg-primary/10 text-primary border-primary"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-primary text-white rounded-xl font-semibold text-base hover:bg-primary/90 disabled:opacity-60 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {isPending ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
