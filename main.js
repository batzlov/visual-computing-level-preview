import { levels } from "./levels";
import { js2xml } from "xml-js";

class App {
    constructor(container) {
        this.container = container;
    }

    render() {
        const selectOptions = levels
            .map((level) => {
                return `<option value="${level.id}">${level.name}</option>`;
            })
            .join("");

        document.querySelector("#app").innerHTML = `
            <div class="block-preview flex">
                <img class="block block-preview-img" src="/assets/blocks/block-brick.png">
                <img class="block block-preview-img" src="/assets/blocks/block-clay.png">
                <img class="block block-preview-img" src="/assets/blocks/block-paper.png">
                <img class="block block-preview-img" src="/assets/blocks/block-abstract-1.png">
                <img class="block block-preview-img" src="/assets/blocks/block-abstract-2.png">
                <img class="block block-preview-img" src="/assets/blocks/block-abstract-3.png">
            </div>
            <div class="flex">
                <select class="select select-bordered w-full max-w-xs">
                    ${selectOptions}
                </select>
                <button id="btn-download-xml" class="btn btn-primary ml-5 self-end">Download als .xml</button>
            </div>
            <canvas id="app-canvas"></canvas>
        `;
    }
}

class LevelGenerator {
    constructor(canvas, level) {
        this.canvas = canvas;
        this.level = level;

        this.matrix = level.matrix;
        this.matrixCols = level.matrix.length;
        this.matrixRows = level.matrix[0].length;

        this.blocks = [
            {
                id: 1,
                name: "Brick",
                src: "/assets/blocks/block-brick.png",
            },
            {
                id: 2,
                name: "Clay",
                src: "/assets/blocks/block-clay.png",
            },
            {
                id: 3,
                name: "Paper",
                src: "/assets/blocks/block-paper.png",
            },
            {
                id: 4,
                name: "Abstract 1",
                src: "/assets/blocks/block-abstract-1.png",
            },
            {
                id: 5,
                name: "Abstract 2",
                src: "/assets/blocks/block-abstract-2.png",
            },
            {
                id: 6,
                name: "Abstract 3",
                src: "/assets/blocks/block-abstract-3.png",
            },
        ];
    }

    render() {
        const blockWidth = 50;
        const blockHeight = 50;

        this.canvas.width = blockWidth * this.matrixRows;
        this.canvas.height = blockWidth * this.matrixCols;

        const ctx = this.canvas.getContext("2d");

        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                if (this.matrix[y][x] !== 0) {
                    const block = this.blocks.find((block) => {
                        return block.id === this.matrix[y][x];
                    });

                    this.loadImage(block.src).then((image) => {
                        const xCoord = (x + 1) * blockHeight - 50;
                        const yCoord = (y + 1) * blockWidth - 50;

                        ctx.drawImage(
                            image,
                            xCoord,
                            yCoord,
                            blockWidth,
                            blockHeight
                        );
                    });
                }
            }
        }
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                return resolve(image);
            };
            image.onerror = () => {
                return reject(
                    new Error(`Loading image with src="${src}" failed.`)
                );
            };
            image.src = src;
        });
    }

    toXML() {
        const entities = [];

        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                if (this.matrix[y][x] !== 0) {
                    let attributes = {};
                    switch (this.matrix[y][x]) {
                        case 1:
                            attributes["name"] = `brick_${x}_${y}`;
                            attributes["meta-entity"] = `block_brick`;
                            break;
                        case 2:
                            attributes["name"] = `clay_${x}_${y}`;
                            attributes["meta-entity"] = `block_clay`;
                            break;
                        case 3:
                            attributes["name"] = `paper_${x}_${y}`;
                            attributes["meta-entity"] = `block_paper`;
                            break;
                        case 4:
                            attributes["name"] = `abstract_1_${x}_${y}`;
                            attributes["meta-entity"] = `block_abstract_1`;
                            break;
                        case 5:
                            attributes["name"] = `abstract_2_${x}_${y}`;
                            attributes["meta-entity"] = `block_abstract_2`;
                            break;
                        case 6:
                            attributes["name"] = `abstract_3_${x}_${y}`;
                            attributes["meta-entity"] = `block_abstract_3`;
                            break;
                        default:
                            break;
                    }

                    entities.push({
                        _attributes: attributes,
                        data: {
                            position: `${x * 50};${y * 50}`,
                        },
                        logic: {},
                    });
                }
            }
        }

        const xmlString = js2xml(
            {
                entities: {
                    entity: entities,
                },
            },
            {
                compact: true,
                ignoreComment: true,
                spaces: 4,
            }
        );

        return xmlString;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new App(document.querySelector("#app"));
    app.render();

    const levelGenerator = new LevelGenerator(
        document.querySelector("#app-canvas"),
        levels[0]
    );
    levelGenerator.render();

    document.querySelector(".select").addEventListener("change", (event) => {
        const levelId = event.target.value;
        const level = levels.find((level) => {
            return level.id == levelId;
        });

        levelGenerator.matrix = level.matrix;
        levelGenerator.render();
    });

    document
        .getElementById("btn-download-xml")
        .addEventListener("click", () => {
            const xml = levelGenerator.toXML();

            const element = document.createElement("a");
            element.setAttribute(
                "href",
                "data:text/plain;charset=utf-8," + encodeURIComponent(xml)
            );
            element.setAttribute("download", "level.xml");

            element.style.display = "none";
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        });
});
