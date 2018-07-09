import "chart.js";
import JSZip from "jszip";
import mime from "mime-types";
import randomColor from "randomcolor";
import { TextFile, ZipFile } from "./file-types";

const canvas = document.getElementById("word-count") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
window["chart"] = null;
window["filesMap"] = new Map();

document.getElementById("file").addEventListener("change", async event => {
  const target = event.target as HTMLInputElement;
  const textFiles = Array.from(target.files).filter(
    file => file.type === TextFile
  );
  const zipFiles = Array.from(target.files).filter(
    file => file.type === ZipFile
  );

  // const colours = files.map(() => randomColor());

  // window.chart = new Chart(ctx, {
  //   type: "bar",
  //   data: {
  //     labels: data.map(record => record.name),
  //     datasets: [
  //       {
  //         label: "# of Words",
  //         backgroundColor: colours,
  //         data: data.map(record => record.wordCount),
  //       },
  //     ],
  //   },
  //   options: {
  //     responsive: false,
  //     scales: {
  //       yAxes: [
  //         {
  //           ticks: {
  //             beginAtZero: true,
  //           },
  //         },
  //       ],
  //     },
  //   },
  // });
});

function readFile(file: File) {
  const fileReader = new FileReader();
  fileReader.onload = ev => {
    window["filesMap"].set(file.name, ev.target.result.split(" ").length);
  };
  fileReader.readAsText(file);
}

async function readZippedFile(zipFile: File) {
  try {
    const zip = await JSZip.loadAsync(zipFile);
    let files = Object.values(zip.files).filter(
      (file: any) => !file.dir && mime.lookup(file.name) === TextFile
    );

    for (let i = 0; i < files.length; i++) {
      let file = files[i] as any;

      const wordCount = await readTextFileInsideZip(zip, file);

      window["filesMap"].set(`${zipFile.name}/${file.name}`, wordCount);
    }
  } catch (e) {
    console.log(e);
  }
}

async function readTextFileInsideZip(zip, file): Promise<number> {
  const content = await zip.file(file.name).async("text");

  return content.split(" ").length;
}
