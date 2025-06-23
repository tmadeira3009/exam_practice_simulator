#!/bin/bash
# Execute como root: sudo bash setup_rhcsa_simulator.sh
# Compatível com RHEL 9, Oracle Linux 9, CentOS Stream 9

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
STATIC_DIR="$SIMULATOR_DIR/static"
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
    if [[ "$ID" == "rhel" || "$ID" == "ol" || "$ID" == "centos" ]]; then
        dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
        check_error "Falha ao instalar repositório EPEL."
        dnf config-manager --enable epel
        if [[ "$ID" == "ol" ]]; then
            dnf config-manager --enable ol9_baseos_latest ol9_appstream
            check_error "Falha ao configurar repositórios Oracle Linux."
        elif [[ "$ID" == "centos" ]]; then
            dnf config-manager --enable baseos appstream
            check_error "Falha ao configurar repositórios CentOS Stream."
        fi
        if [[ "$ID" == "rhel" ]]; then
            dnf config-manager --enable rhel-9-for-x86_64-baseos-rpms rhel-9-for-x86_64-appstream-rpms
            check_error "Falha ao configurar repositórios RHEL."
        fi
    else
        log "Erro: Sistema operacional não suportado. Requer RHEL 9, Oracle Linux 9 ou CentOS Stream 9."
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
    texlive-babel \
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
if [[ -d "$VENV_DIR" ]]; then
    log "Ambiente virtual encontrado em $VENV_DIR. Verificando integridade..."
    if [[ ! -f "$VENV_DIR/bin/activate" ]]; then
        log "Arquivo activate não encontrado. Recriando venv..."
        rm -rf "$VENV_DIR"
        su - "$LAB_USER" -c "$PYTHON_VERSION -m venv $VENV_DIR"
        check_error "Falha ao recriar ambiente virtual."
    fi
else
    log "Criando novo ambiente virtual em $VENV_DIR..."
    su - "$LAB_USER" -c "$PYTHON_VERSION -m venv $VENV_DIR"
    check_error "Falha ao criar ambiente virtual."
fi
if [[ ! -f "$VENV_DIR/bin/activate" ]]; then
    log "Erro: Arquivo $VENV_DIR/bin/activate não foi criado."
    exit 1
fi
su - "$LAB_USER" -c "source $VENV_DIR/bin/activate && pip install --upgrade pip"
check_error "Falha ao atualizar pip."
su - "$LAB_USER" -c "source $VENV_DIR/bin/activate && pip install flask"
check_error "Falha ao instalar Flask."
su - "$LAB_USER" -c "source $VENV_DIR/bin/activate && python3 -c 'import flask; print(flask.__version__)'" >> "$LOG_FILE"
check_error "Falha ao verificar instalação do Flask."

# Passo 5: Copiar arquivos do simulador
log "Copiando arquivos do simulador de $SOURCE_DIR..."
if [[ -d "$SIMULATOR_DIR" ]]; then
    log "Diretório $SIMULATOR_DIR já existe. Atualizando arquivos..."
    rm -rf "$SIMULATOR_DIR/templates" "$SIMULATOR_DIR/static"
    mkdir -p "$SIMULATOR_DIR/templates" "$SIMULATOR_DIR/static"
else
    mkdir -p "$SIMULATOR_DIR/templates" "$SIMULATOR_DIR/static"
    check_error "Falha ao criar diretório $SIMULATOR_DIR."
fi
if [[ ! -f "$SOURCE_DIR/rhcsa_simulator.py" || ! -d "$SOURCE_DIR/templates" ]]; then
    log "Erro: Arquivos necessários não encontrados em $SOURCE_DIR."
    exit 1
