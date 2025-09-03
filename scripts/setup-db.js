#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Configurando banco de dados...');

try {
  // Verificar se estamos no diretório correto
  const projectRoot = path.resolve(__dirname, '..');
  process.chdir(projectRoot);
  
  console.log('📊 Gerando migrations...');
  execSync('npm run db:generate', { stdio: 'inherit' });
  
  console.log('🔄 Aplicando migrations...');
  execSync('npm run db:migrate', { stdio: 'inherit' });
  
  console.log('✅ Banco de dados configurado com sucesso!');
} catch (error) {
  console.error('❌ Erro ao configurar banco de dados:', error.message);
  process.exit(1);
}
