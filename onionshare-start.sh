#!/bin/bash

# Script para preparar e rodar o RHCSA Trainer via OnionShare
# Este script garante que a aplicação seja compilada e servida pelo Node.js

echo "--- Preparando RHCSA Trainer para OnionShare ---"

# 1. Instalar dependências (apenas se necessário)
if [ ! -d "node_modules" ]; then
    echo "[1/3] Instalando dependências (pnpm)..."
    pnpm install
fi

# 2. Gerar o Build de Produção
echo "[2/3] Gerando build de produção (Vite + Server)..."
pnpm run build

# 3. Iniciar o Servidor na porta 3000
echo "[3/3] Iniciando servidor na porta 3000..."
echo ""
echo "============================================================"
echo " IMPORTANTE PARA O ONIONSHARE:"
echo " 1. No OnionShare, escolha a aba 'Host a Website'."
echo " 2. NÃO arraste a pasta do projeto para lá."
echo " 3. Clique em 'Settings' (ícone de engrenagem) ou procure a opção"
echo "    'Use a custom port' / 'Proxy to a local web server'."
echo " 4. Digite a porta: 3000"
echo " 5. Clique em 'Start sharing'."
echo "============================================================"
echo ""

NODE_ENV=production pnpm run start
