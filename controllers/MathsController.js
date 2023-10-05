import Controller from './Controller.js';
import path from 'path';
import fs from 'fs';

export default class CoursesController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
        this.params = HttpContext.path.params;
    }
    startOperation() {
        let result;
        let x = parseFloat(this.params.x);
        let y = parseFloat(this.params.y);
        let n = parseInt(this.params.n);
        let isInt = Number.isInteger(this.params.n);
        if (this.params.op == ' ') {
            this.params.op = '+';
            result = this.sum(x, y);
        } else if (this.params.op == '-') {
            result = this.sub(x, y);
        } else if (this.params.op == '/') {
            result = this.div(x, y);
        } else if (this.params.op == '*') {
            result = this.multi(x, y);
        } else if (this.params.op == '%') {
            result = this.mod(x, y);
        } else if (isInt) {
            if (this.params.op == '!') {
                this.fact(n);
            } else if (this.params.op == 'n') {
                this.isPrime(n);
            } else if (this.params.op == 'np') {
                this.findPrime(n);
            }
        } else {
            let isString = value => typeof value === 'string';
            if (!isInt) {
                this.params.error = "Not integer";
            } else if (this.params.op == null || x == null || y == null || n == null) {
                this.params.error = "Not enough parameters";
            } else if (isString(x) || isNaN(x) || isString(y) || isNaN(y) || isString(n) || isNaN(n)) {
                this.params.error = "A parameter is not a number";
            }
        }
        this.params.value = result;
        this.HttpContext.response.end(JSON.stringify(this.params));
        // this.HttpContext.response.JSON({ op:JSON.stringify(this.params.op), x, y, value: result });
    }
    sum(x, y) {
        return x + y;
    }
    sub(x, y) {
        return x - y;
    }
    div(x, y) {
        return x / y;
    }
    multi(x, y) {
        return x * y;
    }
    mod(x, y) {
        return x % y;
    }
    fact(n) {
        if (n === 0 || n === 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }
    isPrime(n) {
        for (var i = 2; i < value; i++) {
            if (value % i === 0) {
                return false;
            }
        }
        return value > 1;
    }
    findPrime(n) {
        let primeNumer = 0;
        for (let i = 0; i < n; i++) {
            primeNumer++;
            while (!isPrime(primeNumer)) {
                primeNumer++;
            }
        }
        return primeNumer;
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