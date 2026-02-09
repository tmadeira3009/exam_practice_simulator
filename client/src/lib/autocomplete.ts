// Autocomplete data for common Linux commands used in RHCSA
import { getPathAutocompleteSuggestions, getPathAutocompleteBestMatch } from './linuxFilesystem';

export const linuxCommands = [
  // Network commands
  'nmcli',
  'hostnamectl',
  'ip',
  'ifconfig',
  'route',
  'netstat',
  'ss',
  'ping',
  'curl',
  'wget',
  'firewall-cmd',
  'semanage',
  
  // Package management
  'yum',
  'dnf',
  'rpm',
  'apt',
  'apt-get',
  
  // File management
  'ls',
  'cd',
  'pwd',
  'cp',
  'mv',
  'rm',
  'mkdir',
  'rmdir',
  'find',
  'grep',
  'sed',
  'awk',
  'cat',
  'less',
  'more',
  'head',
  'tail',
  'touch',
  'chmod',
  'chown',
  'chgrp',
  'stat',
  'file',
  'tar',
  'zip',
  'unzip',
  'gzip',
  'gunzip',
  
  // System commands
  'systemctl',
  'systemd',
  'service',
  'ps',
  'top',
  'htop',
  'kill',
  'killall',
  'bg',
  'fg',
  'jobs',
  'nohup',
  'screen',
  'tmux',
  'uname',
  'whoami',
  'id',
  'sudo',
  'su',
  'passwd',
  'useradd',
  'userdel',
  'usermod',
  'groupadd',
  'groupdel',
  'groupmod',
  'visudo',
  'sudoedit',
  
  // Storage and mounting
  'mount',
  'umount',
  'lsblk',
  'blkid',
  'fdisk',
  'parted',
  'mkfs',
  'fsck',
  'tune2fs',
  'df',
  'du',
  'autofs',
  'nfs',
  'nfsd',
  'exportfs',
  'showmount',
  
  // Logging and monitoring
  'journalctl',
  'logger',
  'tail',
  'less',
  'grep',
  'dmesg',
  'syslog',
  'rsyslog',
  'logrotate',
  
  // SELinux
  'getenforce',
  'setenforce',
  'getsebool',
  'setsebool',
  'semanage',
  'restorecon',
  'chcon',
  'seinfo',
  'sesearch',
  
  // Cron and scheduling
  'crontab',
  'cronie',
  'at',
  'atd',
  'anacron',
  
  // Time and date
  'date',
  'timedatectl',
  'chrony',
  'chronyd',
  'chronyc',
  'ntpd',
  'ntpq',
  
  // Text editors
  'vi',
  'vim',
  'nano',
  'emacs',
  'ed',
  
  // Compression and archives
  'tar',
  'gzip',
  'bzip2',
  'xz',
  'zip',
  'unzip',
  
  // Network file systems
  'nfs',
  'samba',
  'smb',
  'cifs',
  
  // Kernel and boot
  'grub2-mkconfig',
  'grubby',
  'dracut',
  'initramfs',
  'kernel',
  'modprobe',
  'lsmod',
  'insmod',
  'rmmod',
  
  // Virtualization
  'kvm',
  'qemu',
  'virsh',
  'virt-install',
  'virt-manager',
  
  // Container
  'docker',
  'podman',
  'container',
  'image',
  
  // Other utilities
  'echo',
  'printf',
  'man',
  'info',
  'help',
  'which',
  'whereis',
  'whatis',
  'type',
  'alias',
  'unalias',
  'history',
  'clear',
  'reset',
  'exit',
  'logout',
  'source',
  'export',
  'unset',
  'env',
  'set',
  'read',
  'expr',
  'test',
  '[',
  'true',
  'false',
  'sleep',
  'wait',
  'trap',
  'eval',
  'exec',
  'command',
  'v',
];

