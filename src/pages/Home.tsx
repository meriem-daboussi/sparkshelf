import { useEffect, useState } from 'react';
import { projectsService } from '../services/projects.service';
import { ProjectCard } from '../components/ProjectCard';
import type { Project } from '../types/project.types';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsService.getPublishedProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-primary mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={loadProjects}
            className="px-6 py-2 bg-primary hover:bg-primary/80 rounded text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-display text-primary">
            SparkShelf
          </h1>
          <p className="text-gray-400 font-mono text-sm mt-2">
            Swipe. Build. Innovate.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-display text-white mb-2">
            SparkShelf Projects
          </h2>
          <p className="text-gray-400">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} available
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-400 text-lg mb-2">No projects found yet.</p>
            <p className="text-gray-500 text-sm">
              Add your first project in the Supabase dashboard!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onClick={() => console.log('Clicked:', project.title)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>SparkShelf - Robotics Project Platform for Tunisia 🇹🇳</p>
        </div>
      </footer>
    </div>
  );
}