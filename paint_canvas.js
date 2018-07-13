var $canvas = $('#vertical');
var canvas = $canvas[0];
var context = canvas.getContext('2d');
var retreat = 10;
context.fillStyle = 'black';
for (var i = 0; i < 30; i++) {
    retreat += 15;
    context.fillRect(retreat, 10, 2, 475);
    context.fillRect(10, retreat, 475, 2);
}

var coordinatesCollection = {
    coordinates: [],
    deleteBlock: [],
    createBlock: [],

     clearCreate: function() {
         // this.createBlock = this.createBlock.filter(cre => cre.x  >  475 );
         // this.createBlock = this.createBlock.filter(cre => cre.x  <  10 );
         //     for (var i = 0; i < this.createBlock.length; i++) {
    //         if (this.createBlock[i].x < 10) {
    //             this.createBlock.splice(i, 1);
    //             console.log(i);
    //         }
    //         if (this.createBlock[i].y < 10) {
    //             this.createBlock[i].splice(i, 1);
    //         }
    //         if (this.createBlock[i].x > 475) {
    //             this.createBlock.splice(i, 1);
    //         }
    //         if (this.createBlock[i].y > 475) {
    //             this.createBlock[i].splice(i, 1);
    //         }
    //     }
     },

    add: function (coordinateY, coordinateX) {
        this.createBlock.push(viewBlock.createBlock(coordinateY, coordinateX));
    },

    updateCoordinates: function () {
        $.merge(this.coordinates, this.createBlock);
        this.createBlock = [];
    },


    changeOldCoordinates: function (value) {
        return !this.deleteBlock.some((del) => del.x === value.x && del.y === value.y);
    },

    filter: function () {
        this.coordinates = this.coordinates.filter(this.changeOldCoordinates.bind(this));
        this.deleteBlock = [];
    }
};

