import JSZip from "jszip";

export async function readFolderFiles(fileList: FileList): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const path = file.webkitRelativePath || file.name;

    // Ignore binary/large node_modules files
    if (path.includes("node_modules/") || path.includes(".git/") || path.includes(".DS_Store")) {
      continue;
    }

    try {
      const text = await file.text();
      // Normalize path to start with src/ if single file or keep relative path
      const cleanPath = path.startsWith("src/") ? path : `src/${path}`;
      result[cleanPath] = text;
    } catch (e) {
      console.warn("Could not read file as text:", path);
    }
  }

  return result;
}

export async function extractZipFiles(zipFile: File): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(zipFile);

  const entries = Object.keys(loadedZip.files);
  for (const filename of entries) {
    const entry = loadedZip.files[filename];
    if (entry.dir || filename.includes("node_modules/") || filename.includes(".git/")) {
      continue;
    }

    try {
      const content = await entry.async("string");
      result[filename] = content;
    } catch (e) {
      console.warn("Skipped binary file in zip:", filename);
    }
  }

  return result;
}
