// Linux standard directory structure
// This represents the default directories that exist in a Linux system
export const linuxFilesystem: Record<string, string[]> = {
  '/': [
    'bin',
    'boot',
    'dev',
    'etc',
    'home',
    'lib',
    'lib64',
    'media',
    'mnt',
    'opt',
    'proc',
    'root',
    'run',
    'sbin',
    'srv',
    'sys',
    'tmp',
    'usr',
    'var',
  ],
  '/bin': [],
  '/boot': [],
  '/dev': [],
  '/etc': [
    'yum.repos.d',
    'httpd',
    'nginx',
    'mysql',
    'postgresql',
    'ssh',
    'ssl',
    'systemd',
    'default',
    'init.d',
    'rc.d',
    'cron.d',
    'cron.daily',
    'cron.hourly',
    'cron.monthly',
    'cron.weekly',
    'passwd',
    'shadow',
    'group',
    'sudoers',
    'hosts',
    'hostname',
    'fstab',
    'chrony.conf',
    'auto.master',
    'auto.rhome',
  ],
  '/etc/yum.repos.d': [],
  '/etc/httpd': [
    'conf',
    'conf.d',
    'conf.modules.d',
    'logs',
    'modules',
    'run',
  ],
  '/etc/ssh': [
    'sshd_config',
    'ssh_config',
    'ssh_host_rsa_key',
    'ssh_host_rsa_key.pub',
  ],
  '/etc/systemd': [
    'system',
    'user',
    'system-preset',
    'user-preset',
  ],
  '/home': [],
  '/lib': [],
  '/lib64': [],
  '/media': [],
  '/mnt': [
    'BaseOS',
    'AppStream',
  ],
  '/opt': [],
  '/proc': [],
  '/root': [
    'find.user',
    'lines',
  ],
  '/run': [],
  '/sbin': [],
  '/srv': [],
  '/sys': [],
  '/tmp': [],
  '/usr': [
    'bin',
    'sbin',
    'local',
    'share',
    'lib',
    'lib64',
    'include',
    'src',
  ],
  '/usr/bin': [],
  '/usr/sbin': [],
  '/usr/local': [
    'bin',
    'sbin',
    'lib',
    'share',
  ],
  '/usr/share': [
    'dict',
    'doc',
    'man',
    'info',
  ],
  '/usr/share/dict': [
    'words',
  ],
  '/var': [
    'log',
    'cache',
    'lib',
    'run',
    'spool',
    'tmp',
    'www',
  ],
  '/var/log': [
    'messages',
    'secure',
    'audit',
    'httpd',
    'nginx',
    'mysql',
    'postgresql',
    'cron',
    'boot.log',
  ],
  '/var/www': [
    'html',
  ],
  '/var/www/html': [],
  '/rhome': [],
};

// Check if a path exists in the filesystem
export function pathExists(path: string): boolean {
  const normalized = normalizePath(path);
  return normalized in linuxFilesystem;
}

// Get contents of a directory
export function getDirectoryContents(dirPath: string): string[] {
  const normalized = normalizePath(dirPath);
  return linuxFilesystem[normalized] || [];
}

// Normalize path (remove trailing slash, handle . and ..)
export function normalizePath(path: string): string {
  if (!path || path === '') return '/';
  
  let normalized = path;
  
  // Ensure it starts with / for lookup in our mock filesystem
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }
  
  // Remove trailing slash except for root
  if (normalized.endsWith('/') && normalized !== '/') {
    normalized = normalized.slice(0, -1);
  }
  
  return normalized;
}

// Autocomplete for file paths
export function getPathAutocompleteSuggestions(input: string): string[] {
  // Handle empty input or just spaces
  const trimmedInput = input || '';
  
  // Determine directory and prefix
  let dirPath: string;
  let prefix: string;
  const lastSlash = trimmedInput.lastIndexOf('/');
  
  if (lastSlash === -1) {
    // No slash, we are looking in the current directory (root in this mock)
    dirPath = '/';
    prefix = trimmedInput;
  } else {
    dirPath = trimmedInput.substring(0, lastSlash) || '/';
    prefix = trimmedInput.substring(lastSlash + 1);
  }

  // Check if directory exists
  if (!pathExists(dirPath)) {
    return [];
  }

  const contents = getDirectoryContents(dirPath);
  
  // Filter by prefix
  const matches = contents.filter(item =>
    item.toLowerCase().startsWith(prefix.toLowerCase())
  );

  return matches.map(match => {
    let result: string;
    if (lastSlash === -1) {
      result = match;
    } else {
      const base = trimmedInput.substring(0, lastSlash);
      result = base === '' ? '/' + match : base + '/' + match;
    }
    
    // Add trailing slash if it's a directory in our mock
    const fullPath = normalizePath(result);
    if (linuxFilesystem[fullPath]) {
      result += '/';
    }
    
    return result;
  });
}

// Get the best match for path autocompletion
export function getPathAutocompleteBestMatch(input: string): string | null {
  const suggestions = getPathAutocompleteSuggestions(input);
  
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
