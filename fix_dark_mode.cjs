const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
       walkSync(dirFile, filelist);
    } else {
       filelist.push(dirFile);
    }
  });
  return filelist;
}

const files = walkSync('./src');
const tsxFiles = files.filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

tsxFiles.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');

  // Background and borders
  c = c.replace(/dark:bg-slate-950/g, 'dark:bg-black');
  c = c.replace(/dark:bg-slate-900/g, 'dark:bg-[#050505]');
  c = c.replace(/dark:bg-slate-800\/50/g, 'dark:bg-[#111111]');
  c = c.replace(/dark:bg-slate-800/g, 'dark:bg-[#1a1a1a]');
  c = c.replace(/dark:bg-slate-700\/80/g, 'dark:bg-[#222222]');
  c = c.replace(/dark:bg-slate-700/g, 'dark:bg-[#222222]');
  c = c.replace(/dark:border-slate-800\/50/g, 'dark:border-[#262626]');
  c = c.replace(/dark:border-slate-800/g, 'dark:border-[#262626]');
  c = c.replace(/dark:border-slate-700/g, 'dark:border-[#404040]');

  // Colors
  c = c.replace(/dark:text-slate-400/g, 'dark:text-[#a3a3a3]');
  c = c.replace(/dark:text-slate-300/g, 'dark:text-[#d4d4d4]');
  c = c.replace(/dark:text-slate-200/g, 'dark:text-[#e5e5e5]');
  c = c.replace(/dark:text-slate-100/g, 'dark:text-white');

  fs.writeFileSync(file, c);
});

console.log('Done');
