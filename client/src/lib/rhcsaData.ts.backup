export interface QuestionContent {
  title: string;
  description: string;
  category: string;
  explanation: string;
  tips: string[];
  commandExplanations: string[];
}

export interface Question {
  id: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  commands: string[];
  en: QuestionContent;
  pt: QuestionContent;
}

export interface EssentialCommand {
  command: string;
  description: { en: string; pt: string };
  usage: string;
}

export interface StudyTopic {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
}

export interface StudyGuide {
  en: StudyTopic[];
  pt: StudyTopic[];
}

export const essentialCommands: EssentialCommand[] = [
  {
    command: "vi / vim",
    description: { 
      en: "The standard text editor for Linux configuration files.", 
      pt: "O editor de texto padrão para arquivos de configuração Linux." 
    },
    usage: "vi /etc/filename"
  },
  {
    command: "nmcli",
    description: { 
      en: "Network Manager CLI for configuring IP, DNS, and connections.", 
      pt: "Interface de linha de comando para configurar IP, DNS e conexões." 
    },
    usage: "nmcli con mod 'ID' ipv4.addresses ..."
  },
  {
    command: "sed",
    description: { 
      en: "Stream editor for filtering and transforming text (great for port changes).", 
      pt: "Editor de fluxo para filtrar e transformar texto (ótimo para mudar portas)." 
    },
    usage: "sed -i 's/old/new/g' file"
  },
  {
    command: "firewall-cmd",
    description: { 
      en: "Tool to manage the firewalld daemon and open ports/services.", 
      pt: "Ferramenta para gerenciar o daemon firewalld e abrir portas/serviços." 
    },
    usage: "firewall-cmd --permanent --add-port=80/tcp"
  },
  {
    command: "semanage / restorecon",
    description: { 
      en: "SELinux policy management and file context restoration.", 
      pt: "Gerenciamento de políticas SELinux e restauração de contexto de arquivos." 
    },
    usage: "semanage port -a -t http_port_t -p tcp 82"
  },
  {
    command: "podman",
    description: { 
      en: "Daemonless container engine for running and managing containers.", 
      pt: "Motor de containers sem daemon para rodar e gerenciar containers." 
    },
    usage: "podman run -d --name web -p 80:80 image"
  },
  {
    command: "fdisk / parted",
    description: { 
      en: "Tools for creating and managing disk partitions.", 
      pt: "Ferramentas para criar e gerenciar partições de disco." 
    },
    usage: "fdisk /dev/sdb"
  },
  {
    command: "pv/vg/lv commands",
    description: { 
      en: "LVM management tools (Physical Volumes, Volume Groups, Logical Volumes).", 
      pt: "Ferramentas de gerenciamento LVM (Volumes Físicos, Grupos, Lógicos)." 
    },
    usage: "lvcreate -L 100M -n mylv myvg"
  }
];

