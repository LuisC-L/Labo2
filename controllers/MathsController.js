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
        if (this.params.op == ' ') {
            this.params.op = '+';
            result = this.sum(this.params.x, this.params.y)
        } else if (this.params.op == '-') {
            result = this.sub(this.params.x, this.params.y)
        } else if (this.params.op == '/') {
            result = this.div(this.params.x, this.params.y)
        } else if (this.params.op == '*') {
            result = this.multi(this.params.x, this.params.y)
        }
            
        const responseObj = {
            op: this.params.op,
            x: this.params.x,
            y: this.params.y,
            n: this.params.n,
            value: result
        };
        this.HttpContext.response.end(JSON.stringify(responseObj));
    }
    //! == factoriel?
    //p == premier?
    //np == nieme premier?
    sum(x, y) {
        return Number(x) + Number(y);
    }
    sub(x, y) {
        return Number(x) - Number(y);
    }
    div(x,y) {
        return Number(x) / Number(y);
    }
    multi(x,y){
        return Number(x) * Number(y);
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