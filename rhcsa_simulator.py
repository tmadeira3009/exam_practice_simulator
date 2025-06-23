from flask import Flask, render_template, request, jsonify, session, redirect, url_for, send_file
import subprocess
import random
import os
from collections import defaultdict
from datetime import datetime
import tempfile

app = Flask(__name__, template_folder='templates')
app.secret_key = 'rhcsa_simulator_key'  # Configurações
SUBNETS = list(range(1, 51))
PORTS = [82, 8080, 8888]
USERS = ["natasha", "harry", "sarah", "bob", "alice", "fred"]
GROUPS = ["sysadm", "sharegrp", "admin", "devops"]
FILESYSTEMS = ["ext4", "xfs", "vfat"]
PASSWORDS = ["trootent", "redhat2025", "ablerate", "password"]
CRON_SCHEDULES = [
    {"type": "daily", "hour": 14, "minute": 23, "desc_en": "daily at 14:23", "desc_pt": "diário às 14:23", "command": '/usr/bin/echo "welcome"'},
    {"type": "every_n_minutes", "n": 2, "desc_en": "every 2 minutes", "desc_pt": "a cada 2 minutos", "command": '/bin/bash'},
    {"type": "daily", "hour": 10, "minute": 0, "desc_en": "daily at 10:00", "desc_pt": "diário às 10:00", "command": '/bin/echo "Test"'}
]
MOUNT_POINTS = ["/mnt/wshare", "/mnt/engine", "/mnt/database"]
REPO_URLS = [
    "http://content.example.com/rhel9.0/x86_64/dvd/BaseOS",
    "http://content.example.com/rhel9.0/x86_64/dvd/AppStream"
]
DISKS = ["/dev/vdb", "/dev/sdb"]
SIZES = [512, 1024, 2048]
UIDS = [2001, 3000, 4000]
PROFILES = ["virtual-guest", "balanced"]
CONTAINER_URLS = ["docker://nginx", "docker://apache"]
CONTAINER_NAMES = ["myapp", "webapp", "sql"]
STRINGS = ["root", "nobody", "bash"]
PATHS = ["/home", "/usr", "/var"]
FILES = ["/etc/passwd", "/usr/share/dict/words"]
DESTINATIONS = ["/tmp/result.txt", "/mnt/output.txt"]

# Categorias de questões
CATEGORIES = {
    "Network": [3, 4, 24],
    "Users": [2, 6, 8, 16],
    "Storage": [9, 10, 11, 12, 13],
    "Security": [1, 5, 14, 15, 17, 18, 19, 23],
    "Automation": [7, 20],
    "Containers": [21, 22]
}

