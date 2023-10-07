import Controller from './Controller.js';
import path from 'path';
import fs from 'fs';
export default class CoursesController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
        this.params = HttpContext.path.params;
    }
    startOperation() {
        const validOperations = [' ', '+', '-', '/', '*', '%', '!', 'p', 'np'];
        const XYOperations = [' ', '+', '-', '/', '*', '%'];
        const NOperation = ['!', 'p', 'np'];
        const xyParameters = ['op', 'x', 'y'];
        const nParameters = ['op', 'n'];
        let refusedParams;
        let result;
        let isInteger = Number.isInteger(parseFloat(this.params.n));
        let isPositive = this.params.n > 0;
        if(XYOperations.includes(this.params.op)){
            refusedParams = Object.keys(this.params).filter(param => !xyParameters.includes(param));
        }else if(NOperation.includes(this.params.op)){
            refusedParams = Object.keys(this.params).filter(param => !nParameters.includes(param));
        }
        if (refusedParams && refusedParams.length > 0) {
            this.params.error = 'Parameters refused: ' + refusedParams.join(', ');
        }
        if (!this.params.error && !validOperations.includes(this.params.op)) {
            this.params.error = 'There is a error with the operation parameter';
        }
        else {
            if (!this.params.error && XYOperations.includes(this.params.op)) {
                // handle error if the variable x or y are letters
                if (isNaN(this.params.x) || isNaN(this.params.y)) {
                    if (this.params.x === 'X' || this.params.y === 'Y') {
                        this.params.error = 'Variables x and y must be lowercase';
                    } else {
                        this.params.error = 'Variables x and y must be numbers';
                    }
                } else {
                    let x = parseFloat(this.params.x);
                    let y = parseFloat(this.params.y);
                    if (this.params.op === ' ') {
                        this.params.op = '+'
                        result = this.sum(x, y);
                    } else if (this.params.op === '-') {
                        result = this.sub(x, y);
                    } else if (this.params.op === '/') {
                        result = this.div(x, y);
                    } else if (this.params.op === '*') {
                        result = this.multi(x, y);
                    } else if (this.params.op === '%') {
                        result = this.mod(x, y);
                    }
                }
            }

            if (!this.params.error && isPositive && isInteger && NOperation.includes(this.params.op)) {
                if (isNaN(this.params.n)) {
                    this.params.error = 'Variables n must be numeric';
                } else {
                    let n = parseInt(this.params.n);
                    if (this.params.op === '!') {
                        result = this.factorial(n);
                    } else if (this.params.op === 'p') {
                        result = this.isPrime(n);
                    } else if (this.params.op === 'np') {
                        result = this.findNthPrime(n);
                    }
                }
            }
        }
        // error for is negative or is not int
        if (!this.params.error && (!isPositive || !isInteger) && NOperation.includes(this.params.op)) {
            if (!isPositive)
                this.params.error = "The parameter n must be positive!";
            else if (!isInteger)
                this.params.error = "The parameter n must be a integer!";
        }
        if (!this.params.error) {
            this.params.value = result;
        }
        this.HttpContext.response.end(JSON.stringify(this.params));
    }
    sum(x, y) {
        return x + y;
    }
    sub(x, y) {
        return x - y;
    }
    div(x, y) {
        if (x == 0 || y == 0)
            return "Infinity";
        return x / y;
    }
    multi(x, y) {
        return x * y;
    }
    mod(x, y) {
        if (x == 0 || y == 0)
            return "Infinity";
        return x % y;
    }

    factorial(n) {
        if (n === 0 || n === 1) {
            return 1;
        } else {
            return n * this.factorial(n - 1);
        }
    }

    isPrime(n) {
        if (n <= 1) {
            return false;
        }
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) {
                return false;
            }
        }
        return true;
    }

    findNthPrime(n) {
        let count = 0;
        let num = 2;
        while (count < n) {
            if (this.isPrime(num)) {
                count++;
            }
            num++;
        }
        return num - 1;
    }


    help() {
        let helpPagePath = path.join(process.cwd(), wwwroot, 'API-Help-Pages/API-Maths-Help.html');
        this.HttpContext.response.HTML(fs.readFileSync(helpPagePath));
    }
    get() {
        if (this.HttpContext.path.queryString == '?')
            this.help();
        else
            this.startOperation();
    }
}