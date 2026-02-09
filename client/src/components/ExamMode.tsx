import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { rhcsaQuestions, Question } from "@/lib/rhcsaData";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Terminal as TerminalIcon, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Trophy, 
  RotateCcw, 
  ChevronRight, 
  Play, 
  Info, 
  List, 
  Flag, 
  Clock,
  Save,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import Terminal from "./Terminal";

type QuestionStatus = "pending" | "in-progress" | "completed" | "review";

interface ExamQuestionState {
  question: Question;
  status: QuestionStatus;
  currentCommandIndex: number;
  attempts: number;
  score: number;
  userCommands: string[];
}

export default function ExamMode() {
  const { language } = useLanguage();
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [examStates, setExamStates] = useState<ExamQuestionState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10800); // 3 horas em segundos (tempo real do RHCSA)

  // Inicializar o exame com 15 questões aleatórias (mais próximo da prova real)
  useEffect(() => {
    if (!examStarted && !examFinished) {
      const shuffled = [...rhcsaQuestions].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 15).map(q => ({
        question: q,
        status: "pending" as QuestionStatus,
        currentCommandIndex: 0,
        attempts: 0,
        score: 0,
        userCommands: []
      }));
      setExamStates(selected);
    }
  }, [examStarted, examFinished]);

  // Timer do exame
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && !examFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      finishExam();
    }
    return () => clearInterval(timer);
  }, [examStarted, examFinished, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startExam = () => {
    setExamStarted(true);
    setTimeLeft(10800);
    setCurrentIndex(0);
  };

  const finishExam = () => {
    if (confirm(language === "pt" ? "Deseja realmente finalizar o exame e ver sua nota?" : "Do you really want to finish the exam and see your score?")) {
      setExamFinished(true);
      setExamStarted(false);
    }
  };

  const handleCommandSuccess = () => {
    const newState = [...examStates];
    const current = newState[currentIndex];
    
    if (current.currentCommandIndex < current.question.commands.length - 1) {
      current.currentCommandIndex += 1;
      current.status = "in-progress";
    } else {
      current.status = "completed";
      // Calcular score da questão (baseado em tentativas)
      current.score = Math.max(0, 10 - current.attempts);
    }
    setExamStates(newState);
  };

  const handleCommandFailure = () => {
    const newState = [...examStates];
    newState[currentIndex].attempts += 1;
    setExamStates(newState);
  };

  const toggleReview = () => {
    const newState = [...examStates];
    newState[currentIndex].status = newState[currentIndex].status === "review" ? "in-progress" : "review";
    setExamStates(newState);
  };

  const calculateFinalScore = () => {
    const totalScore = examStates.reduce((acc, curr) => acc + curr.score, 0);
    const maxPossible = examStates.length * 10;
    return Math.round((totalScore / maxPossible) * 100);
  };

  if (!examStarted && !examFinished) {
    return (
      <div className="max-w-3xl mx-auto text-center space-y-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-red-600 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl rotate-6">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-gray-900 tracking-tight">
            {language === "pt" ? "Simulado Profissional RHCSA" : "Professional RHCSA Simulation"}
          </h2>
          <p className="text-xl text-gray-600 font-medium">
            {language === "pt" 
              ? "Interface idêntica ao exame real. 15 questões, 3 horas de tempo e navegação livre." 
              : "Interface identical to the real exam. 15 questions, 3 hours time and free navigation."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" /> {language === "pt" ? "Tempo e Estrutura" : "Time & Structure"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>• 180 minutos (3 horas) de duração.</p>
              <p>• 15 questões aleatórias de Node 1 e Node 2.</p>
              <p>• Navegação livre entre todas as tarefas.</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-600" /> {language === "pt" ? "Critérios de Avaliação" : "Evaluation Criteria"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>• Nota mínima para aprovação: 70%.</p>
              <p>• Precisão de comandos é essencial.</p>
              <p>• Marque para revisão o que tiver dúvida.</p>
            </CardContent>
          </Card>
        </div>

        <Button onClick={startExam} size="lg" className="bg-red-600 hover:bg-red-700 text-white px-16 py-8 text-2xl font-black rounded-2xl shadow-xl hover:scale-105 transition-all">
          <Play className="w-8 h-8 mr-3" /> {language === "pt" ? "INICIAR EXAME" : "START EXAM"}
        </Button>
      </div>
    );
  }

  if (examFinished) {
    const finalScore = calculateFinalScore();
    const passed = finalScore >= 70;

    return (
      <div className="max-w-4xl mx-auto space-y-8 py-12 animate-in zoom-in duration-500">
        <Card className={`border-4 ${passed ? "border-green-500" : "border-red-500"} shadow-2xl overflow-hidden rounded-[2.5rem]`}>
          <div className={`${passed ? "bg-green-500" : "bg-red-500"} p-12 text-center text-white`}>
            {passed ? <Trophy className="w-24 h-24 mx-auto mb-6" /> : <XCircle className="w-24 h-24 mx-auto mb-6" />}
            <h2 className="text-6xl font-black mb-4 tracking-tighter">
              {passed ? (language === "pt" ? "CERTIFICADO!" : "CERTIFIED!") : (language === "pt" ? "NÃO APROVADO" : "NOT PASSED")}
            </h2>
            <p className="text-3xl font-bold opacity-90">
              {language === "pt" ? `Pontuação Final: ${finalScore}%` : `Final Score: ${finalScore}%`}
            </p>
          </div>
          <CardContent className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
                <h4 className="text-xs font-black text-gray-400 uppercase mb-2">{language === "pt" ? "Resultado" : "Result"}</h4>
                <p className={`text-xl font-black ${passed ? "text-green-600" : "text-red-600"}`}>
                  {passed ? (language === "pt" ? "APROVADO" : "PASSED") : (language === "pt" ? "REPROVADO" : "FAILED")}
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
                <h4 className="text-xs font-black text-gray-400 uppercase mb-2">{language === "pt" ? "Questões" : "Questions"}</h4>
                <p className="text-xl font-black text-gray-900">{examStates.filter(s => s.status === "completed").length} / {examStates.length}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
                <h4 className="text-xs font-black text-gray-400 uppercase mb-2">{language === "pt" ? "Tempo Restante" : "Time Left"}</h4>
                <p className="text-xl font-black text-gray-900">{formatTime(timeLeft)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-black text-gray-900">{language === "pt" ? "Relatório de Desempenho:" : "Performance Report:"}</h4>
              <div className="grid grid-cols-1 gap-3">
                {examStates.map((state, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <Badge className={state.score > 7 ? "bg-green-500" : state.score > 0 ? "bg-yellow-500" : "bg-red-500"}>
                        {state.score}/10
                      </Badge>
                      <div>
                        <p className="text-sm font-black text-gray-900">{state.question[language].title}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{state.question.node} • {state.attempts} {language === "pt" ? "tentativas" : "attempts"}</p>
                      </div>
                    </div>
                    {state.score > 7 ? <CheckCircle className="w-6 h-6 text-green-500" /> : <AlertCircle className="w-6 h-6 text-yellow-500" />}
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => { setExamFinished(false); setExamStarted(false); }} className="w-full bg-gray-900 hover:bg-black text-white py-8 text-xl font-black rounded-2xl shadow-lg">
              <RotateCcw className="w-6 h-6 mr-3" /> {language === "pt" ? "VOLTAR AO INÍCIO" : "BACK TO START"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentState = examStates[currentIndex];

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Header do Exame */}
      <div className="bg-gray-900 text-white p-4 rounded-t-[2rem] flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-2 rounded-xl">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-lg tracking-tight">RHCSA EXAM ENVIRONMENT</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Red Hat Certified System Administrator Simulation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 bg-gray-800 px-6 py-2 rounded-2xl border border-gray-700">
            <Clock className={`w-5 h-5 ${timeLeft < 600 ? "text-red-500 animate-pulse" : "text-green-400"}`} />
            <span className={`font-mono text-2xl font-black ${timeLeft < 600 ? "text-red-500" : "text-white"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <Button onClick={finishExam} className="bg-red-600 hover:bg-red-700 text-white font-black px-8 py-6 rounded-2xl shadow-lg">
            {language === "pt" ? "FINALIZAR EXAME" : "FINISH EXAM"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white border-x border-b border-gray-200 rounded-b-[2rem] overflow-hidden min-h-[800px]">
        {/* Navegação Lateral (Painel de Questões) */}
        <aside className="lg:col-span-2 bg-gray-50 border-r border-gray-200 p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <List className="w-4 h-4 text-gray-400" />
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">{language === "pt" ? "Lista de Tarefas" : "Task List"}</h4>
          </div>
          <div className="space-y-1 overflow-y-auto max-h-[700px] pr-1 custom-scrollbar">
            {examStates.map((state, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-full text-left p-3 rounded-xl transition-all border-2 flex items-center justify-between group ${
                  currentIndex === idx 
                    ? "bg-white border-red-600 shadow-md scale-[1.02]" 
                    : "bg-transparent border-transparent hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px] ${
                    state.status === "completed" ? "bg-green-500 text-white" : 
                    state.status === "review" ? "bg-yellow-500 text-white" :
                    currentIndex === idx ? "bg-red-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="overflow-hidden">
                    <p className={`text-[10px] font-black truncate ${currentIndex === idx ? "text-red-900" : "text-gray-700"}`}>
                      {state.question[language].title}
                    </p>
                  </div>
                </div>
                {state.status === "completed" && <CheckCircle className="w-3 h-3 text-green-500" />}
                {state.status === "review" && <Flag className="w-3 h-3 text-yellow-500" />}
              </button>
            ))}
          </div>
        </aside>

        {/* Área de Trabalho Principal - Expandida */}
        <main className="lg:col-span-10 p-6 space-y-6 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-600 text-white font-black px-2 py-0.5 text-[10px]">TASK {currentIndex + 1}</Badge>
                <Badge variant="outline" className="border-red-200 text-red-600 font-black text-[10px]">{currentState.question.node}</Badge>
                {currentState.status === "review" && <Badge className="bg-yellow-500 text-white font-black text-[10px]">IN REVIEW</Badge>}
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">{currentState.question[language].title}</h2>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={toggleReview}
                className={`rounded-xl font-bold border-2 h-10 text-xs ${currentState.status === "review" ? "bg-yellow-50 border-yellow-500 text-yellow-700" : "border-gray-200"}`}
              >
                <Flag className="w-3 h-3 mr-2" /> {language === "pt" ? "MARCAR PARA REVISÃO" : "MARK FOR REVIEW"}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Instruções da Tarefa - Agora no topo para dar largura total ao terminal */}
            <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-3 px-6">
                <CardTitle className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-3 h-3" /> {language === "pt" ? "INSTRUÇÕES DO EXAME" : "EXAM INSTRUCTIONS"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg text-gray-800 font-bold leading-relaxed">
                      {currentState.question[language].description}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <h5 className="text-[10px] font-black text-blue-900 uppercase mb-2 tracking-widest">{language === "pt" ? "Passo Atual:" : "Current Step:"}</h5>
                    <p className="text-blue-800 font-bold text-base">
                      {currentState.question[language].commandExplanations[currentState.currentCommandIndex]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terminal de Execução - LARGURA TOTAL */}
            <div className="space-y-4">
              <div className="bg-gray-950 rounded-[2rem] overflow-hidden shadow-2xl border border-gray-800">
                <div className="bg-gray-900 px-6 py-3 flex items-center justify-between border-b border-gray-800">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 font-black uppercase tracking-widest">terminal — {currentState.question.node}</span>
                </div>
                <div className="p-8">
                  <Terminal 
                    expectedCommand={currentState.question.commands[currentState.currentCommandIndex]}
                    onSuccess={handleCommandSuccess}
                    onFailure={handleCommandFailure}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{language === "pt" ? "Tentativas nesta tarefa" : "Attempts on this task"}</p>
                    <p className="text-lg font-black text-gray-900">{currentState.attempts}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{language === "pt" ? "Status" : "Status"}</p>
                    <Badge className={
                      currentState.status === "completed" ? "bg-green-500" : 
                      currentState.status === "review" ? "bg-yellow-500" : "bg-blue-500"
                    }>
                      {currentState.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      disabled={currentIndex === 0}
                      onClick={() => setCurrentIndex(prev => prev - 1)}
                      className="rounded-xl font-bold border-2 h-10 px-4 text-xs"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" /> {language === "pt" ? "ANTERIOR" : "PREV"}
                    </Button>
                    <Button 
                      variant="outline" 
                      disabled={currentIndex === examStates.length - 1}
                      onClick={() => setCurrentIndex(prev => prev + 1)}
                      className="rounded-xl font-bold border-2 h-10 px-4 text-xs"
                    >
                      {language === "pt" ? "PRÓXIMA" : "NEXT"} <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