fi
cp "$SOURCE_DIR/rhcsa_simulator.py" "$SIMULATOR_DIR/"
cp -r "$SOURCE_DIR/templates/"* "$SIMULATOR_DIR/templates/"
# Criar favicon.ico a partir de base64
echo "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABrElEQVQ4jZ2Sv4tUQRSGv7t3Z2Y3M7swCwtLgyAWDQULC2tB1ipYpX/AArGwsLHSR+wshJ1E8F/QWdjZ2FiKhYWFhYWFWFiwENF3uXun2Zm9M7Mzs7P3zT3n3j2S1iRJksQ0TWPj9z6Cvo+iKL0ALpfL4XIZ5XI5rV6vUygUSnEcB7/f3yqVylX6/f4dHR0Vut3u+vr6Y7PZpFarORwO+9PT0z9IkoT3+33U63Uul8v5MpkM0zR/3W73yWazF4FA4MvlcplOp+PxuB6PB4FA4Onp6fL5fKZpWnA8HrPZbL7f7ySTySiXy1EUhVwuF9/3+0kkEkm73eZ4PE6lUimVSi2Xy7lcLpfL9Xq9eTwewzRN0zRNs9lsUqlU7Ha7+/v7k0qlXC6X2+3u7u6uVqsRCoXUarXU7Xa3Wq2WSqU0TfP5fL5cLh8fH7/f7+/v7y6Xyw1CIVKpVK/X6yqVSoFAIPM8z7PZrE3TdO7v7/8vl8sXgiB8f6/X6+/3+/3+A3+/3w8+//Eg9gAAAABJRU5ErkJggg==" | base64 -d > "$STATIC_DIR/favicon.ico"
check_error "Falha ao criar favicon.ico."
if [[ ! -f "$STATIC_DIR/favicon.ico" || ! -s "$STATIC_DIR/favicon.ico" ]]; then
    log "Erro: favicon.ico não foi criado corretamente ou está vazio."
    exit 1
fi
chown -R "$LAB_USER:$LAB_USER" "$SIMULATOR_DIR"
chmod -R u+rw "$SIMULATOR_DIR"
check_error "Falha ao ajustar permissões."

# Passo 5.5: Corrigir rhcsa_simulator.py
log "Corrigindo rhcsa_simulator.py para garantir estrutura correta de results..."
if ! grep -q "from flask import.*send_from_directory" "$SIMULATOR_DIR/rhcsa_simulator.py"; then
    sed -i "s/from flask import Flask/from flask import Flask, send_from_directory/" "$SIMULATOR_DIR/rhcsa_simulator.py"
    check_error "Falha ao atualizar importações no rhcsa_simulator.py."
fi
if ! grep -q "import os" "$SIMULATOR_DIR/rhcsa_simulator.py"; then
    sed -i "2i import os" "$SIMULATOR_DIR/rhcsa_simulator.py"
    check_error "Falha ao adicionar import os."
fi
if ! grep -q "@app.route('/favicon.ico')" "$SIMULATOR_DIR/rhcsa_simulator.py"; then
    cat >> "$SIMULATOR_DIR/rhcsa_simulator.py" << EOF

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico')
EOF
    check_error "Falha ao adicionar rota favicon.ico."
fi
if ! grep -q "SESSION_COOKIE_SAMESITE" "$SIMULATOR_DIR/rhcsa_simulator.py"; then
    sed -i "/app.secret_key = 'rhcsa_simulator_key'/a app.config['SESSION_COOKIE_SAMESITE'] = 'None'\napp.config['SESSION_COOKIE_SECURE'] = True" "$SIMULATOR_DIR/rhcsa_simulator.py"
    check_error "Falha ao configurar SameSite cookie."
fi
if ! grep -q "for question in questions:" "$SIMULATOR_DIR/rhcsa_simulator.py"; then
    # Criar arquivo temporário com o trecho a ser inserido
    cat > /tmp/finish_patch.txt << EOF
        # Garantir que results tenha todas as chaves esperadas
        for question in questions:
            qid = str(question["id"])
            if qid not in results:
                results[qid] = {"result": "Não verificado.", "success": False}
EOF
    # Inserir após a linha de results
    sed -i "/results = session.get('results', {})/r /tmp/finish_patch.txt" "$SIMULATOR_DIR/rhcsa_simulator.py"
    check_error "Falha ao corrigir função finish no rhcsa_simulator.py."
    rm -f /tmp/finish_patch.txt
fi
# Verificar sintaxe do Python
su - "$LAB_USER" -c "source $VENV_DIR/bin/activate && python3 -m py_compile $SIMULATOR_DIR/rhcsa_simulator.py"
check_error "Erro de sintaxe no rhcsa_simulator.py após modificações."

