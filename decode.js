import fs from 'fs';

const path = process.argv[2]
var text = fs.readFileSync(path, 'utf-8');
var [a,c] = [[],[]]

text.split('\n').forEach(line=>{if(line.includes("(AA)") || line.includes("(AAAA)")) a.push(line.split('.')[0].slice(1,))})
var b = [...new Set(a)]
b.forEach((value, index)=>c.push(value.slice(index.toString().length,)))
const output = Buffer.from(c.join(''), 'base64').toString('utf-8');

console.log(output)
