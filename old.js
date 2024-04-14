// OLD Importer used in game (Broken)
import Phaser from "phaser";
export default class {
    /**
     * LDTK Phaser importer
     * @version 0.0.1a
     * @param {Object} ldtkObject Parsed LDTK json
     */
    constructor(ldtkObject) {
        console.log("📥 LDtk Loader v0.0.1a");
        this.ldtkObject = ldtkObject;
        this.levelMappings = {};
        if (ldtkObject.levels != undefined) {
            console.warn("World indexing started!");
            ldtkObject.levels.forEach((el,index) => {
                this.levelMappings[el.identifier] = index;
            });
            console.warn("World indexing done!");
        } else {
            throw new LDTKVarNotFound("levels");
        }
        this.tilesets = [];
        ldtkObject.defs.tilesets.forEach(tileset => {
            this.tilesets.push(
                tileset
            );
        });

        console.dir(this.levelMappings);
    }
    /**
     * Gets Level data
     * @param {string} name Name of the level. Example: "Level_0"
     * @returns {LDTKLevel}
     */
    getLevel(name) {
        if (this.levelMappings[name] != undefined) {
            if (this.ldtkObject.levels) {
                return new LDTKLevel(this.ldtkObject.levels[this.levelMappings[name]], this.tilesets);
            } else {
                throw new LDTKVarNotFound("levels");
            }
        } else {
            throw new LevelNotFound(name);
        }
    }
}

export class LDTKLevel extends Phaser.Tilemaps.MapData {
    /**
     * General Lavel Data
     * 
     * NOTE: Run only when needed. Hangs process if level is large
     * @param {*} levelData 
     */
    constructor(levelData,tilesets) {
        super();
        console.log(tilesets);
        this.tileHeight = 64;
        this.tileWidth = 64;
        this.levelData = levelData;
        this.layerMapping = {};
        if (levelData.layerInstances != undefined) {
            levelData.layerInstances.forEach((l)=> {
                let layer = new Phaser.Tilemaps.LayerData();
                layer.width = l.__cWid;
                layer.height = l.__cHei;
                layer.tileWidth = l.__gridSize;
                layer.MapData = this;
                layer.name = l.__identifier;
                if (l.autoLayerTiles != undefined) {
                    for (var y = 0; y < l.__cHei; y++) {
                        layer.data[y] = [];
                        for (var x = 0; x < l.__cWid; x++) {
                            layer.data[y][x] = null;
                        }
                    }
                    l.autoLayerTiles.forEach((tile) => {
                        let x = Math.floor(tile.px[0] / l.__gridSize);
                        let y = Math.floor(tile.px[1] / l.__gridSize);
                        let t = new Phaser.Tilemaps.Tile(
                            layer,
                            tile.t,
                            x,y,
                            l.__gridSize,l.__gridSize,
                            l.__gridSize,l.__gridSize);
                        switch (tile.f) {
                            case 1:
                                t.flipX = true;
                                t.flipY = false;
                                break;
                            case 2:
                                t.flipX = false;
                                t.flipY = true;
                                break;
                            case 3:
                                t.flipX = true;
                                t.flipY = true;
                                break; 
                            default:
                                break;
                        }
                        t.setCollision(true,true,true,true);
                        
                        //t.setCollisionCallback(() => {
                        //    console.log("coll");
                        //});

                        layer.data[y][x] = t;
                    });
                    
                    // console.dir(layer.data);
                } else {
                    throw new LDTKWrongTypeLayer('s','s');
                }

                this.layers.push(layer);
            });
        } else {
            throw new LDTKVarNotFound("layerInstances");
        }
    }
}

// Error Types
class LevelNotFound extends Error {
    constructor(levelName) {
        super(`Level "${levelName}" was not found in World!`);
    }
}

class LDTKVarNotFound extends Error {
    /**
     * 
     * @param {*} missingVar Missing Variable that should be chacked
     */
    constructor(missingVar) {
        super("Object does not include \"" + missingVar + "\". Is it really LDtk data?");
    }
}

class LDTKWrongTypeLayer extends Error {
    constructor(type,expects) {
        super(`Layer convert error! Wrong type (${type}) expected (${expects})`);
    }
}