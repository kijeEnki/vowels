const vowels = {
    "i": { h: 0, b: 0, r: -1 },
    "y": { h: 0, b: 0, r: 1 },
    "ɨ": { h: 0, b: 2, r: -1 },
    "ʉ": { h: 0, b: 2, r: 1 },
    "ɯ": { h: 0, b: 4, r: -1 },
    "u": { h: 0, b: 4, r: 1 },
    "ɪ": { h: 1, b: 1, r: -1 },
    "ʏ": { h: 1, b: 1, r: 1 },
    "ʊ": { h: 1, b: 3, r: 1 },
    "e": { h: 2, b: 0, r: -1 },
    "ø": { h: 2, b: 0, r: 1 },
    "ɘ": { h: 2, b: 2, r: -1 },
    "ɵ": { h: 2, b: 2, r: 1 },
    "ɤ": { h: 2, b: 4, r: -1 },
    "o": { h: 2, b: 4, r: 1 },
    "ə": { h: 3, b: 2, r: 0 },
    "ɛ": { h: 4, b: 0, r: -1 },
    "œ": { h: 4, b: 0, r: 1 },
    "ɜ": { h: 4, b: 2, r: -1 },
    "ɞ": { h: 4, b: 2, r: 1 },
    "ʌ": { h: 4, b: 4, r: -1 },
    "ɔ": { h: 4, b: 4, r: 1 },
    "æ": { h: 5, b: 0, r: -1 },
    "ɐ": { h: 5, b: 2, r: 0 },
    "a": { h: 6, b: 0, r: -1 },
    "ɶ": { h: 6, b: 0, r: 1 },
    "ɑ": { h: 6, b: 4, r: -1 },
    "ɒ": { h: 6, b: 4, r: 1 },
};
const gridlines = [
    // vertical-ish
    [[100, 25], [300, 325]],
    [[200, 25], [350, 325]],
    [[300, 25], [400, 325]],
    [[400, 25], [450, 325]],
    [[500, 25], [500, 325]],
    // horizontal
    [[100, 25], [500, 25]],
    [[400 / 3, 75], [500, 75]],
    [[500 / 3, 125], [500, 125]],
    [[200, 175], [500, 175]],
    [[700 / 3, 225], [500, 225]],
    [[800 / 3, 275], [500, 275]],
    [[300, 325], [500, 325]]
];

const upTack = "˔";
const downTack = "˕";
const leftTack = "꭪";
const rightTack = "꭫";

const upTackC = "\u031d";
const downTackC = "\u031e";
const leftTackC = "\u0318";
const rightTackC = "\u0319";
const roundC = "\u0339";
const unroundC = "\u031c";

const select = document.getElementById("vowel");
const button = document.getElementById("confirm");
const canvas = document.getElementById("canvas");

const font = "24px helvetica, arial, sans-serif";
const fill = "black";

for (let vowel in vowels) {
    let opt = document.createElement("option");
    opt.value = vowel;
    opt.innerText = vowel;
    select.appendChild(opt);
}

function express(vowel) {
    let compare = select.value;
    let deltaH = vowels[compare]["h"] - vowels[vowel]["h"];
    let deltaB = vowels[compare]["b"] - vowels[vowel]["b"];
    let deltaR = vowels[compare]["r"] - vowels[vowel]["r"];

    if (deltaR > 0) {
        compare += unroundC.repeat(deltaR);
    } else if (deltaR < 0) {
        compare += roundC.repeat(Math.abs(deltaR));
    }
    if (deltaB > 0) {
        compare += leftTack + leftTackC.repeat(deltaB - 1);
    } else if (deltaB < 0) {
        compare += rightTack + rightTackC.repeat(Math.abs(deltaB) - 1);
    }
    if (deltaB === 0) {
        if (deltaH > 0) {
            compare += upTack + upTackC.repeat(deltaH - 1);
        } else if (deltaH < 0) {
            compare += downTack + downTackC.repeat(Math.abs(deltaH) - 1);
        }
    } else {
        if (deltaH > 0) {
            compare += upTackC.repeat(deltaH);
        } else if (deltaH < 0) {
            compare += downTackC.repeat(Math.abs(deltaH));
        }
    }

    return compare;
}

function drawChart() {
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "silver";
    for (let line of gridlines) {
        ctx.moveTo(line[0][0], line[0][1]);
        ctx.lineTo(line[1][0], line[1][1]);
        ctx.stroke();
    }

    ctx.fillStyle = fill;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let vowel in vowels) {
        let h = vowels[vowel]["h"];
        let b = vowels[vowel]["b"];
        let r = 25 * vowels[vowel]["r"];

        let y = 25 + 50 * h;

        let xLeft = h / 3;
        let xRight = (4 - xLeft) * (b / 4);

        let x = 100 * (1 + xLeft + xRight);

        if (select.value) {
            text = express(vowel);
        } else {
            text = vowel;
        }

        if (vowel === text) {
            ctx.font = "bold " + font;
            ctx.fillStyle = "red";
        } else {
            ctx.font = font;
            ctx.fillStyle = fill;
        }

        ctx.fillText(
            text,
            x + r,
            y
        );
        if (vowels[vowel].r !== 0) {
            ctx.font = font;
            ctx.fillStyle = fill;
            ctx.fillText(
                "•",
                x,
                y
            );
        }
    }
}

button.addEventListener("click", drawChart);