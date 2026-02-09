import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { getAllMatches, getAutocompleteBestMatch } from '@/lib/autocomplete';
import 'xterm/css/xterm.css';

interface TerminalProps {
  expectedCommand?: string;
  onSuccess?: () => void;
  onFailure?: () => void;
  showSolution?: boolean;
  solutionCommands?: string[];
  commandExplanations?: string[];
  prompt?: string;
}

export default function Terminal({ 
  expectedCommand, 
  onSuccess, 
  onFailure, 
  showSolution = false,
  solutionCommands = [],
  commandExplanations = [],
  prompt = '[root@rhcsa ~]# ' 
}: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const inputBuffer = useRef<string>('');
  const history = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);

  // Ensure we have arrays to work with to prevent .map or .forEach errors
  const safeSolutionCommands = Array.isArray(solutionCommands) ? solutionCommands : [];
  const safeExplanations = Array.isArray(commandExplanations) ? commandExplanations : [];

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: 'block',
      fontSize: 14,
      fontFamily: '"Fira Code", "Courier New", monospace',
      theme: {
        background: '#000000',
        foreground: '#ffffff',
        cursor: '#ffffff',
        green: '#4ade80',
        red: '#f87171',
        yellow: '#fbbf24',
      },
      scrollback: 1000,
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;

    if (showSolution) {
      term.writeln('\x1b[1;34m[MODO APRENDIZADO - SOLUÇÃO COMPLETA]\x1b[0m');
      term.writeln('--------------------------------------------------');
      safeSolutionCommands.forEach((cmd, idx) => {
        if (safeExplanations[idx]) {
          term.writeln(`\x1b[1;33m# ${safeExplanations[idx]}\x1b[0m`);
        }
        const cleanCmd = (cmd || "").replace("INSERT_CONTENT:", "");
        term.writeln(`\x1b[1;32m${prompt}${cleanCmd}\x1b[0m`);
        term.writeln('');
      });
      return () => term.dispose();
    }

    term.writeln('\x1b[1;32mRHCSA Trainer Terminal v1.2\x1b[0m');
    term.writeln('Digite o comando esperado para progredir.');
    term.writeln('\x1b[1;33mDica: Use TAB para autocompletar comandos e caminhos de arquivos!\x1b[0m');
    
    const isMultiLine = expectedCommand?.includes('\n') || expectedCommand?.startsWith("INSERT_CONTENT:");
    if (isMultiLine) {
      term.writeln('\x1b[1;36mModo Multi-linha: Pressione Enter para nova linha.\x1b[0m');
      term.writeln('\x1b[1;36mPressione Ctrl+D ou digite "EOF" em uma linha vazia para finalizar.\x1b[0m');
    }
    term.write('\r\n' + prompt);

    const clearCurrentLine = () => {
      term.write('\r' + prompt);
      term.write('\x1b[K');
    };

    const handleData = (data: string) => {
      if (data === '\x04' && (expectedCommand?.includes('\n') || expectedCommand?.startsWith("INSERT_CONTENT:"))) {
        processCommand();
        return;
      }

      if (data.length > 1 && !data.startsWith('\x1b')) {
        inputBuffer.current += data;
        term.write(data);
        return;
      }

      const code = data.charCodeAt(0);

      if (code === 9) { // Tab key
        const bestMatch = getAutocompleteBestMatch(inputBuffer.current);
        const suggestions = getAllMatches(inputBuffer.current);
        
        if (bestMatch && bestMatch !== inputBuffer.current) {
          clearCurrentLine();
          inputBuffer.current = bestMatch;
          term.write(inputBuffer.current);
        } else if (suggestions.length > 1) {
          term.write('\r\n');
          const cols = Math.max(1, Math.floor(term.cols / 25));
          let line = '';
          suggestions.forEach((suggestion, idx) => {
            line += suggestion.padEnd(25);
            if ((idx + 1) % cols === 0) {
              term.writeln(line);
              line = '';
            }
          });
          if (line) term.writeln(line);
          term.write(prompt + inputBuffer.current);
        } else {
          term.write('\x07');
        }
        return;
      }

      if (code === 13) { // Enter
        const isMultiLine = expectedCommand?.includes('\n') || expectedCommand?.startsWith("INSERT_CONTENT:");
        if (isMultiLine) {
          if (inputBuffer.current.trim().endsWith("EOF")) {
            inputBuffer.current = inputBuffer.current.replace(/EOF$/, "");
            processCommand();
            return;
          }
          inputBuffer.current += '\n';
          term.write('\r\n');
        } else {
          processCommand();
        }
      } else if (code === 127) { // Backspace
        if (inputBuffer.current.length > 0) {
          const lastChar = inputBuffer.current.slice(-1);
          inputBuffer.current = inputBuffer.current.slice(0, -1);
          if (lastChar === '\n') {
            term.write('\x1b[A\r');
          } else {
            term.write('\b \b');
          }
        }
      } else if (data === '\x1b[A') { // Up arrow
        if (expectedCommand && !expectedCommand.startsWith("INSERT_CONTENT:") && historyIndex.current > 0) {
          historyIndex.current--;
          clearCurrentLine();
          inputBuffer.current = history.current[historyIndex.current];
          term.write(inputBuffer.current);
        }
      } else if (data === '\x1b[B') { // Down arrow
        if (expectedCommand && !expectedCommand.startsWith("INSERT_CONTENT:")) {
          if (historyIndex.current < history.current.length - 1) {
            historyIndex.current++;
            clearCurrentLine();
            inputBuffer.current = history.current[historyIndex.current];
            term.write(inputBuffer.current);
          } else {
            historyIndex.current = history.current.length;
            clearCurrentLine();
            inputBuffer.current = '';
          }
        }
      } else if (code < 32 && data !== '\x04') {
        // Ignore
      } else {
        inputBuffer.current += data;
        term.write(data);
      }
    };

    const processCommand = () => {
      const command = inputBuffer.current.trim();
      term.write('\r\n');
      
      if (!expectedCommand) return;

      const cleanExpected = expectedCommand.replace("INSERT_CONTENT:", "").trim();
      const normalize = (str: string) => str.split('\n').map(l => l.trim()).filter(l => l !== '').join('\n');
      
      if (normalize(command) === normalize(cleanExpected)) {
        term.writeln('\x1b[1;32m[CORRETO]\x1b[0m');
        onSuccess?.();
      } else if (command !== '') {
        term.writeln('\x1b[1;31m[INCORRETO]\x1b[0m');
        onFailure?.();
      }

      if (command !== '' && !expectedCommand.startsWith("INSERT_CONTENT:")) {
        history.current.push(inputBuffer.current);
        historyIndex.current = history.current.length;
      }

      inputBuffer.current = '';
      term.write(prompt);
    };

    term.onData(handleData);

    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [expectedCommand, prompt, onSuccess, onFailure, showSolution, safeSolutionCommands, safeExplanations]);

  return (
    <div className="w-full h-80 bg-black rounded-lg overflow-hidden border border-gray-700 shadow-2xl flex flex-col">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-400 font-mono ml-2">root@rhcsa: ~</span>
        </div>
        <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Bash</div>
      </div>
      <div ref={terminalRef} className="p-2 flex-1 overflow-hidden" />
    </div>
  );
}