var viewBlock = {
    initialize: function () {
        this.canva();
        this.subscribe();
        this.random();
    },
    
    canva: function () {
        $canvas.on('click', function (event) {
            var height = Math.ceil((event.offsetY - 25 - 10 - 4) / 15);
            var width = Math.ceil((event.offsetX - 15 - 10 - 4) / 15);
            this.paintBlock(height, width);
            this.sawBlock()
        }.bind(this));
    },

    random: function (event) {
        $('.button .random').on('click', function () {
            var heigh = 10;
            var widt;

            for (var i = 0; i < 30; i++) {
                widt = 10;
                heigh += 15;
                for (var j = 0; j < 30; j++) {
                    if (this.randomCreation(25) < 5) {
                        coordinatesCollection.coordinates.push(this.getBlockInformation(heigh, widt));
                    }
                    widt += 15;
                }
            }
            this.sawBlock();
        }.bind(this));
        },

    timeInterval: function () {
       var d = setTimeout(function () {
            this.dieOrLife();
            coordinatesCollection.clearCreate();
           coordinatesCollection.updateCoordinates();
           coordinatesCollection.filter();
           this.clearAll();
           this.sawBlock();
       }.bind(this), 1000);

        $('.button .stop').on('click', function () {
            clearTimeout(d);
        })
    },

    subscribe: function () {
        $('.button .start').on('click', function () {
            this.timeInterval();
        }.bind(this));
    },


    paintBlock: function (height, width) {
        var heigh = 10;
        var widt;

        for (var i = 0; i < 30; i++) {
            widt = 10;
            heigh += 15;
            for (var j = 0; j < 30; j++) {
                if (height === i && width === j) {
                    coordinatesCollection.coordinates.push(this.getBlockInformation(heigh, widt));
                }
                widt += 15;
            }
        }
    },

    clearAll: function () {
        var heigh = 10;
        var widt;

        for (var i = 0; i < 30; i++) {
            widt = 10;
            heigh += 15;
            for (var j = 0; j < 30; j++) {

                context.fillStyle = 'white';
                context.fillRect(widt + 4, heigh + 4, 10, 10);
                widt += 15;
            }
        }
    },

    sawBlock: function () {
        for (var i = 0; i < coordinatesCollection.coordinates.length; i++) {
            context.fillStyle = 'black';
            context.fillRect(coordinatesCollection.coordinates[i].x + 4, coordinatesCollection.coordinates[i].y + 4, 10, 10);
        }
    },

    liveCells: function (cells, i) {
        if (cells < 2) {
            coordinatesCollection.deleteBlock.push(this.deleteBlock(coordinatesCollection.coordinates[i].y, coordinatesCollection.coordinates[i].x));
        }
        if ((cells === 2) || (cells === 3)) {}
        if (cells > 3) {
            coordinatesCollection.deleteBlock.push(this.deleteBlock(coordinatesCollection.coordinates[i].y, coordinatesCollection.coordinates[i].x))
        }
        if (this.addCellsTop(coordinatesCollection.coordinates[i].y, coordinatesCollection.coordinates[i].x) === 3) {
            coordinatesCollection.add(coordinatesCollection.coordinates[i].y - 15, coordinatesCollection.coordinates[i].x)
        }
        if (this.addCellsBot(coordinatesCollection.coordinates[i].y, coordinatesCollection.coordinates[i].x) === 3) {
            coordinatesCollection.add(coordinatesCollection.coordinates[i].y + 15, coordinatesCollection.coordinates[i].x);
        }
        if (this.addCellsRigth(coordinatesCollection.coordinates[i].y, coordinatesCollection.coordinates[i].x) === 3) {
            coordinatesCollection.add(coordinatesCollection.coordinates[i].y, coordinatesCollection.coordinates[i].x + 15);
        }
        if (this.addCellsLeft(coordinatesCollection.coordinates[i].y, coordinatesCollection.coordinates[i].x) === 3) {
            coordinatesCollection.add(coordinatesCollection.coordinates[i].y, coordinatesCollection.coordinates[i].x - 15);
        }
    },

    addCellsTop: function (coordinateY, coordinateX) {
        var cells = 1;
        for (var i = 0; i < coordinatesCollection.coordinates.length; i++) {
            if (coordinateY - 30 === coordinatesCollection.coordinates[i].y) {
                if (coordinateX + 15 === coordinatesCollection.coordinates[i].x) {
                    cells++;
                }
                if (coordinateX - 15 === coordinatesCollection.coordinates[i].x) {
                    cells++;
                }
                if (coordinateX === coordinatesCollection.coordinates[i].x) {
                    cells++;
                }
            }

            if (coordinateY - 15 === coordinatesCollection.coordinates[i].y) {

                if (coordinateX + 15 === coordinatesCollection.coordinates[i].x) {
                    cells++;
                }

                if (coordinateX - 15 === coordinatesCollection.coordinates[i].x) {
                    cells++;
                }
            }

            if (coordinateY === coordinatesCollection.coordinates[i].y) {
                if (coordinateX + 15 === coordinatesCollection.coordinates[i].x) {
                    cells++;
                }

                if (coordinateX - 15 === coordinatesCollection.coordinates[i].x) {
                    cells++;
                }
            }
        }
        return cells;

    },

    addCellsBot: function (coordinateY, coordinateX) {
        var cells = 1;

        for (var i = 0; i < coordinatesCollection.coordinates.length; i++) {
            if (coordinateY + 30 === coordinatesCollection.coordinates[i].y) { //&& coordinateX !== coordinatesCollection.coordinates[i].x
                if (coordinateX + 15 === coordinatesCollection.coordinates[i].x) {
                    cells++;
                }
                if (coordinateX - 15 === coordinatesCollection.coordinates[i].x) {
                    cells++;
                }
                if (coordinateX === coordinatesCollection.coordinates[i].x) {
                    cells++;
                }
            }

            if (coordinateY + 15 === coordinatesCollection.coordinates[i].y) {

                if (coordinateX + 15 === coordinatesCollection.coordinates[i].x) {
                    cells++;
                }

                if (coordinateX - 15 === coordinatesCollection.coordinates[i].x) {
                    cells++;
                }
            }

            if (coordinateY === coordinatesCollection.coordinates[i].y) {
                if (coordinateX + 15 === coordinatesCollection.coordinates[i].x) {
                    cells++;
                }

                if (coordinateX - 15 === coordinatesCollection.coordinates[i].x) {
                    cells++;
                }
            }
        }
        return cells;
    },

    addCellsLeft: function (coordinateY, coordinateX) {
        var cells = 1;

        for (var i = 0; i < coordinatesCollection.coordinates.length; i++) {
            if (coordinateX === coordinatesCollection.coordinates[i].x) {
                if (coordinateY - 15 === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }
                if (coordinateY + 15 === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }
            }

            if (coordinateX - 30 === coordinatesCollection.coordinates[i].x) {
                if (coordinateY - 15 === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }
                if (coordinateY - 30 === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }
                if (coordinateY === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }
            }

            if (coordinateX - 15 === coordinatesCollection.coordinates[i].x) {
                if (coordinateY - 30 === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }
                if (coordinateY - 15 === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }
            }
        }
        return cells;
    },

    addCellsRigth: function (coordinateY, coordinateX) {
        var cells = 1;

        for (var i = 0; i < coordinatesCollection.coordinates.length; i++) {
            if (coordinateX === coordinatesCollection.coordinates[i].x) {
                if (coordinateY + 15 === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }

                if (coordinateY - 15 === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }
            }

            if (coordinateX + 15 === coordinatesCollection.coordinates[i].x) {

                if (coordinateY + 15 === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }

                if (coordinateY - 15 === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }

                if (coordinateY === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }
            }

            if (coordinateX - 15 === coordinatesCollection.coordinates[i].y) {
                if (coordinateY + 15 === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }

                if (coordinateY - 15 === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }

                if (coordinateY === coordinatesCollection.coordinates[i].y) {
                    cells++;
                }
            }
        }
        return cells;
    },

    dieOrLife: function () {
        for (var i = 0; i < coordinatesCollection.coordinates.length; i++) {
            var cells = 0;
            for (var j = 0; j < coordinatesCollection.coordinates.length; j++) {

                if (coordinatesCollection.coordinates[i].y - 15 === coordinatesCollection.coordinates[j].y) {
                    if (coordinatesCollection.coordinates[i].x - 15 === coordinatesCollection.coordinates[j].x) {
                        cells++;
                    }
                    if (coordinatesCollection.coordinates[i].x + 15 === coordinatesCollection.coordinates[j].x) {
                        cells++;
                    }
                    if (coordinatesCollection.coordinates[i].x === coordinatesCollection.coordinates[j].x) {
                        cells++;
                    }
                }

                if (coordinatesCollection.coordinates[i].y + 15 === coordinatesCollection.coordinates[j].y) {

                    if (coordinatesCollection.coordinates[i].x - 15 === coordinatesCollection.coordinates[j].x) {
                        cells++;
                    }

                    if (coordinatesCollection.coordinates[i].x + 15 === coordinatesCollection.coordinates[j].x) {
                        cells++;
                    }

                    if (coordinatesCollection.coordinates[i].x === coordinatesCollection.coordinates[j].x) {
                        cells++;
                    }

                }

                if (coordinatesCollection.coordinates[i].y === coordinatesCollection.coordinates[j].y) {

                    if (coordinatesCollection.coordinates[i].x - 15 === coordinatesCollection.coordinates[j].x) {
                        cells++;
                    }

                    if (coordinatesCollection.coordinates[i].x + 15 === coordinatesCollection.coordinates[j].x) {
                        cells++;
                    }
                }
            }
            this.liveCells(cells, i);
        }

        this.timeInterval();
    },

    randomCreation: function (random) {
        return Math.floor(Math.random() * Math.floor(random))
    },

    getBlockInformation: function (height, width) {
        return {
            y: height,
            x: width
        }
    },

    deleteBlock: function (height, width) {
        return {
            y: height,
            x: width
        }
    },

    createBlock: function (height, width) {
        return {
            y: height,
            x: width
        }
    },
};
viewBlock.initialize();
