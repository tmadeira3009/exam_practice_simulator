#!/bin/bash

# Script para configurar um servidor do zero para rodar o simulador RHCSA
# Autor: Grok (xAI)
# Data: 23/06/2025
# Execute como root: sudo bash setup_rhcsa_simulator.sh

# Verificar se o script está sendo executado como root
if [[ $EUID -ne 0 ]]; then
    echo "Erro: Este script deve ser executado como root (use sudo)."
    exit 1
fi

# Definir variáveis
LAB_USER="labuser"
LAB_HOME="/home/$LAB_USER"
SIMULATOR_DIR="$LAB_HOME/rhcsa_simulator"
VENV_DIR="$SIMULATOR_DIR/venv"
SOURCE_DIR="/root/exam_practice_simulator"
PYTHON_VERSION="python3.9"
LOG_FILE="/tmp/rhcsa_setup.log"

# Função para registrar logs
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Função para verificar erros
check_error() {
    if [[ $? -ne 0 ]]; then
        log "Erro: $1"
        exit 1
    fi
}

log "Iniciando configuração do servidor para o simulador RHCSA..."

# Passo 1: Configurar repositórios
log "Configurando repositórios..."
if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    if [[ "$ID" == "rhel" || "$ID" == "ol" ]]; then
        dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
        check_error "Falha ao instalar repositório EPEL."
        dnf config-manager --enable epel
        if [[ "$ID" == "ol" ]]; then
            dnf config-manager --enable ol9_baseos_latest ol9_appstream
            check_error "Falha ao habilitar repositórios Oracle Linux."
        fi
    else
        log "Erro: Sistema operacional não suportado. Requer RHEL 9 ou Oracle Linux 9."
        exit 1
    fi
else
    log "Erro: Não foi possível identificar o sistema operacional."
    exit 1
fi

# Passo 2: Instalar pacotes necessários
log "Instalando pacotes do sistema..."
dnf update -y
check_error "Falha ao atualizar o sistema."
dnf install -y \
    git \
    $PYTHON_VERSION \
    python3-pip \
    httpd \
    podman \
    chrony \
    tuned \
    firewalld \
    selinux-policy-devel \
    texlive \
    texlive-latex \
    texlive-fancyhdr \
    texlive-booktabs \
    texlive-geometry \
    lvm2 \
    NetworkManager \
    openssh-server \
    parted \
    util-linux
check_error "Falha ao instalar pacotes."

# Passo 3: Criar usuário para o laboratório
log "Criando usuário $LAB_USER..."
if id "$LAB_USER" &>/dev/null; then
    log "Usuário $LAB_USER já existe."
else
    useradd -m -s /bin/bash "$LAB_USER"
    check_error "Falha ao criar usuário $LAB_USER."
    echo "$LAB_USER:labpassword" | chpasswd
    check_error "Falha ao definir senha para $LAB_USER."
    log "Usuário $LAB_USER criado com senha 'labpassword'."
fi

# Passo 4: Configurar ambiente virtual e Flask
log "Configurando ambiente Python..."
if [[ ! -d "$VENV_DIR" ]]; then
    su - "$LAB_USER" -c "$PYTHON_VERSION -m venv $VENV_DIR"
    check_error "Falha ao criar ambiente virtual."
fi
su - "$LAB_USER" -c "source $VENV_DIR/bin/activate && pip install --upgrade pip"
check_error "Falha ao atualizar pip."
su - "$LAB_USER" -c "source $VENV_DIR/bin/activate && pip install flask"
check_error "Falha ao instalar Flask."

# Passo 5: Copiar arquivos do simulador
log "Copiando arquivos do simulador de $SOURCE_DIR..."
if [[ -d "$SIMULATOR_DIR" ]]; then
    log "Diretório $SIMULATOR_DIR já existe. Removendo..."
    rm -rf "$SIMULATOR_DIR"
fi
mkdir -p "$SIMULATOR_DIR/templates"
cp "$SOURCE_DIR/rhcsa_simulator.py" "$SIMULATOR_DIR/"
cp -r "$SOURCE_DIR/templates/"* "$SIMULATOR_DIR/templates/"
check_error "Falha ao copiar arquivos do simulador."

# Ajustar permissões
chown -R "$LAB_USER:$LAB_USER" "$SIMULATOR_DIR"
chmod -R u+rw "$SIMULATOR_DIR"
check_error "Falha ao ajustar permissões."

# Passo 6: Configurar firewall
log "Configurando firewall..."
systemctl enable --now firewalld
check_error "Falha ao iniciar firewalld."
firewall-cmd --permanent --add-port=5000/tcp
check_error "Falha ao abrir porta 5000."
firewall-cmd --reload
check_error "Falha ao recarregar firewall."

# Passo 7: Configurar SELinux
log "Configurando SELinux..."
setsebool -P httpd_can_network_connect 1
check_error "Falha ao configurar SELinux para httpd."
if ! semanage port -l | grep -q "http_port_t.*5000"; then
    semanage port -a -t http_port_t -p tcp 5000
    check_error "Falha ao adicionar porta 5000 ao SELinux."
fi

# Passo 8: Criar script de inicialização para o simulador
log "Criando script de inicialização..."
cat > "$SIMULATOR_DIR/start_simulator.sh" << EOF
#!/bin/bash
source $VENV_DIR/bin/activate
cd $SIMULATOR_DIR
$PYTHON_VERSION rhcsa_simulator.py
EOF
chmod +x "$SIMULATOR_DIR/start_simulator.sh"
chown "$LAB_USER:$LAB_USER" "$SIMULATOR_DIR/start_simulator.sh"
check_error "Falha ao criar script de inicialização."

# Passo 9: Iniciar o simulador
log "Iniciando o simulador..."
su - "$LAB_USER" -c "$SIMULATOR_DIR/start_simulator.sh &"
check_error "Falha ao iniciar o simulador."
sleep 5
if lsof -i:5000 &>/dev/null; then
    log "Simulador iniciado na porta 5000."
else
    log "Erro: Simulador não iniciou corretamente. Verifique $LOG_FILE."
    exit 1
fi

# Passo 10: Exibir instruções para outros usuários
log "Configuração concluída!"
cat << EOF

============================================================
         Instruções para Usar o Simulador RHCSA
============================================================

1. Acesse o simulador no navegador:
   URL: http://$(hostname -I | awk '{print $1}'):5000?user=NOME_DO_USUARIO&lang=pt
   Exemplo: http://192.168.1.100:5000?user=aluno1&lang=pt

2. Faça login no servidor para configurar as questões:
   Usuário: $LAB_USER
   Senha: labpassword
   Comando: ssh $LAB_USER@$(hostname -I | awk '{print $1}')

3. Para reiniciar o simulador (se necessário):
   Como $LAB_USER, execute:
   $SIMULATOR_DIR/start_simulator.sh

4. Logs de configuração estão em:
   $LOG_FILE

5. Para compartilhar com outros:
   - Copie o diretório $SOURCE_DIR.
   - Execute este script em um servidor RHEL 9 ou Oracle Linux 9 com acesso root.
   - Forneça a URL e as credenciais acima.

6. Para parar o simulador:
   Como root, execute:
   kill -9 \$(lsof -t -i:5000)

============================================================

EOF

log "Script finalizado. Simulador pronto para uso!"
