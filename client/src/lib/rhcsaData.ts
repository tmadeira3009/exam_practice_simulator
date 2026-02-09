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
  node: "Node 1" | "Node 2";
  difficulty: "beginner" | "intermediate" | "advanced";
  probability: "Essential" | "High" | "Medium";
  version: "RHEL 9" | "RHEL 10" | "Both";
  commands: string[];
  alternatives?: {
    title: { en: string; pt: string };
    commands: string[];
  }[];
  en: QuestionContent;
  pt: QuestionContent;
}

export interface EssentialCommand {
  command: string;
  description: { en: string; pt: string };
  usage: string;
  category: "Storage" | "Network" | "Security" | "System" | "Files";
}

export interface ExamWeight {
  category: string;
  weight: number;
  description: { en: string; pt: string };
}

export const examWeights: ExamWeight[] = [
  {
    category: "Storage (LVM, Partitions, Swap, VDO)",
    weight: 25,
    description: { en: "Critical for system operation. Errors in /etc/fstab can prevent booting.", pt: "Crítico para a operação do sistema. Erros no /etc/fstab podem impedir o boot." }
  },
  {
    category: "Security (SELinux, Firewall, Permissions, ACLs)",
    weight: 20,
    description: { en: "Focus on semanage, firewall-cmd, and setfacl.", pt: "Foco em semanage, firewall-cmd e setfacl." }
  },
  {
    category: "System Recovery (Reset Root Password)",
    weight: 15,
    description: { en: "Essential. If you fail this, you cannot start the exam.", pt: "Essencial. Se falhar aqui, você não consegue começar a prova." }
  },
  {
    category: "User & Group Management",
    weight: 10,
    description: { en: "Basic but mandatory. Includes password policies and nologin shells.", pt: "Básico mas obrigatório. Inclui políticas de senha e shells nologin." }
  },
  {
    category: "Network Configuration",
    weight: 10,
    description: { en: "Static IP, DNS, and Hostname configuration.", pt: "Configuração de IP estático, DNS e Hostname." }
  },
  {
    category: "Containers (Podman)",
    weight: 10,
    description: { en: "Modern RHCSA requirement. Focus on rootless containers and systemd integration.", pt: "Requisito moderno do RHCSA. Foco em containers rootless e integração com systemd." }
  },
  {
    category: "Automation (Cron, Systemd Timers, Scripts)",
    weight: 10,
    description: { en: "Automating tasks and simple shell scripting.", pt: "Automação de tarefas e scripts shell simples." }
  }
];

export const essentialCommands: EssentialCommand[] = [
  // Storage
  {
    command: "lsblk",
    category: "Storage",
    description: { en: "List block devices. Best tool to see partitions and mount points.", pt: "Lista dispositivos de bloco. Melhor ferramenta para ver partições e pontos de montagem." },
    usage: "lsblk -f"
  },
  {
    command: "fdisk / gdisk",
    category: "Storage",
    description: { en: "Partition table manipulators. Use fdisk for MBR/GPT and gdisk for GPT.", pt: "Manipuladores de tabela de partição. Use fdisk para MBR/GPT e gdisk para GPT." },
    usage: "fdisk /dev/sdb"
  },
  {
    command: "pvs / vgs / lvs",
    category: "Storage",
    description: { en: "Display information about Physical Volumes, Volume Groups, and Logical Volumes.", pt: "Exibe informações sobre Volumes Físicos, Grupos de Volume e Volumes Lógicos." },
    usage: "lvs"
  },
  {
    command: "blkid",
    category: "Storage",
    description: { en: "Locate/print block device attributes (UUIDs). Essential for /etc/fstab.", pt: "Localiza/imprime atributos de dispositivos de bloco (UUIDs). Essencial para o /etc/fstab." },
    usage: "blkid /dev/sdb1"
  },
  // Network
  {
    command: "nmcli",
    category: "Network",
    description: { en: "Command-line tool for controlling NetworkManager.", pt: "Ferramenta de linha de comando para controlar o NetworkManager." },
    usage: "nmcli con show"
  },
  {
    command: "nmtui",
    category: "Network",
    description: { en: "Text User Interface for NetworkManager. Easier for IP configuration.", pt: "Interface de usuário em texto para o NetworkManager. Mais fácil para configurar IP." },
    usage: "nmtui"
  },
  {
    command: "hostnamectl",
    category: "Network",
    description: { en: "Control the system hostname.", pt: "Controla o nome de host do sistema." },
    usage: "hostnamectl set-hostname name"
  },
  // Security
  {
    command: "firewall-cmd",
    category: "Security",
    description: { en: "Primary tool for managing the firewall.", pt: "Ferramenta principal para gerenciar o firewall." },
    usage: "firewall-cmd --permanent --add-service=http"
  },
  {
    command: "semanage",
    category: "Security",
    description: { en: "SELinux Policy Management tool. Used for ports and file contexts.", pt: "Ferramenta de gerenciamento de política SELinux. Usada para portas e contextos de arquivos." },
    usage: "semanage port -a -t http_port_t -p tcp 82"
  },
  {
    command: "setfacl / getfacl",
    category: "Security",
    description: { en: "Set and get file Access Control Lists (ACLs).", pt: "Define e obtém Listas de Controle de Acesso (ACLs) de arquivos." },
    usage: "setfacl -m u:john:rw file"
  },
  {
    command: "setenforce",
    category: "Security",
    description: { en: "Set SELinux mode (Enforcing/Permissive).", pt: "Define o modo do SELinux (Enforcing/Permissive)." },
    usage: "setenforce 1"
  },
  // System
  {
    command: "systemctl",
    category: "System",
    description: { en: "Control the systemd system and service manager.", pt: "Controla o sistema systemd e o gerenciador de serviços." },
    usage: "systemctl enable --now httpd"
  },
  {
    command: "journalctl",
    category: "System",
    description: { en: "Query and display logs from journald.", pt: "Consulta e exibe logs do journald." },
    usage: "journalctl -u httpd"
  },
  {
    command: "timedatectl",
    category: "System",
    description: { en: "Control the system time and date.", pt: "Controla a hora e a data do sistema." },
    usage: "timedatectl set-ntp true"
  },
  {
    command: "podman",
    category: "System",
    description: { en: "Tool for managing containers and images.", pt: "Ferramenta para gerenciar containers e imagens." },
    usage: "podman run -d --name web nginx"
  },
  // Files
  {
    command: "tar",
    category: "Files",
    description: { en: "Archiving utility. Supports gzip (-z), bzip2 (-j), and xz (-J).", pt: "Utilitário de arquivamento. Suporta gzip (-z), bzip2 (-j) e xz (-J)." },
    usage: "tar -cvJf backup.tar.xz /dir"
  },
  {
    command: "find",
    category: "Files",
    description: { en: "Search for files in a directory hierarchy.", pt: "Busca por arquivos em uma hierarquia de diretórios." },
    usage: "find / -user emma"
  },
  {
    command: "grep",
    category: "Files",
    description: { en: "Print lines matching a pattern.", pt: "Imprime linhas que coincidem com um padrão." },
    usage: "grep 'error' /var/log/messages"
  }
];