export const rhcsaQuestions: Question[] = [
  {
    id: 1,
    difficulty: "beginner",
    commands: [
      "nmcli con mod 'Wired connection 1' ipv4.addresses 10.129.203.120/24 ipv4.gateway 10.129.203.112 ipv4.dns 10.129.203.112 ipv4.method manual",
      "nmcli con up 'Wired connection 1'",
      "hostnamectl set-hostname node1.lab.example.com"
    ],
    en: {
      title: "Question 1: Network Config",
      description: "Set up static IP (10.129.203.120/24), gateway, DNS (10.129.203.112), and hostname (node1.lab.example.com).",
      category: "Network Configuration",
      explanation: "Use nmcli for network settings and hostnamectl for the hostname. In the exam, you must ensure the connection is persistent.",
      tips: ["Check connection name with: nmcli con show", "Verify with: ip addr show"],
      commandExplanations: [
        "Configure the static IP, gateway, and DNS for the specific connection.",
        "Activate the connection to apply the new network settings.",
        "Set the system's persistent hostname."
      ]
    },
    pt: {
      title: "Questão 1: Configuração de Rede",
      description: "Configurar IP estático (10.129.203.120/24), gateway, DNS (10.129.203.112) e hostname (node1.lab.example.com).",
      category: "Configuração de Rede",
      explanation: "Use nmcli para as configurações de rede e hostnamectl para o hostname. No exame, você deve garantir que a conexão seja persistente.",
      tips: ["Verifique o nome da conexão com: nmcli con show", "Verifique com: ip addr show"],
      commandExplanations: [
        "Configura o IP estático, gateway e DNS para a conexão específica.",
        "Ativa a conexão para aplicar as novas configurações de rede.",
        "Define o nome de host (hostname) persistente do sistema."
      ]
    }
  },
  {
    id: 2,
    difficulty: "beginner",
    commands: [
      "vi /etc/yum.repos.d/exam.repo",
      "INSERT_CONTENT: [BaseOS]\nname=BaseOS\nbaseurl=file:///mnt/BaseOS\nenabled=1\ngpgcheck=0\n\n[AppStream]\nname=AppStream\nbaseurl=file:///mnt/AppStream\nenabled=1\ngpgcheck=0",
      "yum clean all",
      "yum repolist"
    ],
    en: {
      title: "Question 2: Repositories",
      description: "Set up BaseOS and AppStream repositories using local paths (file:///mnt/BaseOS and file:///mnt/AppStream).",
      category: "System Configuration",
      explanation: "Create a .repo file in /etc/yum.repos.d/ pointing to the local mount points. This is essential for installing packages during the exam.",
      tips: ["Ensure the paths are exactly as specified in the exam.", "GPG check should be disabled (0)."],
      commandExplanations: [
        "Use the vi editor to create or edit the repository configuration file.",
        "Add the following content to the file and save it.",
        "Clear the yum cache to ensure the new repository information is loaded.",
        "List the enabled repositories to verify the configuration."
      ]
    },
    pt: {
      title: "Questão 2: Repositórios",
      description: "Configurar repositórios BaseOS e AppStream usando caminhos locais (file:///mnt/BaseOS e file:///mnt/AppStream).",
      category: "Configuração do Sistema",
      explanation: "Crie um arquivo .repo em /etc/yum.repos.d/ apontando para os pontos de montagem locais. Isso é essencial para instalar pacotes durante a prova.",
      tips: ["Certifique-se de que os caminhos sejam exatamente como especificado no exame.", "O check GPG deve ser desativado (0)."],
      commandExplanations: [
        "Usa o editor vi para criar ou editar o arquivo de configuração do repositório.",
        "Adicione o conteúdo abaixo dentro do arquivo e salve.",
        "Limpa o cache do yum para garantir que as novas informações do repositório sejam carregadas.",
        "Lista os repositórios habilitados para verificar a configuração."
      ]
    }
  },
  {
    id: 3,
    difficulty: "intermediate",
    commands: [
      "yum install httpd -y",
      "systemctl enable --now httpd",
      "firewall-cmd --permanent --add-port=82/tcp",
      "firewall-cmd --permanent --add-service=http",
      "firewall-cmd --reload",
      "semanage port -a -t http_port_t -p tcp 82",
      "sed -i 's/Listen 80/Listen 82/' /etc/httpd/conf/httpd.conf",
      "systemctl restart httpd"
    ],
    en: {
      title: "Question 3: SELinux and Firewall",
      description: "Install Apache, configure it to run on port 82, and ensure SELinux and Firewall allow the traffic.",
      category: "Security & Services",
      explanation: "Change the port in httpd.conf, add the port to SELinux using semanage, and open it in firewalld. This tests your ability to handle non-standard service ports.",
      tips: ["Use 'semanage port -l | grep http' to verify SELinux ports.", "Restart httpd after config changes."],
      commandExplanations: [
        "Install the Apache web server package.",
        "Enable the service to start at boot and start it immediately.",
        "Open port 82 in the firewall permanently.",
        "Ensure the standard HTTP service is allowed in the firewall.",
        "Reload the firewall configuration to apply the changes.",
        "Inform SELinux that port 82 is allowed for the HTTP service.",
        "Use sed to change the listening port from 80 to 82 in the config file.",
        "Restart Apache to apply the new port configuration."
      ]
    },
    pt: {
      title: "Questão 3: SELinux e Firewall",
      description: "Instalar Apache, configurá-lo para rodar na porta 82 e garantir que o SELinux e o Firewall permitam o tráfego.",
      category: "Segurança e Serviços",
      explanation: "Altere a porta no httpd.conf, adicione a porta ao SELinux usando semanage e abra-a no firewalld. Isso testa sua habilidade de lidar com portas não padrão.",
      tips: ["Use 'semanage port -l | grep http' para verificar as portas do SELinux.", "Reinicie o httpd após as mudanças de configuração."],
      commandExplanations: [
        "Instala o pacote do servidor web Apache.",
        "Habilita o serviço para iniciar no boot e o inicia imediatamente.",
        "Abre a porta 82 no firewall de forma permanente.",
        "Garante que o serviço HTTP padrão esteja permitido no firewall.",
        "Recarrega as configurações do firewall para aplicar as mudanças.",
        "Informa ao SELinux que a porta 82 é permitida para o serviço HTTP.",
        "Usa o sed para alterar a porta de escuta de 80 para 82 no arquivo de configuração.",
        "Reinicia o Apache para aplicar a nova configuração de porta."
      ]
    }
  },
  {
    id: 4,
    difficulty: "beginner",
    commands: [
      "groupadd sysmgrs",
      "useradd -G sysmgrs john",
      "useradd -G sysmgrs emma",
      "useradd -s /sbin/nologin michael",
      "echo 'compedel@314' | passwd --stdin john",
      "echo 'compedel@314' | passwd --stdin emma",
      "echo 'compedel@314' | passwd --stdin michael"
    ],
    en: {
      title: "Question 4: Users and Groups",
      description: "Create group 'sysmgrs', users john and emma (members), and michael (nologin, not a member). Set password to 'compedel@314'.",
      category: "User Management",
      explanation: "Use groupadd for the group and useradd with -G for supplementary groups or -s for shell. Password management via stdin is common in scripts.",
      tips: ["Verify with 'id username'.", "Check shell with 'grep username /etc/passwd'."],
      commandExplanations: [
        "Create the new system group 'sysmgrs'.",
        "Create user john and add him to the 'sysmgrs' group.",
        "Create user emma and add her to the 'sysmgrs' group.",
        "Create user michael with a shell that prevents login.",
        "Set the password for john using standard input.",
        "Set the password for emma using standard input.",
        "Set the password for michael using standard input."
      ]
    },
    pt: {
      title: "Questão 4: Usuários e Grupos",
      description: "Criar grupo 'sysmgrs', usuários john e emma (membros) e michael (nologin, não membro). Definir senha como 'compedel@314'.",
      category: "Gerenciamento de Usuários",
      explanation: "Use groupadd para o grupo e useradd com -G para grupos suplementares ou -s para shell. O gerenciamento de senhas via stdin é comum em scripts.",
      tips: ["Verifique com 'id username'.", "Verifique o shell com 'grep username /etc/passwd'."],
      commandExplanations: [
        "Cria o novo grupo de sistema 'sysmgrs'.",
        "Cria o usuário john e o adiciona ao grupo 'sysmgrs'.",
        "Cria a usuária emma e a adiciona ao grupo 'sysmgrs'.",
        "Cria o usuário michael com um shell que impede o login.",
        "Define a senha para john usando a entrada padrão.",
        "Define a senha para emma usando a entrada padrão.",
        "Define a senha para michael usando a entrada padrão."
      ]
    }
  },
  {
    id: 5,
    difficulty: "intermediate",
    commands: [
      "mkdir /home/managers",
      "chgrp sysmgrs /home/managers",
      "chmod 2770 /home/managers"
    ],
    en: {
      title: "Question 5: Permissions and SGID",
      description: "Create /home/managers, set group to 'sysmgrs', and ensure full access for members with SGID enabled.",
      category: "Permissions",
      explanation: "Use chmod 2770 to set SGID and full permissions for owner/group. SGID ensures new files inherit the directory's group.",
      tips: ["The '2' in 2770 is for SGID.", "Verify with 'ls -ld /home/managers'."],
      commandExplanations: [
        "Create the target directory.",
        "Change the group ownership to 'sysmgrs'.",
        "Set SGID and full permissions for owner and group, none for others."
      ]
    },
    pt: {
      title: "Questão 5: Permissões e SGID",
      description: "Criar /home/managers, definir grupo como 'sysmgrs' e garantir acesso total para membros com SGID habilitado.",
      category: "Permissões",
      explanation: "Use chmod 2770 para definir SGID e permissões totais para dono/grupo. O SGID garante que novos arquivos herdem o grupo do diretório.",
      tips: ["O '2' em 2770 é para o SGID.", "Verifique com 'ls -ld /home/managers'."],
      commandExplanations: [
        "Cria o diretório de destino.",
        "Altera a propriedade do grupo para 'sysmgrs'.",
        "Define o SGID e permissões totais para dono e grupo, nenhuma para outros."
      ]
    }
  },
  {
    id: 6,
    difficulty: "intermediate",
    commands: [
      "cp /etc/fstab /var/tmp/fstab",
      "setfacl -m u:john:rw /var/tmp/fstab",
      "setfacl -m u:emma:--- /var/tmp/fstab"
    ],
    en: {
      title: "Question 6: ACLs",
      description: "Copy /etc/fstab to /var/tmp/fstab. Give john rw permissions and emma no permissions via ACL.",
      category: "Permissions",
      explanation: "Use setfacl for fine-grained permissions. ACLs allow you to define permissions for specific users beyond standard UGO.",
      tips: ["Verify with 'getfacl /var/tmp/fstab'.", "Ensure the file is copied first."],
      commandExplanations: [
        "Copy the source file to the destination.",
        "Grant read and write permissions to user john.",
        "Remove all permissions for user emma."
      ]
    },
    pt: {
      title: "Questão 6: ACLs",
      description: "Copiar /etc/fstab para /var/tmp/fstab. Dar permissões rw para john e nenhuma permissão para emma via ACL.",
      category: "Permissões",
      explanation: "Use setfacl para permissões detalhadas. As ACLs permitem definir permissões para usuários específicos além do padrão UGO.",
      tips: ["Verifique com 'getfacl /var/tmp/fstab'.", "Certifique-se de que o arquivo foi copiado primeiro."],
      commandExplanations: [
        "Copia o arquivo de origem para o destino.",
        "Concede permissões de leitura e escrita para o usuário john.",
        "Remove todas as permissões para a usuária emma."
      ]
    }
  },
  {
    id: 7,
    difficulty: "beginner",
    commands: [
      "crontab -e -u john",
      "INSERT_CONTENT: */5 * * * * echo hello"
    ],
    en: {
      title: "Question 7: Cron Jobs",
      description: "Configure a cron job for user john to run 'echo hello' every 5 minutes.",
      category: "Automation",
      explanation: "Use 'crontab -e -u john'. The format is 'min hour day month dow command'.",
      tips: ["Check with 'crontab -l -u john'.", "Ensure the user exists."],
      commandExplanations: [
        "Open the crontab editor for user john.",
        "Add the cron schedule and command to the file and save it."
      ]
    },
    pt: {
      title: "Questão 7: Tarefas Cron",
      description: "Configurar uma tarefa cron para o usuário john executar 'echo hello' a cada 5 minutos.",
      category: "Automação",
      explanation: "Use 'crontab -e -u john'. O formato é 'min hora dia mês dds comando'.",
      tips: ["Verifique com 'crontab -l -u john'.", "Certifique-se de que o usuário existe."],
      commandExplanations: [
        "Abre o editor de crontab para o usuário john.",
        "Adicione o agendamento cron e o comando no arquivo e salve."
      ]
    }
  },
  {
    id: 8,
    difficulty: "intermediate",
    commands: [
      "mkdir /data",
      "chown root:sysmgrs /data",
      "chmod 770 /data"
    ],
    en: {
      title: "Question 8: Directory Permissions",
      description: "Create /data, owned by root and group sysmgrs, with full access for both and none for others.",
      category: "Permissions",
      explanation: "Standard chmod 770. This is a basic test of ownership and permission bits.",
      tips: ["Verify with 'ls -ld /data'."],
      commandExplanations: [
        "Create the directory.",
        "Set the owner to root and group to sysmgrs.",
        "Set rwx for owner/group and none for others."
      ]
    },
    pt: {
      title: "Questão 8: Permissões de Diretório",
      description: "Criar /data, pertencente ao root e grupo sysmgrs, com acesso total para ambos e nenhum para outros.",
      category: "Permissões",
      explanation: "chmod 770 padrão. Este é um teste básico de propriedade e bits de permissão.",
      tips: ["Verifique com 'ls -ld /data'."],
      commandExplanations: [
        "Cria o diretório.",
        "Define o dono como root e o grupo como sysmgrs.",
        "Define rwx para dono/grupo e nenhum para outros."
      ]
    }
  },
  {
    id: 9,
    difficulty: "beginner",
    commands: [
      "yum install autofs -y",
      "vi /etc/auto.master",
      "INSERT_CONTENT: /rhome /etc/auto.rhome",
      "vi /etc/auto.rhome",
      "INSERT_CONTENT: * -rw,sync server.example.com:/rhome/&",
      "systemctl enable --now autofs"
    ],
    en: {
      title: "Question 9: Autofs",
      description: "Configure autofs to mount /rhome from server.example.com:/rhome. Ensure it's persistent.",
      category: "Storage & Mounting",
      explanation: "Install autofs, edit /etc/auto.master and create a map file. Autofs mounts filesystems on demand.",
      tips: ["Check with 'df -h' after accessing the directory.", "Restart autofs after config changes."],
      commandExplanations: [
        "Install the autofs package.",
        "Edit the master configuration file to define the mount point and map file.",
        "Add the mount point and map file reference to auto.master.",
        "Create the map file to define the remote share and options.",
        "Add the wildcard mapping for the remote home directories.",
        "Enable and start the autofs service."
      ]
    },
    pt: {
      title: "Questão 9: Autofs",
      description: "Configurar autofs para montar /rhome de server.example.com:/rhome. Garanta que seja persistente.",
      category: "Armazenamento e Montagem",
      explanation: "Instale o autofs, edite /etc/auto.master e crie um arquivo de mapa. O autofs monta sistemas de arquivos sob demanda.",
      tips: ["Verifique com 'df -h' após acessar o diretório.", "Reinicie o autofs após as mudanças."],
      commandExplanations: [
        "Instala o pacote autofs.",
        "Edita o arquivo de configuração mestre para definir o ponto de montagem e o arquivo de mapa.",
        "Adicione a referência do ponto de montagem e do arquivo de mapa no auto.master.",
        "Cria o arquivo de mapa para definir o compartilhamento remoto e as opções.",
        "Adicione o mapeamento curinga para os diretórios home remotos.",
        "Habilita e inicia o serviço autofs."
      ]
    }
  },
  {
    id: 10,
    difficulty: "intermediate",
    commands: [
      "find / -user john -exec cp -a {} /root/findfiles/ \\;"
    ],
    en: {
      title: "Question 10: Find and Copy",
      description: "Find all files owned by user john and copy them to /root/findfiles/.",
      category: "File Management",
      explanation: "Use 'find / -user john -exec cp ...'. This tests your ability to locate and manipulate files based on attributes.",
      tips: ["Ensure /root/findfiles/ exists first.", "Use -a with cp to preserve attributes."],
      commandExplanations: [
        "Search the entire filesystem for files owned by john and copy them to the target directory."
      ]
    },
    pt: {
      title: "Questão 10: Localizar e Copiar",
      description: "Localizar todos os arquivos pertencentes ao usuário john e copiá-los para /root/findfiles/.",
      category: "Gerenciamento de Arquivos",
      explanation: "Use 'find / -user john -exec cp ...'. Isso testa sua habilidade de localizar e manipular arquivos baseados em atributos.",
      tips: ["Garanta que /root/findfiles/ exista primeiro.", "Use -a com cp para preservar atributos."],
      commandExplanations: [
        "Busca em todo o sistema de arquivos por arquivos do john e os copia para o diretório de destino."
      ]
    }
  },
  {
    id: 11,
    difficulty: "beginner",
    commands: [
      "grep 'ng' /etc/passwd > /root/grepresults"
    ],
    en: {
      title: "Question 11: Grep",
      description: "Search for all lines containing 'ng' in /etc/passwd and save them to /root/grepresults.",
      category: "File Management",
      explanation: "Use 'grep pattern file > output'. Redirection is a fundamental shell skill.",
      tips: ["Verify with 'cat /root/grepresults'."],
      commandExplanations: [
        "Filter the passwd file for the string 'ng' and redirect the output to a new file."
      ]
    },
    pt: {
      title: "Questão 11: Grep",
      description: "Buscar todas as linhas que contenham 'ng' no /etc/passwd e salvá-las em /root/grepresults.",
      category: "Gerenciamento de Arquivos",
      explanation: "Use 'grep padrão arquivo > saída'. O redirecionamento é uma habilidade fundamental do shell.",
      tips: ["Verifique com 'cat /root/grepresults'."],
      commandExplanations: [
        "Filtra o arquivo passwd pela string 'ng' e redireciona a saída para um novo arquivo."
      ]
    }
  },
  {
    id: 12,
    difficulty: "beginner",
    commands: [
      "tar -czvf /root/backup.tar.gz /usr/local"
    ],
    en: {
      title: "Question 12: Archive with Tar",
      description: "Backup /usr/local to /root/backup.tar.gz using gzip compression.",
      category: "File Management",
      explanation: "Use 'tar -czvf'. Archiving is a core skill for backups and data transfer.",
      tips: ["Verify with 'tar -tzvf /root/backup.tar.gz'."],
      commandExplanations: [
        "Create a gzip-compressed tar archive of the /usr/local directory."
      ]
    },
    pt: {
      title: "Questão 12: Arquivar arquivos com Tar",
      description: "Fazer backup de /usr/local para /root/backup.tar.gz usando compressão gzip.",
      category: "Gerenciamento de Arquivos",
      explanation: "Use 'tar -czvf'. Arquivamento é uma habilidade fundamental para backups e transferência de dados.",
      tips: ["Verifique com 'tar -tzvf /root/backup.tar.gz'."],
      commandExplanations: [
        "Cria um arquivo tar compactado com gzip do diretório /usr/local."
      ]
    }
  },
  {
    id: 13,
    difficulty: "intermediate",
    commands: [
      "su - john",
      "umask 277",
      "exit"
    ],
    en: {
      title: "Question 13: Umask",
      description: "Configure user john so that new files have '-r--------' and new directories have 'dr-x------' by default.",
      category: "Permissions",
      explanation: "The umask should be 277. Umask defines the default permissions for newly created files and directories.",
      tips: ["Umask subtracts from base permissions.", "Test by creating a file and directory as john."],
      commandExplanations: [
        "Switch to user john to configure his environment.",
        "Set the umask to 277 to restrict default permissions.",
        "Exit the user session."
      ]
    },
    pt: {
      title: "Questão 13: Umask",
      description: "Configurar o usuário john para que novos arquivos tenham '-r--------' e novos diretórios tenham 'dr-x------' por padrão.",
      category: "Permissões",
      explanation: "O umask deve ser 277. O umask define as permissões padrão para arquivos e diretórios recém-criados.",
      tips: ["O umask subtrai das permissões base.", "Teste criando um arquivo e um diretório como john."],
      commandExplanations: [
        "Muda para o usuário john para configurar seu ambiente.",
        "Define o umask como 277 para restringir as permissões padrão.",
        "Sai da sessão do usuário."
      ]
    }
  },
  {
    id: 14,
    difficulty: "beginner",
    commands: [
      "chage -M 90 john"
    ],
    en: {
      title: "Question 14: Password Expiration",
      description: "Set the password for user john to expire every 90 days.",
      category: "User Management",
      explanation: "Use 'chage -M 90 john'. Password aging is a key security policy in enterprise environments.",
      tips: ["Verify with 'chage -l john'."],
      commandExplanations: [
        "Modify the password aging information for user john."
      ]
    },
    pt: {
      title: "Questão 14: Expiração de Senha",
      description: "Configurar a senha do usuário john para expirar a cada 90 dias.",
      category: "Gerenciamento de Usuários",
      explanation: "Use 'chage -M 90 john'. A expiração de senha é uma política de segurança chave em ambientes corporativos.",
      tips: ["Verifique com 'chage -l john'."],
      commandExplanations: [
        "Modifica as informações de expiração de senha para o usuário john."
      ]
    }
  },
  {
    id: 15,
    difficulty: "beginner",
    commands: [
      "visudo",
      "INSERT_CONTENT: %sysmgrs  ALL=(ALL)  NOPASSWD: ALL"
    ],
    en: {
      title: "Question 15: Sudo",
      description: "Configure the group 'sysmgrs' to have sudo privileges without requiring a password.",
      category: "User Management",
      explanation: "Edit the sudoers file using visudo. This allows delegated administration without sharing the root password.",
      tips: ["The '%' prefix denotes a group.", "NOPASSWD: ALL allows execution without password."],
      commandExplanations: [
        "Safely edit the sudoers file to add group permissions.",
        "Add the sudoers entry to the file and save it."
      ]
    },
    pt: {
      title: "Questão 15: Sudo",
      description: "Configurar o grupo 'sysmgrs' para ter privilégios de sudo sem exigir senha.",
      category: "Gerenciamento de Usuários",
      explanation: "Edite o arquivo sudoers usando visudo. Isso permite a administração delegada sem compartilhar a senha do root.",
      tips: ["O prefixo '%' denota um grupo.", "NOPASSWD: ALL permite a execução sem senha."],
      commandExplanations: [
        "Edita o arquivo sudoers com segurança para adicionar as permissões do grupo.",
        "Adicione a entrada do sudoers no arquivo e salve."
      ]
    }
  },
  {
    id: 16,
    difficulty: "intermediate",
    commands: [
      "vi /usr/local/bin/myscript",
      "INSERT_CONTENT: #!/bin/bash\n\nif [ \"$1\" == \"redhat\" ]; then\n    echo fedora\nelif [ \"$1\" == \"fedora\" ]; then\n    echo redhat\nfi",
      "chmod +x /usr/local/bin/myscript"
    ],
    en: {
      title: "Question 16: Simple Script",
      description: "Create a script /usr/local/bin/myscript that outputs 'fedora' if 'redhat' is passed, and 'redhat' if 'fedora' is passed.",
      category: "Automation",
      explanation: "Use a simple bash script with if/elif conditions. Basic scripting is required for automating repetitive tasks.",
      tips: ["Don't forget to make it executable.", "Test with both arguments."],
      commandExplanations: [
        "Create the script file and prepare to add the conditional logic.",
        "Add the script content to the file and save it.",
        "Make the script file executable."
      ]
    },
    pt: {
      title: "Questão 16: Script Simples",
      description: "Criar um script /usr/local/bin/myscript que retorne 'fedora' se 'redhat' for passado, e 'redhat' se 'fedora' for passado.",
      category: "Automação",
      explanation: "Use um script bash simples com condições if/elif. Scripting básico é necessário para automatizar tarefas repetitivas.",
      tips: ["Não esqueça de torná-lo executável.", "Teste com ambos os argumentos."],
      commandExplanations: [
        "Cria o arquivo do script e prepara para adicionar a lógica condicional.",
        "Adicione o conteúdo do script no arquivo e salve.",
        "Torna o arquivo do script executável."
      ]
    }
  },
  {
    id: 17,
    difficulty: "advanced",
    commands: [
      "mount -o remount,rw /sysroot",
      "chroot /sysroot",
      "passwd root",
      "touch /.autorelabel",
      "exit",
      "exit"
    ],
    en: {
      title: "Question 17: Reset Root Password",
      description: "Reset the root password to 'compedel@777' using the boot recovery method.",
      category: "System Recovery",
      explanation: "Interrupt boot at GRUB, use rd.break, remount /sysroot as rw, and change password. This is a critical recovery skill.",
      tips: ["Don't forget 'touch /.autorelabel' for SELinux.", "Use 'rd.break' or 'init=/bin/bash'."],
      commandExplanations: [
        "Remount the system root as writable to allow changes.",
        "Change the root directory to the system root.",
        "Set the new password for the root user.",
        "Create the hidden file to trigger SELinux relabeling on next boot.",
        "Exit the chroot environment.",
        "Exit the recovery shell to resume boot."
      ]
    },
    pt: {
      title: "Questão 17: Redefinir Senha Root",
      description: "Redefinir a senha root para 'compedel@777' usando o método de recuperação no boot.",
      category: "Recuperação do Sistema",
      explanation: "Interrompa o boot no GRUB, use rd.break, remonte /sysroot como rw e altere a senha. Esta é uma habilidade de recuperação crítica.",
      tips: ["Não esqueça o 'touch /.autorelabel' para o SELinux.", "Use 'rd.break' ou 'init=/bin/bash'."],
      commandExplanations: [
        "Remonta a raiz do sistema como gravável para permitir alterações.",
        "Muda o diretório raiz para a raiz do sistema.",
        "Define a nova senha para o usuário root.",
        "Cria o arquivo oculto para disparar a rotulagem do SELinux no próximo boot.",
        "Sai do ambiente chroot.",
        "Sai do shell de recuperação para retomar o boot."
      ]
    }
  },
  {
    id: 18,
    difficulty: "intermediate",
    commands: [
      "fdisk /dev/sdb",
      "mkswap /dev/sdb1",
      "vi /etc/fstab",
      "INSERT_CONTENT: /dev/sdb1  swap  swap  defaults  0 0",
      "swapon -a"
    ],
    en: {
      title: "Question 18: Create an Swap Partition",
      description: "Add a 756 MiB swap partition on /dev/sdb and ensure it mounts automatically.",
      category: "Storage & Mounting",
      explanation: "Create partition, set type to swap, format with mkswap, and add to fstab. Swap space is essential for memory management.",
      tips: ["Check with 'swapon -s'.", "Ensure fstab entry is correct."],
      commandExplanations: [
        "Use fdisk to create the new partition on the disk.",
        "Format the new partition as swap space.",
        "Open the fstab file for editing.",
        "Add the swap entry to the file and save it.",
        "Activate all swap spaces defined in fstab."
      ]
    },
    pt: {
      title: "Questão 18: Criar uma Partição Swap",
      description: "Adicionar uma partição swap de 756 MiB no /dev/sdb e garantir que ela seja montada automaticamente.",
      category: "Armazenamento e Montagem",
      explanation: "Crie a partição, defina o tipo como swap, formate com mkswap e adicione ao fstab. O espaço de swap é essencial para o gerenciamento de memória.",
      tips: ["Verifique com 'swapon -s'.", "Garanta que a entrada no fstab esteja correta."],
      commandExplanations: [
        "Usa o fdisk para criar a nova partição no disco.",
        "Formata a nova partição como espaço de swap.",
        "Abre o arquivo fstab para edição.",
        "Adicione a entrada de swap no arquivo e salve.",
        "Ativa todos os espaços de swap definidos no fstab."
      ]
    }
  },
  {
    id: 19,
    difficulty: "advanced",
    commands: [
      "pvcreate /dev/sdc1",
      "vgcreate -s 16M qagroup /dev/sdc1",
      "lvcreate -l 60 -n qa qagroup",
      "mkfs.ext4 /dev/qagroup/qa",
      "mkdir -p /mnt/qa",
      "vi /etc/fstab",
      "INSERT_CONTENT: /dev/qagroup/qa  /mnt/qa  ext4  defaults  0 0",
      "mount -a"
    ],
    en: {
      title: "Question 19: LVM Management",
      description: "Create a logical volume 'qa' in 'qagroup' with 60 extents of 16 MiB each. Format as ext4 and mount on /mnt/qa.",
      category: "Storage & Mounting",
      explanation: "Create PV, VG with 16M PE size, LV with 60 extents, format and mount. LVM provides flexible storage management.",
      tips: ["Total size will be 16 * 60 = 960 MiB.", "Verify with 'lvs' and 'vgs'."],
      commandExplanations: [
        "Initialize the partition as a Physical Volume.",
        "Create the Volume Group with a specific Physical Extent size.",
        "Create the Logical Volume using a specific number of extents.",
        "Format the logical volume with ext4 filesystem.",
        "Create the mount point directory.",
        "Open the fstab file for editing.",
        "Add the mount entry to the file and save it.",
        "Mount all filesystems defined in fstab."
      ]
    },
    pt: {
      title: "Questão 19: Gerenciamento de LVM",
      description: "Criar um volume lógico 'qa' no 'qagroup' com 60 extents de 16 MiB cada. Formatar como ext4 e montar em /mnt/qa.",
      category: "Armazenamento e Montagem",
      explanation: "Crie PV, VG com tamanho de PE de 16M, LV com 60 extents, formate e monte. O LVM fornece gerenciamento flexível de armazenamento.",
      tips: ["O tamanho total será 16 * 60 = 960 MiB.", "Verifique com 'lvs' e 'vgs'."],
      commandExplanations: [
        "Inicializa a partição como um Volume Físico.",
        "Cria o Grupo de Volumes com um tamanho de Physical Extent específico.",
        "Cria o Volume Lógico usando um número específico de extents.",
        "Formata o volume lógico com o sistema de arquivos ext4.",
        "Cria o diretório do ponto de montagem.",
        "Abre o arquivo fstab para edição.",
        "Adicione a linha de entrada de montagem no arquivo e salve.",
        "Monta todos os sistemas de arquivos definidos no fstab."
      ]
    }
  },
  {
    id: 20,
    difficulty: "advanced",
    commands: [
      "yum install vdo kmod-kvdo -y",
      "vdo create --name=vdo1 --device=/dev/sdd --vdoLogicalSize=50G",
      "mkfs.xfs -K /dev/mapper/vdo1",
      "mkdir /mnt/vdo1",
      "vi /etc/fstab",
      "INSERT_CONTENT: /dev/mapper/vdo1  /mnt/vdo1  xfs  defaults,x-systemd.requires=vdo.service  0 0",
      "mount -a"
    ],
    en: {
      title: "Question 20: Create and Manage a VDO Volume",
      description: "Create a VDO volume named vdo1 on /dev/sdd with a logical size of 50G. Format as XFS and mount on /mnt/vdo1.",
      category: "Storage & Mounting",
      explanation: "Install VDO, create volume, format with XFS, and mount with systemd dependency. VDO is key for storage efficiency.",
      tips: ["VDO provides deduplication and compression.", "The 'x-systemd.requires=vdo.service' is important in fstab."],
      commandExplanations: [
        "Install the VDO management tools and kernel module.",
        "Create the VDO volume with deduplication and compression enabled.",
        "Format the VDO device with XFS, skipping block discard.",
        "Create the mount point directory.",
        "Open the fstab file for editing.",
        "Add the mount entry with systemd dependency to the file and save it.",
        "Mount the new VDO volume."
      ]
    },
    pt: {
      title: "Questão 20: Criar e Gerenciar um Volume VDO",
      description: "Criar um volume VDO chamado vdo1 no /dev/sdd com tamanho lógico de 50G. Formatar como XFS e montar em /mnt/vdo1.",
      category: "Armazenamento e Montagem",
      explanation: "Instale o VDO, crie o volume, formate com XFS e monte com a dependência do systemd. O VDO é chave para a eficiência do armazenamento.",
      tips: ["O VDO fornece deduplicação e compressão.", "O 'x-systemd.requires=vdo.service' é importante no fstab."],
      commandExplanations: [
        "Instala as ferramentas de gerenciamento VDO e o módulo do kernel.",
        "Cria o volume VDO com deduplicação e compressão habilitadas.",
        "Formata o dispositivo VDO com XFS, pulando o descarte de blocos.",
        "Cria o diretório do ponto de montagem.",
        "Abre o arquivo fstab para edição.",
        "Adicione a entrada de montagem com dependência do systemd no arquivo e salve.",
        "Monta o novo volume VDO."
      ]
    }
  },
  {
    id: 21,
    difficulty: "intermediate",
    commands: [
      "lvresize -L 230M /dev/VG/VO -r"
    ],
    en: {
      title: "Question 21: Extend a Logical Volume",
      description: "Extend the logical volume VO to 230 MiB and resize the filesystem.",
      category: "Storage & Mounting",
      explanation: "Use lvresize with -r to handle the filesystem automatically. This is safer than manual resizing.",
      tips: ["Verify with 'df -h' and 'lvs'."],
      commandExplanations: [
        "Resize the logical volume and its filesystem in a single step."
      ]
    },
    pt: {
      title: "Questão 21: Estender um Volume Lógico",
      description: "Estender o volume lógico VO para 230 MiB e redimensionar o sistema de arquivos.",
      category: "Armazenamento e Montagem",
      explanation: "Use lvresize com -r para lidar com o sistema de arquivos automaticamente. Isso é mais seguro do que o redimensionamento manual.",
      tips: ["Verifique com 'df -h' and 'lvs'."],
      commandExplanations: [
        "Redimensiona o volume lógico e seu sistema de arquivos em um único passo."
      ]
    }
  },
  {
    id: 22,
    difficulty: "beginner",
    commands: [
      "yum install tuned -y",
      "tuned-adm profile virtual-guest"
    ],
    en: {
      title: "Question 22: Enable Tuned and a specific profile",
      description: "Install tuned and set the active profile to 'virtual-guest'.",
      category: "System Configuration",
      explanation: "Use tuned-adm to set the profile. Tuned optimizes the system for specific workloads.",
      tips: ["Check current profile with 'tuned-adm active'."],
      commandExplanations: [
        "Install the tuned system tuning service.",
        "Apply the 'virtual-guest' optimization profile."
      ]
    },
    pt: {
      title: "Questão 22: Habilitar Tuned e um perfil específico",
      description: "Instalar o tuned e definir o perfil ativo como 'virtual-guest'.",
      category: "Configuração do Sistema",
      explanation: "Use tuned-adm para definir o perfil. O Tuned otimiza o sistema para cargas de trabalho específicas.",
      tips: ["Verifique o perfil atual com 'tuned-adm active'."],
      commandExplanations: [
        "Instala o serviço de ajuste de sistema tuned.",
        "Aplica o perfil de otimização 'virtual-guest'."
      ]
    }
  },
  {
    id: 23,
    difficulty: "advanced",
    commands: [
      "yum install podman -y",
      "podman pull registry.redhat.io/rhel8/httpd-24",
      "podman run -d --name myweb -p 8080:80 registry.redhat.io/rhel8/httpd-24",
      "podman generate systemd --name myweb --files --new"
    ],
    en: {
      title: "Question 23: Containers",
      description: "Install podman, pull an apache image, run it as a container named 'myweb' mapping port 8080 to 80, and configure it to start as a systemd user service.",
      category: "Containers",
      explanation: "Use podman for container management and 'podman generate systemd' for service creation. Containers are a modern requirement for RHCSA.",
      tips: ["User services are stored in ~/.config/systemd/user.", "Use 'loginctl enable-linger' for persistence."],
      commandExplanations: [
        "Install the podman container engine.",
        "Download the specific Apache image from the registry.",
        "Run the container in the background with port mapping.",
        "Generate the systemd unit file to manage the container as a service."
      ]
    },
    pt: {
      title: "Questão 23: Containers",
      description: "Instalar podman, baixar uma imagem apache, rodar como container 'myweb' mapeando porta 8080 para 80, e configurar para iniciar como serviço systemd de usuário.",
      category: "Containers",
      explanation: "Use podman para gerenciar containers e 'podman generate systemd' para criar o serviço. Containers são um requisito moderno para o RHCSA.",
      tips: ["Serviços de usuário ficam em ~/.config/systemd/user.", "Use 'loginctl enable-linger' para persistência."],
      commandExplanations: [
        "Instala o motor de containers podman.",
        "Baixa a imagem específica do Apache do registro.",
        "Executa o container em segundo plano com mapeamento de porta.",
        "Gera o arquivo de unidade do systemd para gerenciar o container como um serviço."
      ]
    }
  }
];