# Banco de questões completo
QUESTIONS = [
    {
        "id": 1,
        "category": "Security",
        "en": "Reset root user password and set it to '{password}'.",
        "pt": "Redefinir a senha do usuário root e defini-la como '{password}'.",
        "params": {"password": random.choice(PASSWORDS)},
        "verify": lambda params: ("Cannot verify password directly. Confirm manually.", False)
    },
    {
        "id": 2,
        "category": "Users",
        "en": "Create account '{user}' and add to wheel group. Verify wheel group is enabled in /etc/sudoers.",
        "pt": "Criar conta '{user}' e adicionar ao grupo wheel. Verificar se o grupo wheel está habilitado em /etc/sudoers.",
        "params": {"user": "thiago-madeira"},
        "verify": lambda params: verify_user_wheel(params["user"])
    },
    {
        "id": 3,
        "category": "Network",
        "en": "Configure TCP/IP and hostname: IP=172.25.{subnet}.11, Netmask=255.255.255.0, Gateway=172.25.{subnet}.254, DNS=172.25.254.254, Hostname=server{subnet}.example.com.",
        "pt": "Configurar TCP/IP e hostname: IP=172.25.{subnet}.11, Máscara=255.255.255.0, Gateway=172.25.{subnet}.254, DNS=172.25.254.254, Hostname=server{subnet}.example.com.",
        "params": {"subnet": random.choice(SUBNETS)},
        "verify": lambda params: verify_network_hostname(params["subnet"])
    },
    {
        "id": 4,
        "category": "Network",
        "en": "Configure system to synchronize time from classroom.example.com.",
        "pt": "Configurar o sistema para sincronizar o tempo com classroom.example.com.",
        "params": {},
        "verify": lambda params: verify_ntp()
    },
    {
        "id": 5,
        "category": "Security",
        "en": "Web server on port {port} is not serving content from /var/www/html. Debug, enable at boot, configure firewall and SELinux.",
        "pt": "Servidor web na porta {port} não está servindo conteúdo de /var/www/html. Depurar, habilitar na inicialização, configurar firewall e SELinux.",
        "params": {"port": random.choice(PORTS)},
        "verify": lambda params: verify_web_server(params["port"])
    },
    {
        "id": 6,
        "category": "Users",
        "en": "Create group '{group}', users '{user1}', '{user2}', '{user3}'. '{user1}' and '{user2}' in '{group}', '{user3}' without shell. Password '{password}'. '{user3}' has read-only on /test owned by '{user1}'.",
        "pt": "Criar grupo '{group}', usuários '{user1}', '{user2}', '{user3}'. '{user1}' e '{user2}' em '{group}', '{user3}' sem shell. Senha '{password}'. '{user3}' tem leitura em /test de '{user1}'.",
        "params": {"group": random.choice(GROUPS), "user1": "", "user2": "", "user3": "", "password": random.choice(PASSWORDS)},
        "verify": lambda params: verify_users_groups(params)
    },
    {
        "id": 7,
        "category": "Automation",
        "en": "Configure cron job for '{user}' to run '{command}' at {schedule}.",
        "pt": "Configurar tarefa cron para '{user}' executar '{command}' às {schedule}.",
        "params": {"user": "", "schedule": "", "command": ""},
        "verify": lambda params: verify_cron(params["user"], params["command"])
    },
    {
        "id": 8,
        "category": "Users",
        "en": "Create user '{user}' with UID {uid}, password '{password}'.",
        "pt": "Criar usuário '{user}' com UID {uid}, senha '{password}'.",
        "params": {"user": "", "uid": random.choice(UIDS), "password": random.choice(PASSWORDS)},
        "verify": lambda params: verify_user_uid(params["user"], params["uid"])
    },
    {
        "id": 9,
        "category": "Storage",
        "en": "Configure repository with URLs {url_baseos} and {url_appstream}.",
        "pt": "Configurar repositório com URLs {url_baseos} e {url_appstream}.",
        "params": {"url_baseos": REPO_URLS[0], "url_appstream": REPO_URLS[1]},
        "verify": lambda params: verify_yum_repo()
    },
    {
        "id": 10,
        "category": "Storage",
        "en": "Create tar archive at {dest} containing {src}.",
        "pt": "Criar arquivo tar em {dest} contendo {src}.",
        "params": {"dest": random.choice(DESTINATIONS), "src": random.choice(PATHS)},
        "verify": lambda params: verify_tar(params["dest"])
    },
    {
        "id": 11,
        "category": "Storage",
        "en": "Create swap partition of {size}MB on {disk}.",
        "pt": "Criar partição swap de {size}MB em {disk}.",
        "params": {"size": random.choice(SIZES), "disk": random.choice(DISKS)},
        "verify": lambda params: verify_swap(params["disk"])
    },
    {
        "id": 12,
        "category": "Storage",
        "en": "Create LVM '{lv}' in '{vg}', {size} extents, PE {pe_size}MB, filesystem {fs}, mount at {mount_point}, auto-mount.",
        "pt": "Criar LVM '{lv}' em '{vg}', {size} extents, PE {pe_size}MB, sistema de arquivos {fs}, montar em {mount_point}, automontar.",
        "params": {"lv": "data", "vg": "vgdata", "size": random.choice([50, 100]), "pe_size": 8, "fs": random.choice(FILESYSTEMS), "mount_point": random.choice(MOUNT_POINTS)},
        "verify": lambda params: verify_lvm(params["vg"], params["lv"])
    },
    {
        "id": 13,
        "category": "Storage",
        "en": "Resize LVM '{lv}' in '{vg}' to {size}MB.",
        "pt": "Redimensionar LVM '{lv}' em '{vg}' para {size}MB.",
        "params": {"lv": "data", "vg": "vgdata", "size": random.choice(SIZES)},
        "verify": lambda params: verify_lvm_resize(params["vg"], params["lv"])
    },
    {
        "id": 14,
        "category": "Security",
        "en": "Find all files with SUID bit in {path} and save to {dest}.",
        "pt": "Encontrar todos os arquivos com bit SUID em {path} e salvar em {dest}.",
        "params": {"path": random.choice(PATHS), "dest": random.choice(DESTINATIONS)},
        "verify": lambda params: verify_suid(params["dest"])
    },
    {
        "id": 15,
        "category": "Security",
        "en": "Find all directories with SGID bit in {path} and save to {dest}.",
        "pt": "Encontrar todos os diretórios com bit SGID em {path} e salvar em {dest}.",
        "params": {"path": random.choice(PATHS), "dest": random.choice(DESTINATIONS)},
        "verify": lambda params: verify_sgid(params["dest"])
    },
    {
        "id": 16,
        "category": "Users",
        "en": "Configure password expiration policy for {days} days for user '{user}'.",
        "pt": "Configurar política de expiração de senha para {days} dias para usuário '{user}'.",
        "params": {"days": random.choice([30, 90]), "user": ""},
        "verify": lambda params: verify_passwd_expiry(params["user"])
    },
    {
        "id": 17,
        "category": "Security",
        "en": "Configure autofs to mount home directories from {nfs_server}:{nfs_path}.",
        "pt": "Configurar autofs para montar diretórios de /home em {nfs_server}:{nfs_path}.",
        "params": {"nfs_server": "nfs.example.com", "nfs_path": "/export/home"},
        "verify": lambda params: verify_autofs()
    },
    {
        "id": 18,
        "category": "Security",
        "en": "Configure collaborative directory at {path} for group '{group}' with SGID permissions.",
        "pt": "Configurar diretório colaborativo em {path} para grupo '{group}' com permissões SGID.",
        "params": {"path": "/share", "group": random.choice(GROUPS)},
        "verify": lambda params: verify_collaborative_dir(params["path"])
    },
    {
        "id": 19,
        "category": "Security",
        "en": "Search for string '{string}' in {file} and save to {dest}.",
        "pt": "Buscar string '{string}' em {file} e salvar em {dest}.",
        "params": {"string": random.choice(STRINGS), "file": random.choice(FILES), "dest": random.choice(DESTINATIONS)},
        "verify": lambda params: verify_string_search(params["dest"])
    },
    {
        "id": 20,
        "category": "Automation",
        "en": "Configure tuned profile '{profile}'.",
        "pt": "Configurar perfil tuned '{profile}'.",
        "params": {"profile": random.choice(PROFILES)},
        "verify": lambda params: verify_tuned(params["profile"])
    },
    {
        "id": 21,
        "category": "Containers",
        "en": "Build container image from {url} with name '{image_name}'.",
        "pt": "Construir imagem de container a partir de {url} com nome '{image_name}'.",
        "params": {"url": random.choice(CONTAINER_URLS), "image_name": random.choice(CONTAINER_NAMES)},
        "verify": lambda params: verify_container_image(params["image_name"])
    },
    {
        "id": 22,
        "category": "Containers",
        "en": "Configure container service '{service_name}' with volume at {volume}.",
        "pt": "Configurar serviço de container '{service_name}' com volume em {volume}.",
        "params": {"service_name": random.choice(CONTAINER_NAMES), "volume": random.choice(MOUNT_POINTS)},
        "verify": lambda params: verify_container_service(params["service_name"])
    },
    {
        "id": 23,
        "category": "Security",
        "en": "Reset the root password using single-user mode. Set it to '{password}'. Follow these steps: 1) Reboot and enter GRUB; 2) Edit the boot entry, replace 'ro' with 'rw' and add 'init=/bin/bash'; 3) Boot and run 'passwd' to set the password; 4) Run 'sync' and reboot.",
        "pt": "Redefinir a senha do root usando o modo de usuário único. Defina como '{password}'. Siga estes passos: 1) Reinicie e entre no GRUB; 2) Edite a entrada de boot, substitua 'ro' por 'rw' e adicione 'init=/bin/bash'; 3) Inicie e execute 'passwd' para definir a senha; 4) Execute 'sync' e reinicie.",
        "params": {"password": random.choice(PASSWORDS)},
        "verify": lambda params: ("Cannot verify root password reset directly. Confirm manually.", False)
    },
    {
        "id": 24,
        "category": "Network",
        "en": "Configure the system to allow SSH login as root. Ensure 'PermitRootLogin yes' is set in /etc/ssh/sshd_config and the sshd service is active.",
        "pt": "Configurar o sistema para permitir login SSH como root. Garanta que 'PermitRootLogin yes' esteja definido em /etc/ssh/sshd_config e que o serviço sshd esteja ativo.",
        "params": {},
        "verify": lambda params: verify_ssh_root()
    }
]