export const rhcsaQuestions: Question[] = [
  {
    id: 1,
    node: "Node 1",
    difficulty: "beginner",
    probability: "Essential",
    version: "Both",
    commands: [
      "nmcli con mod 'Wired connection 1' ipv4.addresses 10.129.203.120/24 ipv4.gateway 10.129.203.112 ipv4.dns 10.129.203.112 ipv4.method manual",
      "nmcli con up 'Wired connection 1'",
      "hostnamectl set-hostname node1.lab.example.com"
    ],
    alternatives: [
      {
        title: { en: "Using NMTUI (Visual Interface)", pt: "Usando NMTUI (Interface Visual)" },
        commands: ["nmtui", "# Siga a interface visual para configurar IP, Gateway e DNS", "hostnamectl set-hostname node1.lab.example.com"]
      }
    ],
    en: {
      title: "Question 1: Network Config (Node 1)",
      description: "Set up static IP (10.129.203.120/24), gateway, DNS (10.129.203.112), and hostname (node1.lab.example.com).",
      category: "Network Configuration",
      explanation: "Use nmcli for network settings or nmtui for a visual interface. In the exam, you must ensure the connection is persistent.",
      tips: ["Check connection name with: nmcli con show", "Verify with: ip addr show", "NMTUI is a great alternative if you forget nmcli syntax."],
      commandExplanations: [
        "Configure the static IP, gateway, and DNS for the specific connection.",
        "Activate the connection to apply the new network settings.",
        "Set the system's persistent hostname."
      ]
    },
    pt: {
      title: "Questão 1: Configuração de Rede (Node 1)",
      description: "Configurar IP estático (10.129.203.120/24), gateway, DNS (10.129.203.112) e hostname (node1.lab.example.com).",
      category: "Configuração de Rede",
      explanation: "Use nmcli para as configurações de rede ou nmtui para uma interface visual. No exame, você deve garantir que a conexão seja persistente.",
      tips: ["Verifique o nome da conexão com: nmcli con show", "Verifique com: ip addr show", "O NMTUI é uma ótima alternativa se você esquecer a sintaxe do nmcli."],
      commandExplanations: [
        "Configura o IP estático, gateway e DNS para a conexão específica.",
        "Ativa a conexão para aplicar as novas configurações de rede.",
        "Define o nome de host (hostname) persistente do sistema."
      ]
    }
  },
  {
    id: 2,
    node: "Node 1",
    difficulty: "beginner",
    probability: "Essential",
    version: "Both",
    commands: [
      "vi /etc/yum.repos.d/exam.repo",
      `[BaseOS]
name=BaseOS
baseurl=file:///mnt/BaseOS
enabled=1
gpgcheck=0

[AppStream]
name=AppStream
baseurl=file:///mnt/AppStream
enabled=1
gpgcheck=0`,
      "yum clean all",
      "yum repolist"
    ],
    alternatives: [
      {
        title: { en: "Using yum-config-manager", pt: "Usando yum-config-manager" },
        commands: [
          "yum-config-manager --add-repo=file:///mnt/BaseOS --name='BaseOS' --enable",
          "yum-config-manager --add-repo=file:///mnt/AppStream --name='AppStream' --enable",
          "yum-config-manager --save --setopt=BaseOS.gpgcheck=0",
          "yum-config-manager --save --setopt=AppStream.gpgcheck=0",
          "yum repolist"
        ]
      }
    ],
    en: {
      title: "Question 2: Repositories (Node 1)",
      description: "Set up BaseOS and AppStream repositories using local paths (file:///mnt/BaseOS and file:///mnt/AppStream).",
      category: "System Configuration",
      explanation: "Repositories are essential for installing packages. You can create the .repo file manually or use yum-config-manager.",
      tips: ["Ensure the mount point /mnt exists and is mounted.", "Check for typos in the baseurl.", "GPG check is often disabled (0) in local repos for simplicity."],
      commandExplanations: [
        "Open a new repository file in the correct directory.",
        "Define the BaseOS and AppStream sections with correct paths.",
        "Clear the yum cache to recognize the new repo.",
        "List available repositories to verify success."
      ]
    },
    pt: {
      title: "Questão 2: Repositórios (Node 1)",
      description: "Configurar repositórios BaseOS e AppStream usando caminhos locais (file:///mnt/BaseOS e file:///mnt/AppStream).",
      category: "Configuração do Sistema",
      explanation: "Repositórios são essenciais para instalar pacotes. Você pode criar o arquivo .repo manualmente ou usar o yum-config-manager.",
      tips: ["Certifique-se de que o ponto de montagem /mnt existe e está montado.", "Verifique erros de digitação na baseurl.", "O GPG check geralmente é desativado (0) em repositórios locais por simplicidade."],
      commandExplanations: [
        "Abre um novo arquivo de repositório no diretório correto.",
        "Define as seções BaseOS e AppStream com os caminhos corretos.",
        "Limpa o cache do yum para reconhecer o novo repositório.",
        "Lista os repositórios disponíveis para verificar o sucesso."
      ]
    }
  },
  {
    id: 3,
    node: "Node 1",
    difficulty: "intermediate",
    probability: "High",
    version: "Both",
    commands: [
      "systemctl enable --now httpd",
      "firewall-cmd --permanent --add-service=http",
      "firewall-cmd --reload",
      "semanage fcontext -a -t httpd_sys_content_t '/custom(/.*)?'",
      "restorecon -Rv /custom",
      "curl http://localhost"
    ],
    en: {
      title: "Question 3: SELinux & Firewall (Node 1)",
      description: "Enable httpd, allow it in the firewall, and set the correct SELinux context for a custom directory /custom.",
      category: "Security",
      explanation: "This combines service management, firewall rules, and SELinux file contexts.",
      tips: ["Always use --permanent with firewall-cmd.", "Don't forget to reload the firewall.", "Use restorecon after semanage fcontext."],
      commandExplanations: [
        "Enable and start the Apache service.",
        "Allow HTTP traffic through the firewall permanently.",
        "Reload the firewall to apply changes.",
        "Add a new SELinux file context rule for the custom directory.",
        "Apply the new context to the files and directories.",
        "Verify the service is accessible locally."
      ]
    },
    pt: {
      title: "Questão 3: SELinux e Firewall (Node 1)",
      description: "Habilitar o httpd, permiti-lo no firewall e definir o contexto SELinux correto para um diretório personalizado /custom.",
      category: "Segurança",
      explanation: "Isso combina gerenciamento de serviços, regras de firewall e contextos de arquivos SELinux.",
      tips: ["Sempre use --permanent com o firewall-cmd.", "Não esqueça de recarregar o firewall.", "Use o restorecon após o semanage fcontext."],
      commandExplanations: [
        "Habilita e inicia o serviço Apache.",
        "Permite o tráfego HTTP através do firewall permanentemente.",
        "Recarrega o firewall para aplicar as alterações.",
        "Adiciona uma nova regra de contexto de arquivo SELinux para o diretório personalizado.",
        "Aplica o novo contexto aos arquivos e diretórios.",
        "Verifica se o serviço está acessível localmente."
      ]
    }
  },
  {
    id: 4,
    node: "Node 1",
    difficulty: "intermediate",
    probability: "High",
    version: "Both",
    commands: [
      "groupadd sysadmin",
      "useradd -G sysadmin natasha",
      "useradd -G sysadmin harry",
      "useradd -s /sbin/nologin sarah",
      "echo 'password' | passwd --stdin natasha",
      "echo 'password' | passwd --stdin harry",
      "echo 'password' | passwd --stdin sarah"
    ],
    en: {
      title: "Question 4: User Management (Node 1)",
      description: "Create group 'sysadmin', add users 'natasha' and 'harry' to it, and create user 'sarah' with no login shell.",
      category: "User Management",
      explanation: "Managing users, groups, and shells is a core RHCSA task.",
      tips: ["Use -G for secondary groups.", "Use -s to specify the shell.", "Verify with: id username or grep username /etc/passwd."],
      commandExplanations: [
        "Create the required group.",
        "Create user natasha and add to sysadmin group.",
        "Create user harry and add to sysadmin group.",
        "Create user sarah with a non-interactive shell.",
        "Set password for natasha.",
        "Set password for harry.",
        "Set password for sarah."
      ]
    },
    pt: {
      title: "Questão 4: Gerenciamento de Usuários (Node 1)",
      description: "Criar o grupo 'sysadmin', adicionar os usuários 'natasha' e 'harry' a ele, e criar a usuária 'sarah' sem shell de login.",
      category: "Gerenciamento de Usuários",
      explanation: "Gerenciar usuários, grupos e shells é uma tarefa central do RHCSA.",
      tips: ["Use -G para grupos secundários.", "Use -s para especificar o shell.", "Verifique com: id username ou grep username /etc/passwd."],
      commandExplanations: [
        "Cria o grupo solicitado.",
        "Cria a usuária natasha e a adiciona ao grupo sysadmin.",
        "Cria o usuário harry e o adiciona ao grupo sysadmin.",
        "Cria a usuária sarah com um shell não interativo.",
        "Define a senha para natasha.",
        "Define a senha para harry.",
        "Define a senha para sarah."
      ]
    }
  },
  {
    id: 5,
    node: "Node 2",
    difficulty: "advanced",
    probability: "High",
    version: "Both",
    commands: [
      "yum install nfs-utils -y",
      "mkdir -p /rhome/remoteuser18",
      "chown -R nobody:nobody /rhome",
      "chcon -R -t nfs_t /rhome/",
      "systemctl enable --now nfs-server",
      "vi /etc/exports",
      "/rhome *(rw,sync)",
      "firewall-cmd --permanent --add-service={nfs,mountd,rpc-bind}",
      "firewall-cmd --reload",
      "exportfs -rv"
    ],
    en: {
      title: "Question 5: NFS Server Setup (Node 2)",
      description: "Prepare Node 2 as an NFS server. Export /rhome for practice.",
      category: "Storage",
      explanation: "This task prepares the environment for the AutoFS client task on Node 1.",
      tips: ["Ensure SELinux context nfs_t is applied.", "Check exports with exportfs -v.", "Firewall must allow nfs, mountd, and rpc-bind."],
      commandExplanations: [
        "Install NFS server utilities.",
        "Create the directory to be exported.",
        "Set permissions so remote users can write.",
        "Set SELinux context for NFS sharing.",
        "Start and enable the NFS server service.",
        "Open the exports configuration file.",
        "Add the export rule for the directory.",
        "Allow NFS services through the firewall.",
        "Reload firewall settings.",
        "Apply and verify the exported directories."
      ]
    },
    pt: {
      title: "Questão 5: Configuração do Servidor NFS (Node 2)",
      description: "Preparar o Node 2 como um servidor NFS. Exportar /rhome para prática.",
      category: "Armazenamento",
      explanation: "Esta tarefa prepara o ambiente para a tarefa do cliente AutoFS no Node 1.",
      tips: ["Garanta que o contexto SELinux nfs_t seja aplicado.", "Verifique os exports com exportfs -v.", "O firewall deve permitir nfs, mountd e rpc-bind."],
      commandExplanations: [
        "Instala os utilitários do servidor NFS.",
        "Cria o diretório a ser exportado.",
        "Define permissões para que usuários remotos possam escrever.",
        "Define o contexto SELinux para compartilhamento NFS.",
        "Inicia e habilita o serviço do servidor NFS.",
        "Abre o arquivo de configuração de exports.",
        "Adiciona a regra de exportação para o diretório.",
        "Permite os serviços NFS através do firewall.",
        "Recarrega as configurações do firewall.",
        "Aplica e verifica os diretórios exportados."
      ]
    }
  },
  {
    id: 6,
    node: "Node 1",
    difficulty: "advanced",
    probability: "High",
    version: "Both",
    commands: [
      "yum install autofs nfs-utils -y",
      "vi /etc/auto.master",
      "/rhome /etc/auto.misc",
      "vi /etc/auto.misc",
      "remoteuser18 -fstype=nfs,rw,sync 192.168.76.136:/rhome/remoteuser18",
      "systemctl enable --now autofs",
      "cd /rhome/remoteuser18",
      "df -h"
    ],
    en: {
      title: "Question 6: AutoFS Client (Node 1)",
      description: "Configure AutoFS to automatically mount remoteuser18's home directory from Node 2.",
      category: "Storage",
      explanation: "AutoFS is used for on-demand mounting of network shares.",
      tips: ["Master map file is /etc/auto.master.", "The mount happens when you access the directory.", "Verify with df -h after entering the directory."],
      commandExplanations: [
        "Install AutoFS and NFS client tools.",
        "Open the master map file.",
        "Add the mapping for /rhome using auto.misc.",
        "Open the map file for the shares.",
        "Define the share name, options, and remote source.",
        "Start and enable the AutoFS service.",
        "Access the directory to trigger the mount.",
        "Verify the mount point and filesystem type."
      ]
    },
    pt: {
      title: "Questão 6: Cliente AutoFS (Node 1)",
      description: "Configurar o AutoFS para montar automaticamente o diretório home do remoteuser18 a partir do Node 2.",
      category: "Armazenamento",
      explanation: "O AutoFS é usado para montagem sob demanda de compartilhamentos de rede.",
      tips: ["O arquivo de mapa mestre é /etc/auto.master.", "A montagem ocorre quando você acessa o diretório.", "Verifique com df -h após entrar no diretório."],
      commandExplanations: [
        "Instala o AutoFS e as ferramentas de cliente NFS.",
        "Abre o arquivo de mapa mestre.",
        "Adiciona o mapeamento para /rhome usando o auto.misc.",
        "Abre o arquivo de mapa para os compartilhamentos.",
        "Define o nome do compartilhamento, opções e origem remota.",
        "Inicia e habilita o serviço AutoFS.",
        "Acessa o diretório para disparar a montagem.",
        "Verifica o ponto de montagem e o tipo de sistema de arquivos."
      ]
    }
  },
  {
    id: 7,
    node: "Node 1",
    difficulty: "beginner",
    probability: "High",
    version: "Both",
    commands: [
      "vi /etc/chrony.conf",
      "server classroom.example.com iburst",
      "systemctl restart chronyd",
      "chronyc sources -v"
    ],
    en: {
      title: "Question 7: NTP Client (Node 1)",
      description: "Configure your system as an NTP client of classroom.example.com.",
      category: "System Configuration",
      explanation: "Time synchronization is critical for logs and network services.",
      tips: ["Use chrony (default in RHEL 8/9/10).", "The 'iburst' option speeds up initial sync.", "Verify with chronyc sources."],
      commandExplanations: [
        "Open the chrony configuration file.",
        "Add the server line for the NTP source.",
        "Restart the service to apply changes.",
        "Verify the synchronization status and sources."
      ]
    },
    pt: {
      title: "Questão 7: Cliente NTP (Node 1)",
      description: "Configurar seu sistema como um cliente NTP do classroom.example.com.",
      category: "Configuração do Sistema",
      explanation: "A sincronização de tempo é crítica para logs e serviços de rede.",
      tips: ["Use o chrony (padrão no RHEL 8/9/10).", "A opção 'iburst' acelera a sincronização inicial.", "Verifique com chronyc sources."],
      commandExplanations: [
        "Abre o arquivo de configuração do chrony.",
        "Adiciona a linha do servidor para a origem NTP.",
        "Reinicia o serviço para aplicar as alterações.",
        "Verifica o status da sincronização e as origens."
      ]
    }
  },
  {
    id: 8,
    node: "Node 1",
    difficulty: "intermediate",
    probability: "High",
    version: "Both",
    commands: [
      "mkdir -p /root/find.user",
      "find / -user michael -exec cp -rp {} /root/find.user/ \\;",
      "ls -l /root/find.user"
    ],
    alternatives: [
      {
        title: { en: "Alternative for user Emma with verbose copy", pt: "Alternativa para usuária Emma com cópia detalhada" },
        commands: ["find / -user emma -exec cp -pvf {} /root/find.user/ \\;"]
      }
    ],
    en: {
      title: "Question 8: Find and Copy (Node 1)",
      description: "Locate all files owned by michael and copy them to /root/find.user.",
      category: "Filesystem",
      explanation: "Using find with -exec is a powerful way to process search results.",
      tips: ["Use -rp with cp to preserve permissions and copy directories.", "The {} is a placeholder for the found file.", "The \\; terminates the -exec command."],
      commandExplanations: [
        "Create the destination directory.",
        "Find files by owner and execute the copy command for each.",
        "Verify the copied files."
      ]
    },
    pt: {
      title: "Questão 8: Localizar e Copiar (Node 1)",
      description: "Localizar todos os arquivos pertencentes ao michael e copiá-los para /root/find.user.",
      category: "Sistema de Arquivos",
      explanation: "Usar o find com -exec é uma maneira poderosa de processar resultados de busca.",
      tips: ["Use -rp com o cp para preservar permissões e copiar diretórios.", "O {} é um espaço reservado para o arquivo encontrado.", "O \\; termina o comando -exec."],
      commandExplanations: [
        "Cria o diretório de destino.",
        "Busca arquivos por proprietário e executa o comando de cópia para cada um.",
        "Verifica os arquivos copiados."
      ]
    }
  },
  {
    id: 9,
    node: "Node 1",
    difficulty: "beginner",
    probability: "Medium",
    version: "Both",
    commands: [
      "grep 'seismic' /usr/share/dict/words > /root/lines.txt"
    ],
    en: {
      title: "Question 9: Grep String (Node 1)",
      description: "Find all lines containing 'seismic' in /usr/share/dict/words and save to /root/lines.txt.",
      category: "Filesystem",
      explanation: "Grep is the standard tool for searching text within files.",
      tips: ["Use > to overwrite or >> to append.", "Check the output file with cat or less."],
      commandExplanations: [
        "Search for the string and redirect the output to a file."
      ]
    },
    pt: {
      title: "Questão 9: Grep de String (Node 1)",
      description: "Encontrar todas as linhas que contenham 'seismic' em /usr/share/dict/words e salvar em /root/lines.txt.",
      category: "Sistema de Arquivos",
      explanation: "O grep é a ferramenta padrão para buscar texto dentro de arquivos.",
      tips: ["Use > para sobrescrever ou >> para anexar.", "Verifique o arquivo de saída com cat ou less."],
      commandExplanations: [
        "Busca pela string e redireciona a saída para um arquivo."
      ]
    }
  },
  {
    id: 10,
    node: "Node 1",
    difficulty: "beginner",
    probability: "Medium",
    version: "Both",
    commands: [
      "useradd -u 2000 manuka",
      "echo 'password' | passwd --stdin manuka",
      "id manuka"
    ],
    en: {
      title: "Question 10: Create User with UID (Node 1)",
      description: "Create user 'manuka' with UID 2000.",
      category: "User Management",
      explanation: "Specifying a UID is common when synchronizing users across systems.",
      tips: ["Use -u to set the UID.", "Verify with the id command."],
      commandExplanations: [
        "Create the user with the specific ID.",
        "Set the user's password.",
        "Verify the user's ID and groups."
      ]
    },
    pt: {
      title: "Questão 10: Criar Usuário com UID (Node 1)",
      description: "Criar o usuário 'manuka' com o UID 2000.",
      category: "Gerenciamento de Usuários",
      explanation: "Especificar um UID é comum ao sincronizar usuários entre sistemas.",
      tips: ["Use -u para definir o UID.", "Verifique com o comando id."],
      commandExplanations: [
        "Cria o usuário com o ID específico.",
        "Define a senha do usuário.",
        "Verifica o ID e os grupos do usuário."
      ]
    }
  },
  {
    id: 11,
    node: "Node 1",
    difficulty: "intermediate",
    probability: "High",
    version: "Both",
    commands: [
      "mkdir /home/managers",
      "chgrp sysadmin /home/managers",
      "chmod 770 /home/managers",
      "chmod g+s /home/managers",
      "setfacl -m u:natasha:rwx /home/managers",
      "setfacl -m u:harry:--- /home/managers"
    ],
    en: {
      title: "Question 11: Permissions & ACLs (Node 1)",
      description: "Set up /home/managers with group 'sysadmin', 770 permissions, SGID, and specific ACLs for natasha and harry.",
      category: "Security",
      explanation: "This covers standard permissions, special bits (SGID), and Access Control Lists.",
      tips: ["SGID (g+s) ensures new files inherit the group.", "ACLs provide more granular control than standard permissions.", "Use getfacl to verify."],
      commandExplanations: [
        "Create the directory.",
        "Change the group ownership.",
        "Set standard permissions (rwxrwx---).",
        "Set the SGID bit.",
        "Give natasha full access via ACL.",
        "Deny harry all access via ACL."
      ]
    },
    pt: {
      title: "Questão 11: Permissões e ACLs (Node 1)",
      description: "Configurar /home/managers com o grupo 'sysadmin', permissões 770, SGID e ACLs específicas para natasha e harry.",
      category: "Segurança",
      explanation: "Isso cobre permissões padrão, bits especiais (SGID) e Listas de Controle de Acesso.",
      tips: ["O SGID (g+s) garante que novos arquivos herdem o grupo.", "ACLs oferecem controle mais granular que as permissões padrão.", "Use getfacl para verificar."],
      commandExplanations: [
        "Cria o diretório.",
        "Altera o grupo proprietário.",
        "Define as permissões padrão (rwxrwx---).",
        "Define o bit SGID.",
        "Dá acesso total à natasha via ACL.",
        "Nega todo o acesso ao harry via ACL."
      ]
    }
  },
  {
    id: 12,
    node: "Node 1",
    difficulty: "intermediate",
    probability: "Medium",
    version: "Both",
    commands: [
      "vi ~/.bashrc",
      "umask 027",
      "source ~/.bashrc",
      "umask"
    ],
    en: {
      title: "Question 12: Umask Configuration (Node 1)",
      description: "Set the default umask to 027 for the current user persistently.",
      category: "User Management",
      explanation: "Umask defines the default permissions for new files and directories.",
      tips: ["027 means: Files (640), Dirs (750).", "Add to .bashrc for persistence.", "Verify with the umask command."],
      commandExplanations: [
        "Open the user's bash configuration file.",
        "Add the umask setting.",
        "Reload the configuration.",
        "Verify the current umask value."
      ]
    },
    pt: {
      title: "Questão 12: Configuração de Umask (Node 1)",
      description: "Definir o umask padrão como 027 para o usuário atual de forma persistente.",
      category: "Gerenciamento de Usuários",
      explanation: "O umask define as permissões padrão para novos arquivos e diretórios.",
      tips: ["027 significa: Arquivos (640), Diretorios (750).", "Adicione ao .bashrc para persistência.", "Verifique com o comando umask."],
      commandExplanations: [
        "Abre o arquivo de configuração bash do usuário.",
        "Adiciona a configuração do umask.",
        "Recarrega a configuração.",
        "Verifica o valor atual do umask."
      ]
    }
  },
  {
    id: 13,
    node: "Node 1",
    difficulty: "advanced",
    probability: "High",
    version: "Both",
    commands: [
      "yum install mod_lookup_identity -y",
      "vi /usr/local/bin/log_capture",
      `#!/bin/bash
# Simple script to list /tmp
mkdir -p /root/log_output
find /tmp > /root/log_output/system_logs.trc`,
      "chmod +x /usr/local/bin/log_capture",
      "vi /etc/systemd/system/log_capture.service",
      `[Unit]
Description=Log Capture Service

[Service]
ExecStart=/usr/local/bin/log_capture

[Install]
WantedBy=multi-user.target`,
      "vi /etc/systemd/system/log_capture.timer",
      `[Unit]
Description=Run Log Capture every minute

[Timer]
OnCalendar=*:0/1
Unit=log_capture.service

[Install]
WantedBy=timers.target`,
      "systemctl daemon-reload",
      "systemctl enable --now log_capture.timer",
      "systemctl list-timers",
      "cat /root/log_output/system_logs.trc"
    ],
    en: {
      title: "Question 13: Systemd Automation (Node 1)",
      description: "Create a script, a systemd service, and a timer to run every minute.",
      category: "Automation",
      explanation: "Systemd timers are the modern alternative to cron jobs.",
      tips: ["Ensure the script is executable.", "Reload systemd after creating unit files.", "Use OnCalendar=*:0/1 for every minute."],
      commandExplanations: [
        "Install the requested package.",
        "Create the script file.",
        "Add the script content (shebang and commands).",
        "Make the script executable.",
        "Create the service unit file.",
        "Define the service to run the script.",
        "Create the timer unit file.",
        "Set the timer to trigger every minute.",
        "Reload systemd to recognize new units.",
        "Enable and start the timer.",
        "Verify the timer is active.",
        "Check the output file."
      ]
    },
    pt: {
      title: "Questão 13: Automação com Systemd (Node 1)",
      description: "Criar um script, um serviço systemd e um timer para rodar a cada minuto.",
      category: "Automação",
      explanation: "Timers do systemd são a alternativa moderna aos jobs do cron.",
      tips: ["Garanta que o script seja executável.", "Recarregue o systemd após criar arquivos de unidade.", "Use OnCalendar=*:0/1 para cada minuto."],
      commandExplanations: [
        "Instala o pacote solicitado.",
        "Cria o arquivo do script.",
        "Adiciona o conteúdo do script (shebang e comandos).",
        "Torna o script executável.",
        "Cria o arquivo de unidade do serviço.",
        "Define o serviço para rodar o script.",
        "Cria o arquivo de unidade do timer.",
        "Define o timer para disparar a cada minuto.",
        "Recarrega o systemd para reconhecer as novas unidades.",
        "Habilita e inicia o timer.",
        "Verifica se o timer está ativo.",
        "Verifica o arquivo de saída."
      ]
    }
  },
  {
    id: 14,
    node: "Node 1",
    difficulty: "intermediate",
    probability: "Medium",
    version: "Both",
    commands: [
      "tar -cvzf /root/backup.tar.gz /usr/local",
      "tar -tvf /root/backup.tar.gz"
    ],
    en: {
      title: "Question 14: Archiving (Node 1)",
      description: "Create a compressed tarball of /usr/local and save it to /root/backup.tar.gz.",
      category: "Filesystem",
      explanation: "Archiving is essential for backups and data transfer.",
      tips: ["-c: create, -v: verbose, -z: gzip, -f: file.", "Use -j for bzip2 and -J for xz.", "Verify content with -t."],
      commandExplanations: [
        "Create the compressed archive.",
        "List the contents to verify."
      ]
    },
    pt: {
      title: "Questão 14: Arquivamento (Node 1)",
      description: "Criar um tarball compactado de /usr/local e salvá-lo em /root/backup.tar.gz.",
      category: "Sistema de Arquivos",
      explanation: "O arquivamento é essencial para backups e transferência de dados.",
      tips: ["-c: criar, -v: detalhado, -z: gzip, -f: arquivo.", "Use -j para bzip2 e -J para xz.", "Verifique o conteúdo com -t."],
      commandExplanations: [
        "Cria o arquivo compactado.",
        "Lista o conteúdo para verificar."
      ]
    }
  },
  {
    id: 15,
    node: "Node 1",
    difficulty: "intermediate",
    probability: "High",
    version: "Both",
    commands: [
      "yum install tuned -y",
      "systemctl enable --now tuned",
      "tuned-adm profile virtual-guest",
      "tuned-adm active"
    ],
    en: {
      title: "Question 15: Tuned Profile (Node 1)",
      description: "Install tuned and set the active profile to 'virtual-guest'.",
      category: "System Configuration",
      explanation: "Tuned optimizes the system for specific workloads.",
      tips: ["Check available profiles with: tuned-adm list.", "The profile name must match exactly.", "Verify with: tuned-adm active."],
      commandExplanations: [
        "Install the tuned package.",
        "Start and enable the service.",
        "Apply the specific profile.",
        "Verify the active profile."
      ]
    },
    pt: {
      title: "Questão 15: Perfil Tuned (Node 1)",
      description: "Instalar o tuned e definir o perfil ativo como 'virtual-guest'.",
      category: "Configuração do Sistema",
      explanation: "O Tuned otimiza o sistema para cargas de trabalho específicas.",
      tips: ["Verifique perfis disponíveis com: tuned-adm list.", "O nome do perfil deve coincidir exatamente.", "Verifique com: tuned-adm active."],
      commandExplanations: [
        "Instala o pacote tuned.",
        "Inicia e habilita o serviço.",
        "Aplica o perfil específico.",
        "Verifica o perfil ativo."
      ]
    }
  },
  {
    id: 16,
    node: "Node 1",
    difficulty: "advanced",
    probability: "High",
    version: "Both",
    commands: [
      "podman pull nginx",
      "podman run -d --name web-server -p 8080:80 nginx",
      "mkdir -p ~/.config/systemd/user",
      "podman generate systemd --name web-server --files --restart-policy=always",
      "mv container-web-server.service ~/.config/systemd/user/",
      "systemctl --user daemon-reload",
      "systemctl --user enable --now container-web-server.service",
      "loginctl enable-linger student"
    ],
    en: {
      title: "Question 16: Containers (Node 1)",
      description: "Run an nginx container as user 'student' and configure it as a systemd user service.",
      category: "Containers",
      explanation: "Rootless containers are a major focus of the modern RHCSA.",
      tips: ["Use loginctl enable-linger to keep user services running after logout.", "Generate systemd files with podman generate systemd.", "User services go in ~/.config/systemd/user/."],
      commandExplanations: [
        "Download the container image.",
        "Run the container with port mapping.",
        "Create the user systemd directory.",
        "Generate the systemd unit file for the container.",
        "Move the unit file to the correct location.",
        "Reload the user systemd manager.",
        "Enable and start the container service.",
        "Ensure the service persists after logout."
      ]
    },
    pt: {
      title: "Questão 16: Containers (Node 1)",
      description: "Rodar um container nginx como usuário 'student' e configurá-lo como um serviço de usuário do systemd.",
      category: "Containers",
      explanation: "Containers rootless são um grande foco do RHCSA moderno.",
      tips: ["Use loginctl enable-linger para manter serviços de usuário rodando após o logout.", "Gere arquivos systemd com podman generate systemd.", "Serviços de usuário ficam em ~/.config/systemd/user/."],
      commandExplanations: [
        "Baixa a imagem do container.",
        "Roda o container com mapeamento de porta.",
        "Cria o diretório systemd do usuário.",
        "Gera o arquivo de unidade systemd para o container.",
        "Move o arquivo de unidade para o local correto.",
        "Recarrega o gerenciador systemd do usuário.",
        "Habilita e inicia o serviço do container.",
        "Garante que o serviço persista após o logout."
      ]
    }
  },
  {
    id: 17,
    node: "Node 1",
    difficulty: "advanced",
    probability: "Essential",
    version: "Both",
    commands: [
      "Reboot the system",
      "Press 'e' at the GRUB menu",
      "Find the line starting with 'linux' and add 'rw init=/bin/bash' at the end",
      "Press Ctrl+X to boot",
      "passwd root",
      "touch /.autorelabel",
      "exec /sbin/init"
    ],
    en: {
      title: "Question 17: Reset Root Password (Node 1)",
      description: "Reset the root password when you don't have access.",
      category: "System Recovery",
      explanation: "This is the first task of the exam. If you can't do this, you can't proceed.",
      tips: ["Be careful with the GRUB editor.", "Don't forget /.autorelabel for SELinux.", "Use 'rw' to mount the root filesystem as writable."],
      commandExplanations: [
        "Restart the machine.",
        "Enter edit mode for the boot entry.",
        "Modify the kernel parameters to drop into a bash shell.",
        "Boot with the modified parameters.",
        "Change the root password.",
        "Trigger SELinux relabeling on next boot.",
        "Resume normal boot process."
      ]
    },
    pt: {
      title: "Questão 17: Redefinir Senha Root (Node 1)",
      description: "Redefinir a senha do root quando você não tem acesso.",
      category: "Recuperação do Sistema",
      explanation: "Esta é a primeira tarefa do exame. Se você não conseguir fazer isso, não poderá prosseguir.",
      tips: ["Tenha cuidado com o editor do GRUB.", "Não esqueça o /.autorelabel para o SELinux.", "Use 'rw' para montar o sistema de arquivos raiz como gravável."],
      commandExplanations: [
        "Reinicia a máquina.",
        "Entra no modo de edição para a entrada de boot.",
        "Modifica os parâmetros do kernel para cair em um shell bash.",
        "Inicia o boot com os parâmetros modificados.",
        "Altera a senha do root.",
        "Dispara a rotulagem do SELinux no próximo boot.",
        "Retoma o processo normal de boot."
      ]
    }
  },
  {
    id: 18,
    node: "Node 1",
    difficulty: "intermediate",
    probability: "High",
    version: "Both",
    commands: [
      "fdisk /dev/sdb",
      "n -> p -> 1 -> Enter -> +756M -> t -> 82 -> w",
      "mkswap /dev/sdb1",
      "vi /etc/fstab",
      "/dev/sdb1 swap swap defaults 0 0",
      "swapon -a",
      "swapon -s"
    ],
    en: {
      title: "Question 18: Swap Partition (Node 1)",
      description: "Add a 756 MiB swap partition to /dev/sdb and make it persistent.",
      category: "Storage",
      explanation: "Swap provides virtual memory on disk.",
      tips: ["Partition type for swap is 82 (Linux swap).", "Always verify with swapon -s.", "Errors in /etc/fstab will break the boot."],
      commandExplanations: [
        "Open the disk in fdisk.",
        "Sequence: New -> Primary -> 1 -> Default Start -> +756M Size -> Type -> 82 -> Write.",
        "Format the partition as swap.",
        "Open the filesystem table.",
        "Add the persistent mount entry.",
        "Activate all swap partitions from fstab.",
        "Verify active swap space."
      ]
    },
    pt: {
      title: "Questão 18: Partição Swap (Node 1)",
      description: "Adicionar uma partição swap de 756 MiB ao /dev/sdb e torná-la persistente.",
      category: "Armazenamento",
      explanation: "O swap fornece memória virtual no disco.",
      tips: ["O tipo de partição para swap é 82 (Linux swap).", "Sempre verifique com swapon -s.", "Erros no /etc/fstab quebrarão o boot."],
      commandExplanations: [
        "Abre o disco no fdisk.",
        "Sequência: Novo -> Primário -> 1 -> Início Padrão -> Tamanho +756M -> Tipo -> 82 -> Gravar.",
        "Formata a partição como swap.",
        "Abre a tabela de sistemas de arquivos.",
        "Adiciona a entrada de montagem persistente.",
        "Ativa todas as partições swap do fstab.",
        "Verifica o espaço swap ativo."
      ]
    }
  },
  {
    id: 19,
    node: "Node 1",
    difficulty: "advanced",
    probability: "High",
    version: "Both",
    commands: [
      "fdisk /dev/sdb",
      "n -> p -> 2 -> Enter -> +2G -> t -> 2 -> 8e -> w",
      "pvcreate /dev/sdb2",
      "vgcreate -s 16M research /dev/sdb2",
      "lvcreate -n data -l 100 research",
      "mkfs.ext4 /dev/research/data",
      "mkdir /mnt/data",
      "vi /etc/fstab",
      "/dev/research/data /mnt/data ext4 defaults 0 0",
      "mount -a",
      "df -h"
    ],
    en: {
      title: "Question 19: LVM Configuration (Node 1)",
      description: "Create a VG 'research' with 16MB PE, and an LV 'data' with 100 extents. Mount on /mnt/data.",
      category: "Storage",
      explanation: "LVM allows flexible disk management. PE size and extent count are common exam requirements.",
      tips: ["PE size is set with vgcreate -s.", "LV size in extents is set with lvcreate -l.", "100 extents * 16MB = 1600MB."],
      commandExplanations: [
        "Create a new partition for LVM.",
        "Sequence: New -> Primary -> 2 -> Default Start -> +2G -> Type -> 2 -> 8e (LVM) -> Write.",
        "Initialize the physical volume.",
        "Create the volume group with specific Physical Extent size.",
        "Create the logical volume using a specific number of extents.",
        "Format with ext4 filesystem.",
        "Create the mount point.",
        "Open fstab for persistent mounting.",
        "Add the LVM mount entry.",
        "Mount all filesystems.",
        "Verify the new storage."
      ]
    },
    pt: {
      title: "Questão 19: Configuração de LVM (Node 1)",
      description: "Criar um VG 'research' com PE de 16MB, e um LV 'data' com 100 extents. Montar em /mnt/data.",
      category: "Armazenamento",
      explanation: "O LVM permite gerenciamento flexível de disco. O tamanho do PE e a contagem de extents são requisitos comuns de exame.",
      tips: ["O tamanho do PE é definido com vgcreate -s.", "O tamanho do LV em extents é definido com lvcreate -l.", "100 extents * 16MB = 1600MB."],
      commandExplanations: [
        "Cria uma nova partição para o LVM.",
        "Sequência: Novo -> Primário -> 2 -> Início Padrão -> Tamanho +2G -> Tipo -> 2 -> 8e (LVM) -> Gravar.",
        "Inicializa o volume físico.",
        "Cria o grupo de volumes com tamanho de Physical Extent específico.",
        "Cria o volume lógico usando um número específico de extents.",
        "Formata com o sistema de arquivos ext4.",
        "Cria o ponto de montagem.",
        "Abre o fstab para montagem persistente.",
        "Adiciona a entrada de montagem do LVM.",
        "Monta todos os sistemas de arquivos.",
        "Verifica o novo armazenamento."
      ]
    }
  },
  {
    id: 20,
    node: "Node 1",
    difficulty: "intermediate",
    probability: "High",
    version: "Both",
    commands: [
      "lvextend -L 230M /dev/research/data",
      "resize2fs /dev/research/data",
      "df -h"
    ],
    en: {
      title: "Question 20: Resize LVM (Node 1)",
      description: "Resize the logical volume 'data' and its filesystem to 230 MiB.",
      category: "Storage",
      explanation: "Extending LVM is a non-destructive process if done correctly.",
      tips: ["Use -L to specify the final size.", "Use resize2fs for ext4 or xfs_growfs for xfs.", "You can use -r with lvextend to resize the filesystem automatically."],
      commandExplanations: [
        "Extend the logical volume to the new size.",
        "Resize the ext4 filesystem to fill the new space.",
        "Verify the new size."
      ]
    },
    pt: {
      title: "Questão 20: Redimensionar LVM (Node 1)",
      description: "Redimensionar o volume lógico 'data' e seu sistema de arquivos para 230 MiB.",
      category: "Armazenamento",
      explanation: "Estender o LVM é um processo não destrutivo se feito corretamente.",
      tips: ["Use -L para especificar o tamanho final.", "Use resize2fs para ext4 ou xfs_growfs para xfs.", "Você pode usar -r com lvextend para redimensionar o sistema de arquivos automaticamente."],
      commandExplanations: [
        "Estende o volume lógico para o novo tamanho.",
        "Redimensiona o sistema de arquivos ext4 para preencher o novo espaço.",
        "Verifica o novo tamanho."
      ]
    }
  },
  {
    id: 21,
    node: "Node 1",
    difficulty: "intermediate",
    probability: "Medium",
    version: "Both",
    commands: [
      "yum install vdo kmod-kvdo -y",
      "vdo create --name=vdo-data --device=/dev/sdc --vdoLogicalSize=50G",
      "mkfs.xfs -K /dev/mapper/vdo-data",
      "mkdir /mnt/vdo",
      "vi /etc/fstab",
      "/dev/mapper/vdo-data /mnt/vdo xfs defaults,x-systemd.requires=vdo.service 0 0",
      "mount -a"
    ],
    en: {
      title: "Question 21: VDO Storage (Node 1)",
      description: "Create a VDO volume named 'vdo-data' on /dev/sdc with 50G logical size. Mount on /mnt/vdo.",
      category: "Storage",
      explanation: "VDO provides deduplication and compression.",
      tips: ["VDO is deprecated in RHEL 9 (replaced by LVM-VDO).", "Always use x-systemd.requires=vdo.service in fstab.", "Use -K with mkfs.xfs to speed up formatting."],
      commandExplanations: [
        "Install VDO packages.",
        "Create the VDO volume with thin provisioning.",
        "Format with XFS, skipping block discarding.",
        "Create mount point.",
        "Open fstab.",
        "Add persistent mount with systemd dependency.",
        "Mount the volume."
      ]
    },
    pt: {
      title: "Questão 21: Armazenamento VDO (Node 1)",
      description: "Criar um volume VDO chamado 'vdo-data' no /dev/sdc com tamanho lógico de 50G. Montar em /mnt/vdo.",
      category: "Armazenamento",
      explanation: "O VDO fornece desduplicação e compactação.",
      tips: ["O VDO foi descontinuado no RHEL 9 (substituído pelo LVM-VDO).", "Sempre use x-systemd.requires=vdo.service no fstab.", "Use -K com mkfs.xfs para acelerar a formatação."],
      commandExplanations: [
        "Instala os pacotes VDO.",
        "Cria o volume VDO com provisionamento fino.",
        "Formata com XFS, pulando o descarte de blocos.",
        "Cria o ponto de montagem.",
        "Abre o fstab.",
        "Adiciona montagem persistente com dependência do systemd.",
        "Monta o volume."
      ]
    }
  },
  {
    id: 22,
    node: "Node 1",
    difficulty: "beginner",
    probability: "Medium",
    version: "Both",
    commands: [
      "vi /etc/ssh/sshd_config",
      "PermitRootLogin no",
      "systemctl restart sshd"
    ],
    en: {
      title: "Question 22: SSH Security (Node 1)",
      description: "Disable root login via SSH.",
      category: "Security",
      explanation: "Securing SSH is a basic security requirement.",
      tips: ["Find the PermitRootLogin directive.", "Change 'yes' to 'no'.", "Always restart sshd after changes."],
      commandExplanations: [
        "Open the SSH daemon configuration.",
        "Set the directive to disable root login.",
        "Restart the service to apply security settings."
      ]
    },
    pt: {
      title: "Questão 22: Segurança SSH (Node 1)",
      description: "Desabilitar o login do root via SSH.",
      category: "Segurança",
      explanation: "Proteger o SSH é um requisito básico de segurança.",
      tips: ["Encontre a diretiva PermitRootLogin.", "Altere 'yes' para 'no'.", "Sempre reinicie o sshd após as alterações."],
      commandExplanations: [
        "Abre a configuração do daemon SSH.",
        "Define a diretiva para desabilitar o login do root.",
        "Reinicia o serviço para aplicar as configurações de segurança."
      ]
    }
  },
  {
    id: 23,
    node: "Node 1",
    difficulty: "intermediate",
    probability: "Medium",
    version: "Both",
    commands: [
      "podman pull nginx",
      "podman run -d --name my-web -p 8081:80 nginx",
      "podman ps"
    ],
    en: {
      title: "Question 23: Basic Containers (Node 1)",
      description: "Pull nginx image and run a container named 'my-web' mapping port 8081 to 80.",
      category: "Containers",
      explanation: "Basic container management with Podman.",
      tips: ["Podman is daemonless and rootless.", "Use -p for port mapping.", "Verify with podman ps."],
      commandExplanations: [
        "Download the image.",
        "Run the container in detached mode with port mapping.",
        "Verify the running container."
      ]
    },
    pt: {
      title: "Questão 23: Containers Básicos (Node 1)",
      description: "Baixar a imagem nginx e rodar um container chamado 'my-web' mapeando a porta 8081 para 80.",
      category: "Containers",
      explanation: "Gerenciamento básico de containers com Podman.",
      tips: ["O Podman não tem daemon e é rootless.", "Use -p para mapeamento de portas.", "Verifique com podman ps."],
      commandExplanations: [
        "Baixa a imagem.",
        "Roda o container em modo detached com mapeamento de porta.",
        "Verifica o container em execução."
      ]
    }
  },
  {
    id: 24,
    node: "Node 1",
    difficulty: "intermediate",
    probability: "Medium",
    version: "RHEL 10",
    commands: [
      "flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo",
      "flatpak install flathub org.vscodium.codium -y",
      "flatpak list"
    ],
    en: {
      title: "Question 24: Flatpak (Node 1)",
      description: "Configure Flathub repository and install VSCodium via Flatpak.",
      category: "System Configuration",
      explanation: "Flatpak is becoming a standard for desktop and some server applications in RHEL.",
      tips: ["Use remote-add to add repositories.", "Flatpak is useful for isolated applications.", "Verify with flatpak list."],
      commandExplanations: [
        "Add the Flathub repository.",
        "Install the specific application.",
        "List installed flatpaks."
      ]
    },
    pt: {
      title: "Questão 24: Flatpak (Node 1)",
      description: "Configurar o repositório Flathub e instalar o VSCodium via Flatpak.",
      category: "Configuração do Sistema",
      explanation: "O Flatpak está se tornando um padrão para aplicações desktop e algumas de servidor no RHEL.",
      tips: ["Use remote-add para adicionar repositórios.", "O Flatpak é útil para aplicações isoladas.", "Verifique com flatpak list."],
      commandExplanations: [
        "Adiciona o repositório Flathub.",
        "Instala a aplicação específica.",
        "Lista os flatpaks instalados."
      ]
    }
  },
  {
    id: 25,
    node: "Node 1",
    difficulty: "intermediate",
    probability: "High",
    version: "Both",
    commands: [
      "mkdir /data",
      "chown :sysadmin /data",
      "chmod 770 /data",
      "setfacl -m u:natasha:rwx /data",
      "setfacl -m u:harry:--- /data",
      "getfacl /data"
    ],
    en: {
      title: "Question 25: Advanced Permissions (Node 1)",
      description: "Create /data, set group sysadmin, 770 perms, and specific ACLs for natasha (rwx) and harry (none).",
      category: "Security",
      explanation: "ACLs allow for more complex permission structures than standard UGO.",
      tips: ["ACLs are checked after standard permissions.", "The '---' in setfacl means no permissions.", "Verify with getfacl."],
      commandExplanations: [
        "Create directory.",
        "Set group ownership.",
        "Set standard permissions.",
        "Add ACL for natasha.",
        "Add ACL for harry.",
        "Verify ACLs."
      ]
    },
    pt: {
      title: "Questão 25: Permissões Avançadas (Node 1)",
      description: "Criar /data, definir grupo sysadmin, permissões 770 e ACLs específicas para natasha (rwx) e harry (nenhuma).",
      category: "Segurança",
      explanation: "ACLs permitem estruturas de permissão mais complexas que o padrão UGO.",
      tips: ["ACLs são verificadas após as permissões padrão.", "O '---' no setfacl significa sem permissões.", "Verifique com getfacl."],
      commandExplanations: [
        "Cria o diretório.",
        "Define o grupo proprietário.",
        "Define as permissões padrão.",
        "Adiciona ACL para natasha.",
        "Adiciona ACL para harry.",
        "Verifica as ACLs."
      ]
    }
  },
  {
    id: 26,
    node: "Node 2",
    difficulty: "beginner",
    probability: "Essential",
    version: "Both",
    commands: [
      "passwd root",
      "Compede@777",
      "Compede@777"
    ],
    en: {
      title: "Question 26: Set Root Password (Node 2)",
      description: "Set the root password for Node 2 to 'Compede@777'.",
      category: "System Configuration",
      explanation: "Basic administrative task for Node 2.",
      tips: ["Ensure you type the password correctly twice.", "Use a strong password as requested."],
      commandExplanations: [
        "Start the password change process.",
        "Enter the new password.",
        "Confirm the new password."
      ]
    },
    pt: {
      title: "Questão 26: Definir Senha Root (Node 2)",
      description: "Definir a senha do root para o Node 2 como 'Compede@777'.",
      category: "Configuração do Sistema",
      explanation: "Tarefa administrativa básica para o Node 2.",
      tips: ["Certifique-se de digitar a senha corretamente duas vezes.", "Use uma senha forte conforme solicitado."],
      commandExplanations: [
        "Inicia o processo de alteração de senha.",
        "Digita a nova senha.",
        "Confirma a nova senha."
      ]
    }
  },
  {
    id: 27,
    node: "Node 2",
    difficulty: "intermediate",
    probability: "High",
    version: "Both",
    commands: [
      "fdisk /dev/sdb",
      "n -> p -> 1 -> Enter -> +756M -> t -> 82 -> w",
      "mkswap /dev/sdb1",
      "vi /etc/fstab",
      "/dev/sdb1 swap swap defaults 0 0",
      "swapon -a",
      "swapon -s"
    ],
    en: {
      title: "Question 27: Swap Partition (Node 2)",
      description: "Add a 756 MiB swap partition to /dev/sdb on Node 2.",
      category: "Storage",
      explanation: "Adding swap space is a common storage task.",
      tips: ["Use fdisk to create the partition.", "Type 82 is for swap.", "Don't forget the fstab entry."],
      commandExplanations: [
        "Open fdisk for the second disk.",
        "Sequence: New -> Primary -> 1 -> Default Start -> +756M -> Type -> 82 -> Write.",
        "Format as swap.",
        "Open fstab.",
        "Add persistent entry.",
        "Activate swap.",
        "Verify."
      ]
    },
    pt: {
      title: "Questão 27: Partição Swap (Node 2)",
      description: "Adicionar uma partição swap de 756 MiB ao /dev/sdb no Node 2.",
      category: "Armazenamento",
      explanation: "Adicionar espaço swap é uma tarefa comum de armazenamento.",
      tips: ["Use o fdisk para criar a partição.", "O tipo 82 é para swap.", "Não esqueça a entrada no fstab."],
      commandExplanations: [
        "Abre o fdisk para o segundo disco.",
        "Sequência: Novo -> Primário -> 1 -> Início Padrão -> +756M -> Tipo -> 82 -> Gravar.",
        "Formata como swap.",
        "Abre o fstab.",
        "Adiciona entrada persistente.",
        "Ativa o swap.",
        "Verifica."
      ]
    }
  },
  {
    id: 28,
    node: "Node 2",
    difficulty: "intermediate",
    probability: "High",
    version: "Both",
    commands: [
      "lvextend -L 230M /dev/research/data",
      "resize2fs /dev/research/data",
      "df -h"
    ],
    en: {
      title: "Question 28: Resize LVM (Node 2)",
      description: "Resize logical volume VO to 230 MiB (acceptable range 217-243 MiB).",
      category: "Storage",
      explanation: "Resizing LVs is a key skill for managing disk space.",
      tips: ["Check the current size first.", "Use -L for the target size.", "Resize the filesystem after the LV."],
      commandExplanations: [
        "Extend the LV.",
        "Resize the filesystem.",
        "Verify."
      ]
    },
    pt: {
      title: "Questão 28: Redimensionar LVM (Node 2)",
      description: "Redimensionar o volume lógico VO para 230 MiB (faixa aceitável 217-243 MiB).",
      category: "Armazenamento",
      explanation: "Redimensionar LVs é uma habilidade chave para gerenciar espaço em disco.",
      tips: ["Verifique o tamanho atual primeiro.", "Use -L para o tamanho de destino.", "Redimensione o sistema de arquivos após o LV."],
      commandExplanations: [
        "Estende o LV.",
        "Redimensiona o sistema de arquivos.",
        "Verifica."
      ]
    }
  },
  {
    id: 29,
    node: "Node 2",
    difficulty: "intermediate",
    probability: "Medium",
    version: "RHEL 10",
    commands: [
      "flatpak remote-add --user --if-not-exists flatb https://flathub.org/repo/flathub.flatpakrepo",
      "flatpak install --user flatb org.vscodium.codium -y",
      "flatpak list --user"
    ],
    en: {
      title: "Question 29: Flatpak for User (Node 2)",
      description: "Configure Flatpak repository 'flatb' for user student and install codium.",
      category: "System Configuration",
      explanation: "User-specific Flatpak configuration allows non-root users to manage their apps.",
      tips: ["Use --user flag for user-specific setup.", "The repository name must be 'flatb'.", "Install as the student user."],
      commandExplanations: [
        "Add the repository for the current user.",
        "Install the app in the user's scope.",
        "Verify user-installed flatpaks."
      ]
    },
    pt: {
      title: "Questão 29: Flatpak para Usuário (Node 2)",
      description: "Configurar o repositório Flatpak 'flatb' para o usuário student e instalar o codium.",
      category: "Configuração do Sistema",
      explanation: "A configuração do Flatpak específica do usuário permite que usuários não-root gerenciem seus apps.",
      tips: ["Use a flag --user para configuração específica do usuário.", "O nome do repositório deve ser 'flatb'.", "Instale como o usuário student."],
      commandExplanations: [
        "Adiciona o repositório para o usuário atual.",
        "Instala o app no escopo do usuário.",
        "Verifica os flatpaks instalados pelo usuário."
      ]
    }
  },
  {
    id: 30,
    node: "Node 2",
    difficulty: "advanced",
    probability: "High",
    version: "Both",
    commands: [
      "fdisk /dev/sdc",
      "n -> p -> 1 -> Enter -> +2G -> t -> 8e -> w",
      "pvcreate /dev/sdc1",
      "vgcreate -s 16M qagroup /dev/sdc1",
      "lvcreate -n qa -l 60 qagroup",
      "mkfs.ext4 /dev/qagroup/qa",
      "mkdir /mnt/qa",
      "vi /etc/fstab",
      "/dev/qagroup/qa /mnt/qa ext4 defaults 0 0",
      "mount -a"
    ],
    en: {
      title: "Question 30: New LVM 'qa' (Node 2)",
      description: "Create LV 'qa' in VG 'qagroup' with 16MB PE and 60 extents. Mount on /mnt/qa.",
      category: "Storage",
      explanation: "Creating LVM from scratch with specific extent sizes.",
      tips: ["60 extents * 16MB = 960MB.", "Ensure the mount point exists.", "Verify with lsblk and df."],
      commandExplanations: [
        "Partition the disk.",
        "Sequence: New -> Primary -> 1 -> Default Start -> +2G -> Type -> 8e -> Write.",
        "Create PV.",
        "Create VG with 16MB PE.",
        "Create LV with 60 extents.",
        "Format as ext4.",
        "Create mount point.",
        "Add to fstab.",
        "Mount all.",
        "Verify."
      ]
    },
    pt: {
      title: "Questão 30: Novo LVM 'qa' (Node 2)",
      description: "Criar LV 'qa' no VG 'qagroup' com PE de 16MB e 60 extents. Montar em /mnt/qa.",
      category: "Armazenamento",
      explanation: "Criar LVM do zero com tamanhos de extents específicos.",
      tips: ["60 extents * 16MB = 960MB.", "Garanta que o ponto de montagem exista.", "Verifique com lsblk e df."],
      commandExplanations: [
        "Particiona o disco.",
        "Sequência: Novo -> Primário -> 1 -> Início Padrão -> +2G -> Tipo -> 8e -> Gravar.",
        "Cria o PV.",
        "Cria o VG com PE de 16MB.",
        "Cria o LV com 60 extents.",
        "Formata como ext4.",
        "Cria o ponto de montagem.",
        "Adiciona ao fstab.",
        "Monta tudo.",
        "Verifica."
      ]
    }
  }
];