// Common flags and options for commands
export const commandFlags: Record<string, string[]> = {
  'ls': ['-a', '-l', '-h', '-R', '-S', '-t', '-i', '-d'],
  'cp': ['-r', '-v', '-f', '-i', '-p', '-d', '-a'],
  'mv': ['-v', '-f', '-i', '-n', '-u'],
  'rm': ['-r', '-f', '-v', '-i', '-d'],
  'mkdir': ['-p', '-m', '-v'],
  'find': ['-name', '-type', '-user', '-group', '-size', '-mtime', '-exec', '-delete'],
  'grep': ['-r', '-i', '-v', '-n', '-l', '-c', '-E', '-F', '-w'],
  'tar': ['-c', '-x', '-v', '-f', '-z', '-j', '-J', '-p'],
  'chmod': ['-r', '-v', '-c', '-f'],
  'chown': ['-r', '-v', '-c', '-f'],
  'systemctl': ['start', 'stop', 'restart', 'reload', 'enable', 'disable', 'status', 'list-units'],
  'yum': ['install', 'remove', 'update', 'search', 'list', 'info', 'clean', 'repolist'],
  'dnf': ['install', 'remove', 'update', 'search', 'list', 'info', 'clean', 'repolist'],
  'firewall-cmd': ['--add-port', '--remove-port', '--list-ports', '--permanent', '--reload', '--add-service', '--remove-service'],
  'semanage': ['port', 'user', 'role', 'type', 'boolean', 'login', 'user-map', 'interface', 'module'],
  'nmcli': ['con', 'dev', 'radio', 'general', 'agent', 'connection', 'device'],
  'mount': ['-t', '-o', '-a', '-l', '-n', '-r', '-w'],
  'df': ['-h', '-i', '-T', '-a', '-l'],
  'du': ['-h', '-s', '-a', '-c', '-d'],
};

// Parse command line to determine what to autocomplete
export function parseCommandLine(input: string): {
  type: 'command' | 'path' | 'flag' | 'none';
  partial: string;
  fullInput: string;
} {
  // If input is empty or just spaces
  if (!input.trim()) {
    return { type: 'command', partial: '', fullInput: input };
  }

  // Split by spaces but keep track of the last part
  const parts = input.split(' ');
  const lastPart = parts[parts.length - 1];

  // If it's the first part and doesn't contain a slash, it's a command
  if (parts.length === 1 && !lastPart.includes('/')) {
    return { type: 'command', partial: lastPart, fullInput: input };
  }

  // If it starts with -, it's a flag
  if (lastPart.startsWith('-')) {
    return { type: 'flag', partial: lastPart, fullInput: input };
  }

  // Otherwise, treat it as a path (even if it doesn't have a slash yet)
  return { type: 'path', partial: lastPart, fullInput: input };
}

// Autocomplete suggestion function
export function getAutocompleteSuggestions(input: string): string[] {
  const parsed = parseCommandLine(input);

  if (parsed.type === 'command') {
    return getCommandSuggestions(parsed.partial);
  } else if (parsed.type === 'path') {
    return getPathAutocompleteSuggestions(parsed.partial);
  } else if (parsed.type === 'flag') {
    return getFlagSuggestions(parsed.partial);
  }

  return [];
}

// Get command suggestions
function getCommandSuggestions(input: string): string[] {
  const lowerInput = input.toLowerCase();
  return linuxCommands.filter(cmd => 
    cmd.toLowerCase().startsWith(lowerInput)
  );
}

// Get flag suggestions
function getFlagSuggestions(input: string): string[] {
  return [];
}

// Get the best match for autocompletion
export function getAutocompleteBestMatch(input: string): string | null {
  const parsed = parseCommandLine(input);

  if (parsed.type === 'command') {
    const match = getCommandBestMatch(parsed.partial);
    if (match) return match;
  } else if (parsed.type === 'path') {
    const match = getPathAutocompleteBestMatch(parsed.partial);
    if (match) {
      // Replace the partial path with the full match
      const lastSpaceIndex = input.lastIndexOf(' ');
      const prefix = lastSpaceIndex === -1 ? '' : input.substring(0, lastSpaceIndex + 1);
      return prefix + match;
    }
  }

  return null;
}

function getCommandBestMatch(input: string): string | null {
  const suggestions = getCommandSuggestions(input);
  
  if (suggestions.length === 0) return null;
  if (suggestions.length === 1) return suggestions[0];
  
  // Find the longest common prefix
  let commonPrefix = suggestions[0];
  for (let i = 1; i < suggestions.length; i++) {
    let j = 0;
    while (j < commonPrefix.length && j < suggestions[i].length && 
           commonPrefix[j].toLowerCase() === suggestions[i][j].toLowerCase()) {
      j++;
    }
    commonPrefix = commonPrefix.substring(0, j);
  }
  
  return commonPrefix.length > input.length ? commonPrefix : null;
}

// Get all matching suggestions for display
export function getAllMatches(input: string): string[] {
  return getAutocompleteSuggestions(input);
}
