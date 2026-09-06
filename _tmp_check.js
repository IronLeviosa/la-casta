const fs = require('fs');
const { parse } = require('yaml');
const doc = parse(fs.readFileSync('inbox/reparaciones/nivel-evidencia-2026-09-06/declaraciones.yaml', 'utf8'));
const rec = doc.find(r => r._slug === 'orsi/2026-05-30-expreso-confianza-organismos-contralor-uruguayos-corte');
const cita = rec.evidencia.fuentes[1].cita;
console.log('YAML cita:', JSON.stringify(cita));

const html = fs.readFileSync('C:/Users/sdsmo/AppData/Local/Temp/claude/C--Users-sdsmo/01e6b195-cc53-461d-afa2-a1a4200f4a05/scratchpad/lar.html', 'utf8');
console.log('literal match in raw html:', html.includes(cita));

const menciones = parse(fs.readFileSync('inbox/reparaciones/nivel-evidencia-2026-09-06/menciones.yaml', 'utf8'));
const mcita = menciones[0].evidencia.fuentes[1].cita;
console.log('YAML mencion cita:', JSON.stringify(mcita));
console.log('literal match in raw html:', html.includes(mcita));