export const studyGuide = {
  en: {
    title: "RHCSA V10 Study Guide (RHEL 9 & 10)",
    introduction: "This guide covers the essential topics for the Red Hat Certified System Administrator (RHCSA) exam on RHEL 9 and 10.",
    sections: [
      {
        title: "1. System Recovery",
        content: "The most critical task. You must be able to reset the root password using the GRUB menu and rd.break or init=/bin/bash."
      },
      {
        title: "2. Storage Management",
        content: "Focus on LVM (pvcreate, vgcreate, lvcreate), VDO, and Swap. Know how to resize volumes and make them persistent in /etc/fstab."
      },
      {
        title: "3. Security",
        content: "SELinux is mandatory. Know how to change contexts (semanage, restorecon) and troubleshoot. Firewall-cmd is used for all network security."
      },
      {
        title: "4. Containers",
        content: "Podman is the tool. Practice running containers, mapping ports, and creating systemd user services for persistence."
      }
    ]
  },
  pt: {
    title: "Guia de Estudo RHCSA V10 (RHEL 9 e 10)",
    introduction: "Este guia cobre os tópicos essenciais para o exame Red Hat Certified System Administrator (RHCSA) no RHEL 9 e 10.",
    sections: [
      {
        title: "1. Recuperação do Sistema",
        content: "A tarefa mais crítica. Você deve ser capaz de redefinir a senha do root usando o menu do GRUB e rd.break ou init=/bin/bash."
      },
      {
        title: "2. Gerenciamento de Armazenamento",
        content: "Foco em LVM (pvcreate, vgcreate, lvcreate), VDO e Swap. Saiba como redimensionar volumes e torná-los persistentes no /etc/fstab."
      },
      {
        title: "3. Segurança",
        content: "SELinux é obrigatório. Saiba como alterar contextos (semanage, restorecon) e resolver problemas. O firewall-cmd é usado para toda a segurança de rede."
      },
      {
        title: "4. Containers",
        content: "Podman é a ferramenta. Pratique rodar containers, mapear portas e criar serviços de usuário do systemd para persistência."
      }
    ]
  }
};

export const categories = [
  "Network Configuration",
  "System Configuration",
  "Security",
  "User Management",
  "Storage",
  "Filesystem",
  "Automation",
  "Containers"
];

export const difficulties = ["beginner", "intermediate", "advanced"];
