import fs  from 'fs';
import util from 'util';
var log_file = fs.createWriteStream('/server.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};