# Funções de verificação
def run_command(cmd):
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout, result.stderr, result.returncode
    except Exception as e:
        return "", str(e), 1

def verify_user_wheel(username):
    stdout, stderr, rc = run_command(f"id {username} | grep wheel")
    if rc == 0:
        stdout, stderr, rc = run_command("grep '^%wheel' /etc/sudoers")
        return "User in wheel group and sudoers configured.", rc == 0
    return "User not in wheel group.", False

def verify_network_hostname(subnet):
    stdout, stderr, rc = run_command("nmcli con show | grep enp0s3")
    result = []
    success = True
    if rc == 0:
        result.append("Network connection enp0s3 exists.")
    else:
        result.append("Error: enp0s3 not found.")
        success = False
    stdout, stderr, rc = run_command(f"hostname | grep server{subnet}.example.com")
    if rc == 0:
        result.append("Hostname correct.")
    else:
        result.append("Error: Hostname incorrect.")
        success = False
    return "\n".join(result), success

def verify_ntp():
    stdout, stderr, rc = run_command("grep classroom.example.com /etc/chrony.conf")
    if rc == 0:
        stdout, stderr, rc = run_command("systemctl is-active chronyd")
        return "NTP configured and active.", "active" in stdout
    return "NTP not configured.", False

def verify_web_server(port):
    stdout, stderr, rc = run_command(f"semanage port -l | grep http_port_t.*{port}")
    result = []
    success = True
    if rc == 0:
        result.append("SELinux port configured.")
    else:
        result.append("Error: SELinux port not configured.")
        success = False
    stdout, stderr, rc = run_command(f"firewall-cmd --list-ports | grep {port}/tcp")
    if rc == 0:
        result.append("Firewall port open.")
    else:
        result.append("Error: Firewall port not open.")
        success = False
    stdout, stderr, rc = run_command("systemctl is-active httpd")
    if "active" in stdout:
        result.append("HTTPD active.")
    else:
        result.append("Error: HTTPD not active.")
        success = False
    return "\n".join(result), success

