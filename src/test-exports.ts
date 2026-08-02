import fs from 'fs';
import path from 'path';

console.log('\n=========================================');
console.log('🔍 DIAGNÓSTICO: REVISIÓN DE DOCKERFILE EN DISCO');
console.log('=========================================');

try {
  const dockerfilePath = path.resolve('Dockerfile');
  if (fs.existsSync(dockerfilePath)) {
    console.log('📄 CONTENIDO ACTUAL DEL DOCKERFILE:');
    console.log('-----------------------------------------');
    console.log(fs.readFileSync(dockerfilePath, 'utf8'));
    console.log('-----------------------------------------');
  } else {
    console.log('❌ El archivo Dockerfile no existe en el directorio de trabajo!');
  }
} catch (e: any) {
  console.log('❌ Error al leer Dockerfile:', e.message);
}

console.log('=========================================\n');
