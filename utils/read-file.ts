import { ReadFile } from "../read-file.model";

export function readFile(file: File): Promise<ReadFile> {
  const fileReader = new FileReader();

  return new Promise(resolve => {
    fileReader.onload = ev => {
      resolve({
        fileName: file.name,
        wordCount: ev.target.result.split(" ").length,
      });
    };
    fileReader.readAsText(file);
  });
}