def verify_users_groups(params):
    group, user1, user2, user3 = params["group"], params["user1"], params["user2"], params["user3"]
    result = []
    success = True
    stdout, stderr, rc = run_command(f"getent group {group}")
    if rc == 0:
        result.append(f"Group {group} exists.")
    else:
        result.append(f"Error: Group {group} not found.")
        success = False
    for user in [user1, user2]:
        stdout, stderr, rc = run_command(f"id {user} | grep {group}")
        if rc == 0:
            result.append(f"User {user} in {group}.")
        else:
            result.append(f"Error: User {user} not in {group}.")
        success = False
    stdout, stderr, rc = run_command(f"getent passwd {user3} | grep nologin")
    if rc == 0:
        result.append(f"User {user3} has no shell.")
    else:
        result.append(f"Error: User {user3} has shell.")
        success = False
    stdout, stderr, rc = run_command(f"ls -ld /test | grep {user1}.*{group}.*rwx.*r-x")
    if rc == 0:
        result.append(f"User {user3} has read-only access to /test.")
    else:
        result.append(f"Error: Incorrect permissions on /test for {user3}.")
        success = False
    return "\n".join(result), success

def verify_cron(user, command):
    stdout, stderr, rc = run_command(f"crontab -u {user} -l | grep '{command}'")
    return "Cron job configured.", rc == 0

def verify_user_uid(user, uid):
    stdout, stderr, rc = run_command(f"id {user} | grep uid={uid}")
    return f"User {user} has UID {uid}.", rc == 0

def verify_yum_repo():
    stdout, stderr, rc = run_command("yum repolist | grep BaseOS")
    return "Repository configured.", rc == 0

def verify_tar(dest):
    stdout, stderr, rc = run_command(f"ls {dest}")
    return f"Tar archive {dest} exists.", rc == 0

def verify_swap(disk):
    stdout, stderr, rc = run_command(f"swapon --show | grep {disk}")
    return "Swap configured.", rc == 0

def verify_lvm(vg, lv):
    stdout, stderr, rc = run_command(f"lvdisplay /dev/{vg}/{lv}")
    return "LVM exists.", rc == 0

def verify_lvm_resize(vg, lv):
    stdout, stderr, rc = run_command(f"lvdisplay /dev/{vg}/{lv}")
    return "LVM resized.", rc == 0

def verify_suid(dest):
    stdout, stderr, rc = run_command(f"ls {dest}")
    return f"SUID list saved to {dest}.", rc == 0

def verify_sgid(dest):
    stdout, stderr, rc = run_command(f"ls {dest}")
    return f"SGID list saved to {dest}.", rc == 0

def verify_passwd_expiry(user):
    stdout, stderr, rc = run_command(f"chage -l {user}")
    return "Password expiry configured.", rc == 0

def verify_autofs():
    stdout, stderr, rc = run_command("systemctl is-active autofs")
    return "Autofs active.", "active" in stdout

def verify_collaborative_dir(path):
    stdout, stderr, rc = run_command(f"ls -ld {path} | grep drwxrws")
    return "Collaborative directory configured.", rc == 0

def verify_string_search(dest):
    stdout, stderr, rc = run_command(f"ls {dest}")
    return f"Search results saved to {dest}.", rc == 0

def verify_tuned(profile):
    stdout, stderr, rc = run_command(f"tuned-adm active | grep {profile}")
    return f"Tuned profile {profile} active.", rc == 0

def verify_container_image(image_name):
    stdout, stderr, rc = run_command(f"podman images | grep {image_name}")
    return f"Container image {image_name} exists.", rc == 0

def verify_container_service(service_name):
    stdout, stderr, rc = run_command(f"systemctl is-active podman-{service_name}")
    return f"Container service {service_name} active.", rc == 0

def verify_root_password_reset(params):
    return "Cannot verify root password reset directly. Confirm manually.", False

def verify_ssh_root():
    stdout, stderr, rc = run_command("grep '^PermitRootLogin yes' /etc/ssh/sshd_config")
    if rc == 0:
        stdout, stderr, rc = run_command("systemctl is-active sshd")
        if rc == 0 and "active" in stdout:
            return "SSH root login configured and service active.", True
        return "SSH service not active.", False
    return "PermitRootLogin not configured in sshd_config.", False

