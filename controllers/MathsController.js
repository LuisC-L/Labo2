import Controller from './Controller.js';
import path from 'path';
import fs from 'fs';

export default class CoursesController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
        this.params = HttpContext.path.params;
    }
    startOperation() {
        const validOperations = [' ','+', '-', '/', '*', '%', '!', 'p', 'np'];
        const XYOperations = [' ','+', '-', '/', '*', '%'];
        const NOperation = ['!', 'p', 'np'];
        let result;
        let isInteger = Number.isInteger(parseFloat(this.params.n));
        if (!validOperations.includes(this.params.op)) {
                this.params.error = 'There is a error with the operation parameter';
        } else {
            if (XYOperations.includes(this.params.op)) {
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
                        result = this.mod(x,y);
                    }
                
            }
            else if(isInteger && NOperation.includes(this.params.op)){
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
    isPrimer(n) {
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

 
    factorial(n) {
        if (n === 0 || n === 1) {
            return 1;
        } else {
            return n * factorial(n - 1);
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