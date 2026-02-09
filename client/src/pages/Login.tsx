import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Credenciais pré-definidas
    if (username === "admin" && password === "rhcsa2026") {
      localStorage.setItem("rhcsa_auth", "true");
      toast({
        title: "Acesso concedido",
        description: "Bem-vindo ao RHCSA Trainer!",
      });
      setTimeout(() => setLocation("/"), 500);
    } else {
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Usuário ou senha incorretos.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-red-900/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-500">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-red-600/10 border border-red-500/20">
              <ShieldCheck className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">RHCSA Trainer</CardTitle>
          <CardDescription className="text-slate-400">
            Área Restrita - Identifique-se para acessar o simulador
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">Usuário</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Digite seu usuário" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-950/50 border-slate-800 text-white focus:ring-red-500/50 focus:border-red-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Senha</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950/50 border-slate-800 text-white focus:ring-red-500/50 focus:border-red-500 pl-10"
                  required
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 transition-all duration-300 shadow-lg shadow-red-900/20"
              disabled={isLoading}
            >
              {isLoading ? "Verificando..." : "Entrar no Simulador"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="fixed bottom-8 text-slate-500 text-xs font-mono tracking-widest uppercase">
        Red Hat Enterprise Linux 9 & 10 Study Tool
      </div>
    </div>
  );
}
