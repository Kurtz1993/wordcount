import "chart.js";
import randomColor = require("randomcolor");
import { TextFile, ZipFile } from "./file-types";
import { readFile, readZippedFile } from "./utils";

declare const Chart: any;

const canvas = document.getElementById("word-count-chart") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
window["chart"] = null;
window["filesMap"] = new Map();

document.getElementById("file").addEventListener("change", async event => {
  const target = event.target as HTMLInputElement;
  const textFiles = await Promise.all(
    Array.from(target.files)
      .filter(file => file.type === TextFile)
      .map(file => readFile(file))
  );
  const zipFiles = (await Promise.all(
    Array.from(target.files)
      .filter(file => file.type === ZipFile)
      .map(file => readZippedFile(file))
  )).reduce((prev, next) => prev.concat(next), []);

  const files = textFiles.concat(zipFiles);

  const colours = files.map(() => randomColor());
  const labels = files.map(record => record.fileName);
  const data = files.map(record => record.wordCount);

  if (window["chart"]) {
    window["chart"].data.labels = labels;
    window["chart"].data.datasets[0].data = data;
    window["chart"].update();
  } else {
    window["chart"] = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "# of Words",
            backgroundColor: colours,
            data,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
});
