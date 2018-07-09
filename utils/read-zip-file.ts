import * as JSZip from "jszip";
import * as mime from "mime-types";

import { ReadFile } from "../read-file.model";
import { TextFile } from "../file-types";

export async function readZippedFile(zipFile: File): Promise<ReadFile[]> {
  let result = [] as ReadFile[];
  try {
    const zip = await JSZip.loadAsync(zipFile);
    let files = Object.values(zip.files).filter(
      (file: any) => !file.dir && mime.lookup(file.name) === TextFile
    );

    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      const wordCount = await readTextFileInsideZip(zip, file);

      result.push({ fileName: `${zipFile.name}/${file.name}`, wordCount });
    }
  } catch (e) {
    console.log(e);
  }

  return result;
}

async function readTextFileInsideZip(
  zip: JSZip,
  file: JSZip.JSZipObject
): Promise<number> {
  const content = await zip.file(file.name).async("text");

  return content.split(" ").length;
}
