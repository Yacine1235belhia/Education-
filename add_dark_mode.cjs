const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      if (fs.statSync(dirFile).isDirectory()) {
         walkSync(dirFile, filelist);
      } else {
         filelist.push(dirFile);
      }
    } catch (err) {}
  });
  return filelist;
}

const files = walkSync('./src');
const tsxFiles = files.filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

// Also do index.css for the base body
const cssFiles = files.filter(f => f.endsWith('.css'));

const replaceMap = {
  // backgrounds
  'bg-white(?!/| )': 'bg-white dark:bg-slate-900', // only replace EXACT bg-white
  'bg-white/': 'bg-white/', // ignore transparent whites
  'bg-slate-50': 'bg-slate-50 dark:bg-slate-800',
  'bg-slate-100': 'bg-slate-100 dark:bg-slate-800',
  'bg-slate-900': 'bg-slate-900 dark:bg-slate-950',
  
  // texts
  'text-slate-900': 'text-slate-900 dark:text-white',
  'text-slate-800': 'text-slate-800 dark:text-slate-100',
  'text-slate-700': 'text-slate-700 dark:text-slate-200',
  'text-slate-600': 'text-slate-600 dark:text-slate-300',
  'text-slate-500': 'text-slate-500 dark:text-slate-400',
  'text-slate-400': 'text-slate-400 dark:text-slate-500',
  
  // borders
  'border-slate-100': 'border-slate-100 dark:border-slate-800/50',
  'border-slate-200': 'border-slate-200 dark:border-slate-800',
};

// Custom replacer without breaking existing dark: classes or matching subsets like bg-white/50
tsxFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Fix exact match of bg-white not followed by / or alpha
  content = content.replace(/\bbg-white\b(?!\/)/g, 'bg-white dark:bg-slate-900');
  
  content = content.replace(/\bbg-slate-50\b(?!\/)/g, 'bg-slate-50 dark:bg-slate-800/50');
  content = content.replace(/\bbg-slate-100\b(?!\/)/g, 'bg-slate-100 dark:bg-slate-800');
  
  content = content.replace(/\btext-slate-900\b(?!\/)/g, 'text-slate-900 dark:text-white');
  content = content.replace(/\btext-slate-800\b(?!\/)/g, 'text-slate-800 dark:text-slate-100');
  content = content.replace(/\btext-slate-700\b(?!\/)/g, 'text-slate-700 dark:text-slate-200');
  content = content.replace(/\btext-slate-600\b(?!\/)/g, 'text-slate-600 dark:text-slate-300');
  content = content.replace(/\btext-slate-500\b(?!\/)/g, 'text-slate-500 dark:text-slate-400');
  
  content = content.replace(/\bborder-slate-100\b(?!\/)/g, 'border-slate-100 dark:border-slate-800');
  content = content.replace(/\bborder-slate-200\b(?!\/)/g, 'border-slate-200 dark:border-slate-700');

  // Clean up any double dark inserts
  content = content.replace(/dark:bg-slate-900 dark:bg-slate-900/g, 'dark:bg-slate-900');
  
  fs.writeFileSync(file, content);
});

console.log('Processed tsx files');
