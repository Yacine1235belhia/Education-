import { csvService } from './csvService.ts';
import fs from 'fs';
import Papa from 'papaparse';

const csvContent = fs.readFileSync('src/test.csv', 'utf8');
const file = new File([csvContent], 'test.csv');
csvService.parseMassarCsv(file as any).then(console.log).catch(console.error);
