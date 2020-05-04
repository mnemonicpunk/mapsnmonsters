const MAP_WIDTH = 8;
const MAP_HEIGHT = 8;

const SUBTILE_WIDTH = 48;
const SUBTILE_HEIGHT = 48;

const SAMPLE_MAP = [0,0,0,13,13,0,0,0,0,0,13,12,12,13,0,0,0,14,12,12,12,12,16,0,22,12,12,1,1,16,0,0,0,15,2,0,0,0,0,0,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const EMPTY_MAP = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const SAMPLE_PIECES = [
    {
        name: "Nibbi",
        icon: "Icon_01",
        type: "hero"
    },
    {
        name: "Fussel",
        icon: "Icon_02",
        type: "hero"
    },
    {
        name: "Robin",
        icon: "Icon_03",
        type: "hero"
    },
    {
        name: "Rolf",
        icon: "Icon_04",
        type: "hero"
    },
    {
        name: "Johnny",
        icon: "Icon_05",
        type: "hero"
    },
    {
        name: "Spieler6",
        icon: "Icon_06",
        type: "hero"
    },           
    {
        name: "Gegner1",
        icon: "Icon_09",
        type: "enemy"
    },
    {
        name: "Gegner2",
        icon: "Icon_09",
        type: "enemy"
    },
    {
        name: "Gegner3",
        icon: "Icon_09",
        type: "enemy"
    },
    {
        name: "Gegner4",
        icon: "Icon_09",
        type: "enemy"
    },
    {
        name: "Gegner5",
        icon: "Icon_09",
        type: "enemy"
    },
    {
        name: "Gegner6",
        icon: "Icon_09",
        type: "enemy"
    },
    {
        name: "Gegner7",
        icon: "Icon_09",
        type: "enemy"
    },
    {
        name: "Gegner8",
        icon: "Icon_09",
        type: "enemy"
    }    
]

const TILE_COMPONENTS = [
    [1,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1], // Starttile

    [1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1], // Straight up-down
    [1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1], // Straight left-right

    [1,1,1,1,1,0,0,0,1,0,0,0,1,0,0,1], // L-shape down-right
    [1,0,0,1,1,0,0,0,1,0,0,0,1,1,1,1], // L-shape up-right
    [1,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1], // L-shape up-left
    [1,1,1,1,0,0,0,1,0,0,0,1,1,0,0,1], // L-shape down-left

    [1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,1], // T-shape dlr
    [1,0,0,1,1,0,0,0,1,0,0,0,1,0,0,1], // T-shape urd
    [1,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1], // T-shape lur
    [1,0,0,1,0,0,0,1,0,0,0,1,1,0,0,1], // T-shape uld

    [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1], // Cross-shape

    [1,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1], // end-down
    [1,1,1,1,1,0,0,0,1,0,0,0,1,1,1,1], // end-right
    [1,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1], // end-up
    [1,1,1,1,0,0,0,1,0,0,0,1,1,1,1,1], // end-left

    [1,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1], // exit-down
    [1,1,1,1,1,0,0,0,1,0,0,0,1,1,1,1], // exit-right
    [1,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1], // exit-up
    [1,1,1,1,0,0,0,1,0,0,0,1,1,1,1,1], // exit-left

    [1,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1], // Boss-down
    [1,1,1,1,1,0,0,0,1,0,0,0,1,1,1,1], // Boss-right
    [1,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1], // Boss-up
    [1,1,1,1,0,0,0,1,0,0,0,1,1,1,1,1] // Boss-left 
];

window.addEventListener('load', function() {
    let tabletop = new TableTop();
});