# Passo 5.6: Corrigir templates HTML
log "Corrigindo templates HTML..."
for template in "$SIMULATOR_DIR/templates/"*.html; do
    if [[ -f "$template" ]]; then
        if ! grep -q "<!DOCTYPE html>" "$template"; then
            sed -i '1i <!DOCTYPE html>' "$template"
            check_error "Falha ao adicionar DOCTYPE em $template."
        fi
    fi
done
if [[ -f "$SIMULATOR_DIR/templates/result.html" ]]; then
    # Substituir acesso direto por acesso seguro com get
    sed -i 's/results\[question.id\]\[\(["a-z]*"\)\]/results.get(question.id, {"\1": False})["\1"]/g' "$SIMULATOR_DIR/templates/result.html"
    check_error "Falha ao corrigir acesso a success em result.html."
    # Corrigir classe condicional
    sed -i 's/<td class="{% if results\[question.id\]\[\(["a-z]*"\)\] %}\([^%]*\){% else %}\([^%]*\){% endif %}">/<td class="{% if results.get(question.id, {"\1": False})["\1"] %}\2{% else %}\3{% endif %}">/g' "$SIMULATOR_DIR/templates/result.html"
    check_error "Falha ao corrigir classe condicional em result.html."
    # Remover uso de |string
    sed -i 's/results.get(question.id|string,/results.get(question.id,/g' "$SIMULATOR_DIR/templates/result.html"
    check_error "Falha ao remover filtro string em result.html."
else
    log "Erro: result.html não encontrado em $SIMULATOR_DIR/templates."
    exit 1
fi

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
else
    semanage port -m -t http_port_t -p tcp 5000
    check_error "Falha ao atualizar porta 5000 no SELinux."
fi

# Passo 7.5: Adicionar sudoers para o usuário labuser
log "Configurando sudoers para $LAB_USER..."
echo "$LAB_USER ALL=(ALL) NOPASSWD:ALL" > "/etc/sudoers.d/$LAB_USER"
check_error "Falha ao configurar sudoers."
chmod 440 "/etc/sudoers.d/$LAB_USER"
check_error "Falha ao ajustar permissões do sudoers."

# Passo 8: Criar script de inicialização para o simulador
log "Criando script de inicialização..."
cat > "$SIMULATOR_DIR/start_simulator.sh" << EOF
#!/bin/bash
if [[ ! -f "$VENV_DIR/bin/activate" ]]; then
    echo "Erro: Ambiente virtual não encontrado em $VENV_DIR."
    exit 1
fi
source $VENV_DIR/bin/activate
cd $SIMULATOR_DIR
$PYTHON_VERSION rhcsa_simulator.py
EOF
chmod +x "$SIMULATOR_DIR/start_simulator.sh"
chown "$LAB_USER:$LAB_USER" "$SIMULATOR_DIR/start_simulator.sh"
check_error "Falha ao criar script de inicialização."

# Passo 9: Iniciar o simulador
log "Iniciando o simulador..."
su - "$LAB_USER" -c "bash $SIMULATOR_DIR/start_simulator.sh > $SIMULATOR_DIR/simulator.log 2>&1 &"
check_error "Falha ao iniciar o simulador."
sleep 5
if lsof -i:5000 &>/dev/null; then
    log "Simulador iniciado na porta 5000."
else
    log "Erro: Simulador não iniciou corretamente. Verifique $LOG_FILE e $SIMULATOR_DIR/simulator.log."
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
   Exemplo: http://10.0.2.15:5000?user=aluno1&lang=pt

2. Faça login no servidor para configurar as questões:
   Usuário: $LAB_USER
   Senha: labpassword
   Comando: ssh $LAB_USER@$(hostname -I | awk '{print $1}')

3. Para reiniciar o simulador:
   Como $LAB_USER, execute:
     $SIMULATOR_DIR/start_simulator.sh

4. Logs de configuração:
   $LOG_FILE
   Logs do servidor:
   $SIMULATOR_DIR/simulator.log

5. Para compartilhar:
   - Copie o diretório $SOURCE_DIR.
   - Execute este script em um servidor RHEL 9, Oracle Linux 9 ou CentOS Stream 9.
   - Forneça a URL e credenciais.

6. Para parar o simulador:
   kill -9 \$(lsof -t -i:5000)

============================================================

EOF
log "Script finalizado. Simulador pronto para uso!"
