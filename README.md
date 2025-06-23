Simulador RHCSA
Bem-vindo ao Simulador RHCSA, um laboratório virtual para prática do exame Red Hat Certified System Administrator (RHCSA) no RHEL 9. Este projeto fornece uma interface web para realizar tarefas práticas, verificar respostas, gerar relatórios em PDF e zerar o ambiente de laboratório. Ideal para estudantes, instrutores e profissionais que desejam se preparar para o exame.
Visão Geral
O simulador é uma aplicação Flask que simula questões do exame RHCSA, cobrindo tópicos como:

Configuração de rede
Gerenciamento de usuários e grupos
Armazenamento (LVM, partições, etc.)
Segurança (SELinux, firewall)
Automação (cron, tuned)
Contêineres (Podman)

Os usuários podem:

Acessar questões via navegador
Configurar o sistema via SSH
Verificar respostas automaticamente
Gerar relatórios de desempenho em PDF
Zerar o laboratório para reiniciar

Pré-requisitos
Para executar o simulador, você precisa de:

Um servidor com Red Hat Enterprise Linux 9 ou Oracle Linux 9
Acesso root ou privilégios sudo
Conexão à internet (para instalar pacotes e, opcionalmente, clonar repositório)
Pelo menos 2 GB de RAM e 10 GB de espaço em disco
Arquivos do simulador:
rhcsa_simulator.py
templates/index.html
templates/result.html
templates/reset.html
setup_rhcsa_simulator.sh (script de configuração)



Instalação
Passo 1: Obter os Arquivos

Opção 1: Clonar o Repositório (substitua pelo seu repositório, se aplicável):git clone https://github.com/tmadeira3009/exam_practice_simulator
cd exam_practice_simulator


Opção 2: Copiar Arquivos Manualmente:
Copie os arquivos listados acima para um diretório (e.g., /root/rhcsa_simulator).
Certifique-se de que o script setup_rhcsa_simulator.sh está incluído.



Passo 2: Executar o Script de Configuração
O script setup_rhcsa_simulator.sh configura o servidor automaticamente, instalando dependências, criando um usuário labuser, e iniciando o simulador.

Conecte-se ao servidor como root:
ssh root@<IP_DO_SERVIDOR>


Torne o script executável:
chmod +x setup_rhcsa_simulator.sh


Execute o script:
sudo bash setup_rhcsa_simulator.sh


Aguarde a conclusão (pode levar alguns minutos, dependendo da conexão).

O script cria um usuário labuser com senha labpassword.
Instala pacotes como Flask, LaTeX, Podman, e configura o firewall.
Inicia o simulador na porta 5000.
Gera um log em /tmp/rhcsa_setup.log.


Ao final, o script exibe instruções, incluindo:

URL do simulador (e.g., http://<IP>:5000?user=aluno1&lang=pt)
Credenciais do usuário labuser
Comandos para gerenciar o simulador



Passo 3: Verificar a Instalação

Abra a URL fornecida no navegador (e.g., http://<IP>:5000?user=aluno1&lang=pt).
Você verá uma lista de questões do RHCSA.
Conecte-se via SSH para configurar o sistema:ssh labuser@<IP_DO_SERVIDOR>


Usuário: labuser
Senha: labpassword



Como Usar

Acessar o Simulador:

No navegador, abra a URL fornecida (e.g., http://<IP>:5000?user=seu_nome&lang=pt).
Substitua seu_nome pelo seu nome de usuário (sem espaços ou caracteres especiais).
Use lang=pt para português ou lang=en para inglês.


Realizar Questões:

Cada questão descreve uma tarefa (e.g., configurar SSH ou criar um usuário).
Conecte-se ao servidor via SSH como labuser:ssh labuser@<IP_DO_SERVIDOR>


Execute os comandos necessários (pode ser necessário usar sudo).
Exemplo para a questão 24 (SSH root login):sudo vi /etc/ssh/sshd_config
# Adicione ou modifique: PermitRootLogin yes
sudo systemctl restart sshd




Verificar Respostas:

Na interface web, clique em Verificar ao lado de cada questão.
O resultado aparece em verde (aprovado) ou vermelho (reprovado).


Finalizar o Laboratório:

Clique em Finalizar para ver um resumo dos resultados.
Visualize pontuações por categoria e detalhes de cada questão.


Gerar Relatório PDF:

Clique em Gerar PDF para baixar um relatório com seus resultados.
O PDF inclui pontuação geral, resumo por categoria e feedback por questão.


Zerar o Laboratório:

Clique em Zerar Laboratório para redefinir o ambiente.
Isso remove configurações (usuários, arquivos, etc.) e reinicia a sessão.
Consulte /tmp/reset_lab.log para detalhes do reset.


Reiniciar o Simulador (se necessário):

Como labuser, execute:~/rhcsa_simulator/start_simulator.sh





Solução de Problemas

Simulador não acessível no navegador:

Verifique se a porta 5000 está aberta:sudo firewall-cmd --list-ports


Confirme que o Flask está rodando:lsof -i:5000


Consulte /tmp/rhcsa_setup.log para erros.


Erro ao verificar questões:

Abra o console do navegador (F12 > Console) e verifique erros JavaScript.
Consulte o terminal onde o Flask está rodando para logs de erro.
Certifique-se de que os serviços (e.g., httpd, sshd) estão ativos:systemctl status <serviço>




Erro ao gerar PDF:

Verifique se o LaTeX está instalado:pdflatex --version


Teste manualmente:echo '\documentclass{article}\begin{document}Teste\end{document}' > /tmp/test.tex
pdflatex -output-directory=/tmp /tmp/test.tex




Permissões negadas:

Ajuste permissões do diretório:sudo chown -R labuser:labuser /home/labuser/rhcsa_simulator
sudo chmod -R u+rw /home/labuser/rhcsa_simulator


cd ~/exam_practice_simulator

source venv/bin/activate

python3 rhcsa_simulator.py


Outros problemas:

Reexecute o script de configuração:sudo bash setup_rhcsa_simulator.sh


Envie os logs (/tmp/rhcsa_setup.log, /tmp/reset_lab.log) para suporte.



Estrutura do Projeto
rhcsa_simulator/
├── rhcsa_simulator.py        # Aplicação Flask principal
├── templates/
│   ├── index.html            # Página inicial com questões
│   ├── result.html           # Página de resultados
│   ├── reset.html            # Página de reset do laboratório
├── setup_rhcsa_simulator.sh  # Script de configuração
├── start_simulator.sh        # Script para iniciar o Flask (gerado pelo setup)
└── venv/                     # Ambiente virtual Python (gerado pelo setup)

Contribuições

Para sugerir melhorias ou relatar problemas, envie um e-mail para [seu_email@example.com] ou abra uma issue no repositório (se aplicável).
Novas questões podem ser adicionadas editando rhcsa_simulator.py (seção QUESTIONS).

Licença
Este projeto é fornecido para fins educacionais. Uso comercial ou distribuição sem permissão não são permitidos.
Contato
Para dúvidas ou suporte, entre em contato com [seu_nome] em [seu_email@example.com].

Criado em 21 de junho de 2025
