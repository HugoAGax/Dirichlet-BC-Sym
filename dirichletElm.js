(function() {
	"use strict";

	 function DirichletElm (size = 5, temps = [5, 10], err = 1, sor = 1.5, ambient = 0, runs = 1) {
        this.nodesPerSide = size;
        this.temperatures = getTemps(temps);
        this.targetError = err; 
        this.finalState = runAnalysis(
            [...Array(Math.pow(this.nodesPerSide, 2)).fill(ambient)],
            this.temperatures, this.nodesPerSide,
            sor,
            runs
        );
        this.resultMatrix = toMatrix(this.finalState, this.nodesPerSide);
    }
    function runAnalysis (vrs, tmp, sze, sor, rns) {
        for(let i = 0; i < 15; i++){
            vrs = liebmannMethod(vrs, tmp, sze);
        }
        return vrs;
    }

    let getTemps =  (arr) => {
        switch(arr.length){
            case(1): 
                return [...Array(4).fill(arr[0])] 
            case(2):
                return [arr[0], arr[1], arr[0], arr[1]]
            case(3): 
                return [arr[0], arr[1], arr[2], arr[1]] 
            case(4):
                return arr
            default:
                return 'Incorrect temperature array input'
        }
    }


    //Temperature distribution TOP, RIGHT, BOTTOM, LEFT
    let liebmannMethod = (vars, temps, size) => {
        let avgError = 0;
        vars.forEach((current, i) => {
            current = (
                ((vars[i - (size)] != undefined)? vars[i - (size)] : temps[0]) + 
                ((vars[i - 1] != undefined && i % size != 0)? vars[i - 1] : temps[3]) +
                ((vars[i + (size)] != undefined)? vars[i + (size)] : temps[2]) + 
                ((vars[i + 1] != undefined && i % size != size - 1)? vars[i + 1] : temps[1])
            )/4;
            /*current = methodSOR(current, vars[i], valueSOR);
            avgError += getRelError(current, vars[i]);*/
            vars[i] = current;
        }); 
        //avgError /= vars.length;
        return vars;
    };

    let methodSOR = (newVal, oldVal, valueSOR) => {
        return valueSOR * newVal + (1 - valueSOR) * oldVal;
    }

    let getRelError = (newVal, oldVal) => {
        return (newVal - oldVal) / newVal * 100;
    }

    function toMatrix(list, elementsPerSubArray) {
        var matrix = [], i, k;
        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = [];
            }
            matrix[k].push(list[i]);
        }
        return matrix;
    }

    // Node: Export function
	if (typeof module !== "undefined" && module.exports) {
	    module.exports = DirichletElm;
	}
	// AMD/requirejs: Define the module
	else if (typeof define === 'function' && define.amd) {
	    define(function () {return DirichletElm;});
	}
	// Browser: Expose to window
	else {
	    window.DirichletElm = DirichletElm;
    }
})();