# Função para resetar o laboratório
def reset_lab():
    print("Iniciando reset_lab...")
    questions = session.get('questions', [])
    results = []
    log_file = "/tmp/reset_lab.log"
    
    with open(log_file, 'a') as log:
        log.write(f"[{datetime.now()}] Iniciando reset do laboratório\n")
        
        for q in questions:
            params = q.get("params", {})
            try:
                if q["id"] == 1:  # Resetar senha do root
                    stdout, stderr, rc = run_command("echo 'root:redhat' | chpasswd")
                    results.append(f"Senha do root redefinida para 'redhat'. RC: {rc}")
                    log.write(f"Questão {q['id']}: Senha do root redefinida. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 2:  # Remover usuário wheel
                    user = params.get("user", "")
                    if user:
                        stdout, stderr, rc = run_command(f"userdel -r {user} 2>/dev/null")
                        results.append(f"Usuário {user} removido. RC: {rc}")
                        log.write(f"Questão {q['id']}: Usuário {user} removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 3:  # Resetar configuração de rede
                    subnet = params.get("subnet", "")
                    if subnet:
                        stdout, stderr, rc = run_command("nmcli con delete enp0s3 2>/dev/null")
                        run_command("nmcli con add type ethernet con-name enp0s3 ifname enp0s3")
                        run_command("hostnamectl set-hostname localhost.localdomain")
                        results.append(f"Configuração de rede e hostname resetados. RC: {rc}")
                        log.write(f"Questão {q['id']}: Rede resetada. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 4:  # Resetar NTP
                    stdout, stderr, rc = run_command("sed -i '/classroom.example.com/d' /etc/chrony.conf")
                    run_command("systemctl restart chronyd")
                    results.append(f"Configuração NTP removida. RC: {rc}")
                    log.write(f"Questão {q['id']}: NTP removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 5:  # Resetar servidor web
                    port = params.get("port", "")
                    if port:
                        stdout, stderr, rc = run_command(f"semanage port -d -t http_port_t -p tcp {port} 2>/dev/null")
                        run_command(f"firewall-cmd --permanent --remove-port={port}/tcp 2>/dev/null")
                        run_command("firewall-cmd --reload")
                        run_command("systemctl stop httpd")
                        run_command("systemctl disable httpd")
                        results.append(f"Servidor web na porta {port} resetado. RC: {rc}")
                        log.write(f"Questão {q['id']}: Servidor web resetado. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 6:  # Remover grupo e usuários
                    group = params.get("group", "")
                    user1 = params.get("user1", "")
                    user2 = params.get("user2", "")
                    user3 = params.get("user3", "")
                    for user in [user1, user2, user3]:
                        if user:
                            stdout, stderr, rc = run_command(f"userdel -r {user} 2>/dev/null")
                            results.append(f"Usuário {user} removido. RC: {rc}")
                            log.write(f"Questão {q['id']}: Usuário {user} removido. RC: {rc}, Stderr: {stderr}\n")
                    if group:
                        stdout, stderr, rc = run_command(f"groupdel {group} 2>/dev/null")
                        results.append(f"Grupo {group} removido. RC: {rc}")
                        log.write(f"Questão {q['id']}: Grupo {group} removido. RC: {rc}, Stderr: {stderr}\n")
                    stdout, stderr, rc = run_command("rm -rf /test")
                    results.append(f"Diretório /test removido. RC: {rc}")
                    log.write(f"Questão {q['id']}: Diretório /test removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 7:  # Remover cron
                    user = params.get("user", "")
                    if user:
                        stdout, stderr, rc = run_command(f"crontab -u {user} -r 2>/dev/null")
                        results.append(f"Tarefa cron para {user} removida. RC: {rc}")
                        log.write(f"Questão {q['id']}: Cron para {user} removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 8:  # Remover usuário com UID
                    user = params.get("user", "")
                    if user:
                        stdout, stderr, rc = run_command(f"userdel -r {user} 2>/dev/null")
                        results.append(f"Usuário {user} removido. RC: {rc}")
                        log.write(f"Questão {q['id']}: Usuário {user} removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 9:  # Remover repositórios
                    stdout, stderr, rc = run_command("rm -f /etc/yum.repos.d/content_example*.repo")
                    results.append(f"Repositórios removidos. RC: {rc}")
                    log.write(f"Questão {q['id']}: Repositórios removidos. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 10:  # Remover arquivo tar
                    dest = params.get("dest", "")
                    if dest:
                        stdout, stderr, rc = run_command(f"rm -f {dest}")
                        results.append(f"Arquivo tar {dest} removido. RC: {rc}")
                        log.write(f"Questão {q['id']}: Arquivo tar {dest} removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 11:  # Remover swap
                    disk = params.get("disk", "")
                    if disk:
                        stdout, stderr, rc = run_command(f"swapoff {disk}1 2>/dev/null")
                        run_command(f"wipefs -a {disk}1 2>/dev/null")
                        run_command(f"parted {disk} rm 1 2>/dev/null")
                        results.append(f"Swap em {disk} removido. RC: {rc}")
                        log.write(f"Questão {q['id']}: Swap em {disk} removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 12:  # Remover LVM
                    vg = params.get("vg", "")
                    lv = params.get("lv", "")
                    mount_point = params.get("mount_point", "")
                    if lv and vg:
                        stdout, stderr, rc = run_command(f"umount {mount_point} 2>/dev/null")
                        run_command(f"lvremove -f /dev/{vg}/{lv} 2>/dev/null")
                        run_command(f"vgremove -f {vg} 2>/dev/null")
                        run_command(f"pvremove -f {DISKS[0]} 2>/dev/null")
                        results.append(f"LVM {vg}/{lv} removido. RC: {rc}")
                        log.write(f"Questão {q['id']}: LVM {vg}/{lv} removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 13:  # Remover LVM (resize)
                    vg = params.get("vg", "")
                    lv = params.get("lv", "")
                    if lv and vg:
                        stdout, stderr, rc = run_command(f"umount {MOUNT_POINTS[0]} 2>/dev/null")
                        run_command(f"lvremove -f /dev/{vg}/{lv} 2>/dev/null")
                        run_command(f"vgremove -f {vg} 2>/dev/null")
                        run_command(f"pvremove -f {DISKS[0]} 2>/dev/null")
                        results.append(f"LVM {vg}/{lv} removido. RC: {rc}")
                        log.write(f"Questão {q['id']}: LVM {vg}/{lv} removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 14:  # Remover arquivo SUID
                    dest = params.get("dest", "")
                    if dest:
                        stdout, stderr, rc = run_command(f"rm -f {dest}")
                        results.append(f"Arquivo SUID {dest} removido. RC: {rc}")
                        log.write(f"Questão {q['id']}: Arquivo SUID {dest} removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 15:  # Remover arquivo SGID
                    dest = params.get("dest", "")
                    if dest:
                        stdout, stderr, rc = run_command(f"rm -f {dest}")
                        results.append(f"Arquivo SGID {dest} removido. RC: {rc}")
                        log.write(f"Questão {q['id']}: Arquivo SGID {dest} removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 16:  # Resetar política de expiração
                    user = params.get("user", "")
                    if user:
                        stdout, stderr, rc = run_command(f"chage -M -1 {user} 2>/dev/null")
                        results.append(f"Política de expiração de senha para {user} resetada. RC: {rc}")
                        log.write(f"Questão {q['id']}: Política de expiração para {user} resetada. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 17:  # Resetar autofs
                    stdout, stderr, rc = run_command("systemctl stop autofs")
                    run_command("rm -f /etc/auto.*")
                    results.append(f"Configuração de autofs removida. RC: {rc}")
                    log.write(f"Questão {q['id']}: Autofs removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 18:  # Remover diretório colaborativo
                    path = params.get("path", "")
                    group = params.get("group", "")
                    if path:
                        stdout, stderr, rc = run_command(f"rm -rf {path}")
                        results.append(f"Diretório colaborativo {path} removido. RC: {rc}")
                        log.write(f"Questão {q['id']}: Diretório {path} removido. RC: {rc}, Stderr: {stderr}\n")
                    if group:
                        stdout, stderr, rc = run_command(f"groupdel {group} 2>/dev/null")
                        results.append(f"Grupo {group} removido. RC: {rc}")
                        log.write(f"Questão {q['id']}: Grupo {group} removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 19:  # Remover arquivo de busca
                    dest = params.get("dest", "")
                    if dest:
                        stdout, stderr, rc = run_command(f"rm -f {dest}")
                        results.append(f"Arquivo de busca {dest} removido. RC: {rc}")
                        log.write(f"Questão {q['id']}: Arquivo de busca {dest} removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 20:  # Resetar tuned
                    stdout, stderr, rc = run_command("tuned-adm off")
                    results.append(f"Perfil tuned resetado. RC: {rc}")
                    log.write(f"Questão {q['id']}: Perfil tuned resetado. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 21:  # Remover imagem de container
                    image_name = params.get("image_name", "")
                    if image_name:
                        stdout, stderr, rc = run_command(f"podman rmi {image_name} 2>/dev/null")
                        results.append(f"Imagem de container {image_name} removida. RC: {rc}")
                        log.write(f"Questão {q['id']}: Imagem {image_name} removida. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 22:  # Remover serviço de container
                    service_name = params.get("service_name", "")
                    if service_name:
                        stdout, stderr, rc = run_command(f"systemctl stop podman-{service_name} 2>/dev/null")
                        run_command(f"systemctl disable podman-{service_name} 2>/dev/null")
                        run_command(f"podman rm -f {service_name} 2>/dev/null")
                        results.append(f"Serviço de container {service_name} removido. RC: {rc}")
                        log.write(f"Questão {q['id']}: Serviço de container {service_name} removido. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 23:  # Resetar senha do root (questão nova)
                    stdout, stderr, rc = run_command("echo 'root:redhat' | chpasswd")
                    results.append(f"Senha do root redefinida para 'redhat'. RC: {rc}")
                    log.write(f"Questão {q['id']}: Senha do root redefinida. RC: {rc}, Stderr: {stderr}\n")
                
                elif q["id"] == 24:  # Resetar configuração SSH root
                    stdout, stderr, rc = run_command("sed -i 's/^PermitRootLogin.*//g' /etc/ssh/sshd_config")
                    run_command("systemctl restart sshd")
                    results.append(f"Configuração SSH root removida. RC: {rc}")
                    log.write(f"Questão {q['id']}: Configuração SSH root removida. RC: {rc}, Stderr: {stderr}\n")
            
            except Exception as e:
                results.append(f"Erro ao resetar a questão {q['id']}: {str(e)}")
                log.write(f"Questão {q['id']}: Erro: {str(e)}\n")
        
        # Limpar sessão
        session.clear()
        session.modified = True
        log.write(f"[{datetime.now()}] Sessão limpa.\n")
    
    print("reset_lab concluído.")
    return results

# Função para gerar o PDF
def generate_pdf(user, lang, questions, results, category_results, overall_percentage):
    print(f"Gerando PDF para usuário {user}...")
    latex_content = r"""
\documentclass[a4paper,11pt]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage{geometry}
\geometry{margin=0.75in}
\usepackage{longtable}
\usepackage{pdflscape}
\usepackage{booktabs}
\usepackage[portuguese,english]{babel}
\selectlanguage{portuguese}
\usepackage{fancyhdr}
\pagestyle{fancy}
\fancyhf{}
\fancyfoot[C]{Resultados do Exame RHCSA - """ + user.replace("_", r"\_") + r"""}
\renewcommand{\headrulewidth}{0pt}
\begin{document}

\begin{center}
    \textbf{\large Resultados do Exame RHCSA} \\
    \vspace{0.3cm}
    Candidato: """ + user.replace("_", r"\_") + r""" \\
    Data: """ + datetime.now().strftime("%d/%m/%Y %H:%M:%S") + r""" \\
    \vspace{0.3cm}
    Pontuação Geral: """ + f"{overall_percentage:.2f}\%" + r"""
\end{center}

\section*{Resumo por Categoria}
\begin{table}[h]
    \centering
    \small
    \begin{tabular}{|l|c|c|c|}
        \hline
        \textbf{Categoria} & \textbf{Questões} & \textbf{Acertos} & \textbf{Porcentagem} \\
        \hline
"""
    for category in category_results:
        latex_content += f"{category['name']} & {category['total']} & {category['correct']} & {category['percentage']:.2f}\% \\\\n        \\hline\n"
    
    latex_content += r"""
    \end{tabular}
\end{table}

\section*{Detalhamento por Questão}
\begin{landscape}
\begin{longtable}{|c|p{7cm}|c|p{7cm}|}
    \hline
    \textbf{ID} & \textbf{Descrição} & \textbf{Status} & \textbf{Feedback} \\
    \hline
    \endhead
"""
    for question in questions:
        qid = str(question["id"])
        status = "Aprovado" if results.get(qid, {}).get("success", False) else "Reprovado" if qid in results else "Não Verificado"
        feedback = results.get(qid, {}).get("result", "Não verificado.").replace("_", r"\_").replace("%", r"\%")
        description = question["text"].replace("_", r"\_").replace("%", r"\%")
        latex_content += f"    {qid} & {description} & {status} & {feedback} \\\\\n    \\hline\n"
    
    latex_content += r"""
\end{longtable}
\end{landscape}

\end{document}
"""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.tex', delete=False, dir='/tmp') as tex_file:
        tex_file.write(latex_content)
        tex_file_path = tex_file.name
    
    pdf_path = f"/tmp/results_{user}.pdf"
    stdout, stderr, rc = run_command(f"pdflatex -output-directory=/tmp {tex_file_path}")
    if rc != 0:
        raise Exception(f"Erro ao gerar PDF: {stderr}")
    
    os.remove(tex_file_path)
    print(f"PDF gerado em {pdf_path}")
    return pdf_path

# Rotas Flask
@app.route('/')
def index():
    print("Acessando rota /index")
    user = request.args.get('user', '')
    lang = request.args.get('lang', 'pt')
    session['user'] = user
    session['lang'] = lang
    session['results'] = {}
    questions = []
    used_users = set()
    used_cron = set()
    for q in QUESTIONS:
        q_copy = q.copy()
        q_copy["params"] = q["params"].copy()
        for k in q_copy["params"]:
            if k == "subnet":
                q_copy["params"][k] = random.choice(SUBNETS)
            elif k == "port":
                q_copy["params"][k] = random.choice(PORTS)
            elif k == "password":
                q_copy["params"][k] = random.choice(PASSWORDS)
            elif k in ["user", "user1", "user2", "user3"]:
                available_users = [u for u in USERS if u not in used_users]
                if available_users:
                    q_copy["params"][k] = random.choice(available_users)
                    used_users.add(q_copy["params"][k])
            elif k == "group":
                q_copy["params"][k] = random.choice(GROUPS)
            elif k == "schedule":
                available_schedules = [s for s in CRON_SCHEDULES if s["command"] not in used_cron]
                if available_schedules:
                    sched = random.choice(available_schedules)
                    q_copy["params"][k] = sched[f"desc_{lang}"]
                    q_copy["params"]["command"] = sched["command"]
                    used_cron.add(sched["command"])
        try:
            q_copy["text"] = q[lang].format(**{k: v for k, v in q_copy["params"].items() if v})
        except KeyError:
            q_copy["text"] = q[lang]
        # Remove 'verify' para evitar serialização
        q_copy.pop("verify", None)
        questions.append(q_copy)
    session['questions'] = questions
    print(f"Sessão inicializada: user={user}, lang={lang}, questions={len(questions)}")
    return render_template('index.html', questions=questions, user=user, lang=lang)

@app.route('/verify/<int:qid>', methods=['POST'])
def verify(qid):
    print(f"Verificando questão {qid}")
    questions = session.get('questions', [])
    question = next((q for q in questions if q["id"] == qid), None)
    if not question:
        print(f"Questão {qid} não encontrada na sessão.")
        return jsonify({"result": "Questão não encontrada.", "success": False})
    original_question = next((q for q in QUESTIONS if q["id"] == qid), None)
    if not original_question:
        print(f"Questão original {qid} não encontrada.")
        return jsonify({"result": "Questão original não encontrada.", "success": False})
    result, success = original_question["verify"](question["params"])
    session['results'][str(qid)] = {"result": result, "success": success}
    session.modified = True
    print(f"Verificação concluída: result={result}, success={success}")
    return jsonify({"result": result, "success": success})

@app.route('/finish', methods=['POST'])
def finish():
    print("Acessando rota /finish")
    user = session.get('user', 'thiago-madeira')
    lang = session.get('lang', 'pt')
    questions = session.get('questions', [])
    results = session.get('results', {})
    category_scores = defaultdict(lambda: {"correct": 0, "total": 0})
    total_correct = 0
    total_questions = len(questions)
    
    for q in questions:
        qid = str(q["id"])
        category = q["category"]
        category_scores[category]["total"] += 1
        if qid in results and results[qid]["success"]:
            category_scores[category]["correct"] += 1
            total_correct += 1
    
    category_results = [
        {
            "name": cat,
            "correct": scores["correct"],
            "total": scores["total"],
            "percentage": (scores["correct"] / scores["total"] * 100) if scores["total"] > 0 else 0
        }
        for cat, scores in sorted(category_scores.items())
    ]
    
    overall_percentage = (total_correct / total_questions * 100) if total_questions > 0 else 0
    
    # Preparar dados para o gráfico
    category_names = [cat["name"] for cat in category_results]
    category_percentages = [cat["percentage"] for cat in category_results]
    
    # Garantir que os IDs sejam strings para o template
    questions = [{**q, "id": str(q["id"])} for q in questions]
    
    print(f"Finalizando: user={user}, total_correct={total_correct}, total_questions={total_questions}")
    return render_template(
        'result.html',
        user=user,
        lang=lang,
        questions=questions,
        results=results,
        category_results=category_results,
        category_names=category_names,
        category_percentages=category_percentages,
        overall_percentage=overall_percentage
    )

@app.route('/reset', methods=['POST'])
def reset():
    print("Acessando rota /reset")
    results = reset_lab()
    user = session.get('user', 'thiago-madeira')
    lang = session.get('lang', 'pt')
    print(f"Reset concluído: user={user}, results={results}")
    return render_template('reset.html', results=results, user=user, lang=lang)

@app.route('/generate_pdf_route', methods=['POST'])
def generate_pdf_route():
    print("Acessando rota /generate_pdf_route")
    user = session.get('user', 'thiago-madeira')
    lang = session.get('lang', 'pt')
    questions = session.get('questions', [])
    results = session.get('results', {})
    category_scores = defaultdict(lambda: {"correct": 0, "total": 0})
    total_correct = 0
    total_questions = len(questions)
    
    for q in questions:
        qid = str(q["id"])
        category = q["category"]
        category_scores[category]["total"] += 1
        if qid in results and results[qid]["success"]:
            category_scores[category]["correct"] += 1
            total_correct += 1
    
    category_results = [
        {
            "name": cat,
            "correct": scores["correct"],
            "total": scores["total"],
            "percentage": (scores["correct"] / scores["total"] * 100) if scores["total"] > 0 else 0
        }
        for cat, scores in category_scores.items()
    ]
    
    overall_percentage = (total_correct / total_questions * 100) if total_questions > 0 else 0
    
    try:
        pdf_path = generate_pdf(user, lang, questions, results, category_results, overall_percentage)
        print(f"Enviando PDF: {pdf_path}")
        return send_file(pdf_path, as_attachment=True, download_name=f"results_{user}.pdf")
    except Exception as e:
        print(f"Erro ao gerar PDF: {str(e)}")
        return jsonify({"error": f"Erro ao gerar PDF: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)