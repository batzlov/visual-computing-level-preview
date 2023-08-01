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
                <img class="block block-preview-img" src="/assets/blocks/player.png">
                <img class="block block-preview-img" src="/assets/blocks/crate.png">
                <img class="block block-preview-img" src="/assets/blocks/shroom-magic.png">
                <img class="block block-preview-img" src="/assets/blocks/shroom-toxic.png">
                <img class="block block-preview-img" src="/assets/blocks/finish.png">
                <img class="block block-preview-img" src="/assets/blocks/ground-earth.png">
                <img class="block block-preview-img" src="/assets/blocks/plattform-1.png">
                <img class="block block-preview-img" src="/assets/blocks/plattform-2.png">
                <img class="block block-preview-img" src="/assets/blocks/plattform-3.png">
                <img class="block block-preview-img" src="/assets/blocks/ground.png">
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
                name: "Ground-Earth",
                src: "/assets/blocks/ground-earth.png",
            },
            {
                id: 2,
                name: "Ground",
                src: "/assets/blocks/ground.png",
            },
            {
                id: 3,
                name: "Plattform-1",
                src: "/assets/blocks/plattform-1.png",
            },
            {
                id: 4,
                name: "Plattform-2",
                src: "/assets/blocks/plattform-2.png",
            },
            {
                id: 5,
                name: "Plattform-3",
                src: "/assets/blocks/plattform-3.png",
            },
            {
                id: 6,
                name: "Player",
                src: "/assets/blocks/player.png",
            },
            {
                id: 7,
                name: "Finish",
                src: "/assets/blocks/finish.png",
            },
            {
                id: 8,
                name: "Crate",
                src: "/assets/blocks/crate.png",
            },
            {
                id: 9,
                name: "Shroom-Magic",
                src: "/assets/blocks/shroom-magic.png",
            },
            {
                id: 10,
                name: "Shroom-Toxic",
                src: "/assets/blocks/shroom-toxic.png",
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
        const map = {
            height: this.matrix.length * 50,
            width: this.matrix[0].length * 50,
            entities: [],
        };

        const convertToXMLType = (typeId) => {
            if (typeId === 1 || typeId === 2) {
                return 1;
            } else if (typeId === 3 || typeId === 4 || typeId === 5) {
                return 2;
            } else if (typeId === 6) {
                return 0;
            } else if (typeId === 7) {
                return 4;
            } else if (typeId === 8) {
                return 3;
            } else if (typeId === 9) {
                return 5;
            } else if (typeId === 10) {
                return 6;
            }
        };

        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                if (this.matrix[y][x] !== 0) {
                    let attributes = {};
                    switch (this.matrix[y][x]) {
                        case 1:
                            attributes["name"] = `ground_earth_${x}_${y}`;
                            attributes["meta-entity"] = `ground_earth`;
                            break;
                        case 2:
                            attributes["name"] = `ground_${x}_${y}`;
                            attributes["meta-entity"] = `ground`;
                            break;
                        case 3:
                            attributes["name"] = `plattform_1_${x}_${y}`;
                            attributes["meta-entity"] = `plattform_1`;
                            break;
                        case 4:
                            attributes["name"] = `plattform_2_${x}_${y}`;
                            attributes["meta-entity"] = `plattform_2`;
                            break;
                        case 5:
                            attributes["name"] = `plattform_3_${x}_${y}`;
                            attributes["meta-entity"] = `plattform_3`;
                            break;
                        case 6:
                            attributes["name"] = `player_${x}_${y}`;
                            attributes["meta-entity"] = `player`;
                            break;
                        case 7:
                            attributes["name"] = `finish_${x}_${y}`;
                            attributes["meta-entity"] = `finish`;
                            break;
                        case 8:
                            attributes["name"] = `crate_${x}_${y}`;
                            attributes["meta-entity"] = `crate`;
                            break;
                        case 9:
                            attributes["name"] = `shroom_magic_${x}_${y}`;
                            attributes["meta-entity"] = `shroom_magic`;
                            break;
                        case 10:
                            attributes["name"] = `shroom_toxic_${x}_${y}`;
                            attributes["meta-entity"] = `shroom_toxic`;
                            break;
                        default:
                            break;
                    }

                    map.entities.push({
                        _attributes: attributes,
                        data: {
                            position: `${x * 50};${y * 50}`,
                            size: `50;50`,
                            type: convertToXMLType(this.matrix[y][x]),
                        },
                        logic: {},
                    });
                }
            }
        }

        const xmlString = js2xml(
            {
                map: {
                    height: map.height,
                    width: map.width,
                    entities: {
                        entity: map.entities,
                    },
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
        levelGenerator.matrixCols = level.matrix.length;
        levelGenerator.matrixRows = level.matrix[0].length;

        levelGenerator.canvas.style.height = `${level.matrix.length * 50}px`;
        levelGenerator.canvas.style.width = `${level.matrix[0].length * 50}px`;

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
