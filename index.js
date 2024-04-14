/**
 * Imports LDtk World Into Phaser
 * @argument {string} world LDtk Json data (World data)
 * @license MIT
 */
export default class {
    worldData
    constructor(world) {
        console.log("📥 LDtk Loader v0.0.0");
        this.worldData = JSON.parse(world);
    }
}