export const categories = Array.from(new Set(rhcsaQuestions.flatMap(q => [q.en.category, q.pt.category])));
export const difficulties = ["beginner", "intermediate", "advanced"];

export const studyGuide: StudyGuide = {
  en: [
    {
      id: "intro",
      title: "Exam Overview",
      content: "The RHCSA (EX200) exam is performance-based. You must perform tasks on a live system. Focus on speed and accuracy.",
      keyPoints: ["Duration: 3 hours", "Passing score: 210/300", "No internet access during exam"]
    },
    {
      id: "network",
      title: "Network Configuration",
      content: "You must be able to configure IPv4 addresses, gateways, and DNS using nmcli. Hostname configuration is also essential.",
      keyPoints: ["Use 'nmcli con mod'", "Always 'nmcli con up' after changes", "Verify with 'ip addr'"]
    },
    {
      id: "storage",
      title: "Storage Management",
      content: "LVM and VDO are critical. You'll need to create partitions, volume groups, and logical volumes, then format and mount them persistently.",
      keyPoints: ["PV -> VG -> LV workflow", "fstab entries are mandatory for persistence", "VDO for deduplication"]
    },
    {
      id: "security",
      title: "Security & Permissions",
      content: "SELinux and Firewalld must be active. You'll need to manage ports, services, and file permissions (including ACLs and SGID).",
      keyPoints: ["semanage for SELinux ports", "firewall-cmd --permanent", "chmod 2770 for SGID"]
    },
    {
      id: "containers",
      title: "Containers with Podman",
      content: "Modern RHCSA includes basic container management: pulling images, running containers, and setting them up as systemd services.",
      keyPoints: ["podman pull/run", "podman generate systemd", "Rootless containers"]
    }
  ],
  pt: [
    {
      id: "intro",
      title: "Visão Geral do Exame",
      content: "O exame RHCSA (EX200) é baseado em desempenho. Você deve realizar tarefas em um sistema real. Foque em velocidade e precisão.",
      keyPoints: ["Duração: 3 horas", "Pontuação mínima: 210/300", "Sem acesso à internet durante o exame"]
    },
    {
      id: "network",
      title: "Configuração de Rede",
      content: "Você deve ser capaz de configurar endereços IPv4, gateways e DNS usando o nmcli. A configuração do hostname também é essencial.",
      keyPoints: ["Use 'nmcli con mod'", "Sempre use 'nmcli con up' após mudanças", "Verifique com 'ip addr'"]
    },
    {
      id: "storage",
      title: "Gerenciamento de Armazenamento",
      content: "LVM e VDO são críticos. Você precisará criar partições, grupos de volumes e volumes lógicos, além de formatá-los e montá-los persistentemente.",
      keyPoints: ["Fluxo: PV -> VG -> LV", "Entradas no fstab são obrigatórias para persistência", "VDO para deduplicação"]
    },
    {
      id: "security",
      title: "Segurança e Permissões",
      content: "SELinux e Firewalld devem estar ativos. Você precisará gerenciar portas, serviços e permissões de arquivos (incluindo ACLs e SGID).",
      keyPoints: ["semanage para portas SELinux", "firewall-cmd --permanent", "chmod 2770 for SGID"]
    },
    {
      id: "containers",
      title: "Containers com Podman",
      content: "O RHCSA moderno inclui gerenciamento básico de containers: baixar imagens, rodar containers e configurá-los como serviços systemd.",
      keyPoints: ["podman pull/run", "podman generate systemd", "Containers rootless"]
    }
  ]
};
