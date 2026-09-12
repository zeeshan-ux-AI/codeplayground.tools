import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
export type ProjectType = "web" | "node" | string;

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  html?: string;
  css?: string;
  js?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "codeplayground-projects";

export function useLocalProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProjects(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load projects from localStorage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProjectsToStorage = useCallback((newProjects: Project[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
      setProjects(newProjects);
    } catch (e) {
      console.error("Failed to save projects to localStorage", e);
    }
  }, []);

  const createProject = useCallback(
    (name: string, type: ProjectType, initialCode?: { html?: string; css?: string; js?: string }) => {
      const newProject: Project = {
        id: uuidv4(),
        name,
        type,
        html: initialCode?.html || "",
        css: initialCode?.css || "",
        js: initialCode?.js || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveProjectsToStorage([...projects, newProject]);
      return newProject;
    },
    [projects, saveProjectsToStorage]
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Pick<Project, "name" | "html" | "css" | "js">>) => {
      const newProjects = projects.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : p
      );
      saveProjectsToStorage(newProjects);
    },
    [projects, saveProjectsToStorage]
  );

  const deleteProject = useCallback(
    (id: string) => {
      saveProjectsToStorage(projects.filter((p) => p.id !== id));
    },
    [projects, saveProjectsToStorage]
  );

  const getProject = useCallback(
    (id: string) => {
      return projects.find((p) => p.id === id);
    },
    [projects]
  );

  return {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    getProject,
  };
}
