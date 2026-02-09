import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { rhcsaQuestions, categories, difficulties, studyGuide, essentialCommands, examWeights } from "@/lib/rhcsaData";
import { getTranslation } from "@/lib/translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Copy, Check, CheckCircle, RotateCcw, Info, Terminal as TerminalIcon, BookOpen, GraduationCap, ChevronRight, Search, Server, AlertTriangle, Star, Zap, PieChart, Shield, HardDrive, Network, User, Container, Cpu, Trophy, ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import Terminal from "@/components/Terminal";
import ExamMode from "@/components/ExamMode";

type ViewMode = "learn" | "practice" | "study" | "exam";

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const t = getTranslation(language);
  
  const [viewMode, setViewMode] = useState<ViewMode>("study");
  const [selectedQuestion, setSelectedQuestion] = useState(rhcsaQuestions[0]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [repetitionCount, setRepetitionCount] = useState(0);
  const [completedCommands, setCompletedCommands] = useState<boolean[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);

  // Safe access to commands and explanations with fallback to empty arrays
  const safeCommands = useMemo(() => {
    if (!selectedQuestion || !Array.isArray(selectedQuestion.commands)) return [];
    return selectedQuestion.commands;
  }, [selectedQuestion]);

  const safeExplanations = useMemo(() => {
    if (!selectedQuestion || !selectedQuestion[language] || !Array.isArray(selectedQuestion[language].commandExplanations)) return [];
    return selectedQuestion[language].commandExplanations;
  }, [selectedQuestion, language]);

  // Reset state when question or mode changes
  useEffect(() => {
    if (!selectedQuestion) return;
    
    // Reset local state
    setCurrentCommandIndex(0);
    setRepetitionCount(0);
    setCompletedCommands(new Array(safeCommands.length).fill(false));

    // Try to load progress from localStorage
    const saved = localStorage.getItem(`rhcsa-progress-${selectedQuestion.id}`);
    if (saved) {
      try {
        const { index, completed } = JSON.parse(saved);
        // Validate saved data against current question
        if (Array.isArray(completed) && completed.length === safeCommands.length) {
          setCurrentCommandIndex(index);
          setCompletedCommands(completed);
        }
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    }
  }, [selectedQuestion, viewMode, safeCommands.length]);

  // Save progress
  useEffect(() => {
    if (!selectedQuestion || viewMode !== "practice") return;
    localStorage.setItem(`rhcsa-progress-${selectedQuestion.id}`, JSON.stringify({
      index: currentCommandIndex,
      completed: completedCommands
    }));
  }, [currentCommandIndex, completedCommands, selectedQuestion?.id, viewMode]);

  const filteredQuestions = useMemo(() => {
    return rhcsaQuestions.filter((q) => {
      const content = q[language];
      const search = content.title.toLowerCase().includes(searchTerm.toLowerCase()) || content.description.toLowerCase().includes(searchTerm.toLowerCase());
      const category = !filterCategory || filterCategory === "all" || content.category === filterCategory;
      const difficulty = !filterDifficulty || filterDifficulty === "all" || q.difficulty === filterDifficulty;
      return search && category && difficulty;
    });
  }, [searchTerm, filterCategory, filterDifficulty, language]);

  const handleSuccess = () => {
    const nextRepCount = repetitionCount + 1;
    setRepetitionCount(nextRepCount);
    
    if (nextRepCount >= 3) {
      const newCompleted = [...completedCommands];
      newCompleted[currentCommandIndex] = true;
      setCompletedCommands(newCompleted);
      
      if (currentCommandIndex < safeCommands.length - 1) {
        setTimeout(() => {
          setCurrentCommandIndex(prev => prev + 1);
          setRepetitionCount(0);
        }, 800);
      }
    }
  };

  const handleFailure = () => {};

  const skipCommand = () => {
    if (currentCommandIndex < safeCommands.length - 1) {
      setCurrentCommandIndex(prev => prev + 1);
      setRepetitionCount(0);
    }
  };

  const resetPractice = () => {
    setCurrentCommandIndex(0);
    setRepetitionCount(0);
    setCompletedCommands(new Array(safeCommands.length).fill(false));
  };

  const nextQuestion = () => {
    const currentIndex = rhcsaQuestions.findIndex(q => q.id === selectedQuestion.id);
    if (currentIndex < rhcsaQuestions.length - 1) {
      setSelectedQuestion(rhcsaQuestions[currentIndex + 1]);
    }
  };

  const prevQuestion = () => {
    const currentIndex = rhcsaQuestions.findIndex(q => q.id === selectedQuestion.id);
    if (currentIndex > 0) {
      setSelectedQuestion(rhcsaQuestions[currentIndex - 1]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "beginner") return "bg-green-100 text-green-800";
    if (difficulty === "intermediate") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getProbabilityBadge = (prob: string) => {
    if (prob === "Essential") return <Badge className="bg-purple-600 text-white flex gap-1 items-center"><Zap className="w-3 h-3" /> {language === "pt" ? "Essencial" : "Essential"}</Badge>;
    if (prob === "High") return <Badge className="bg-red-600 text-white flex gap-1 items-center"><Star className="w-3 h-3" /> {language === "pt" ? "Alta" : "High"}</Badge>;
    return <Badge className="bg-blue-600 text-white flex gap-1 items-center"><Info className="w-3 h-3" /> {language === "pt" ? "Média" : "Medium"}</Badge>;
  };

  const getVersionBadge = (version: string) => {
    if (version === "Both") return <Badge variant="outline" className="border-green-600 text-green-600">RHEL 9 & 10</Badge>;
    if (version === "RHEL 9") return <Badge variant="outline" className="border-blue-600 text-blue-600">RHEL 9</Badge>;
    return <Badge variant="outline" className="border-orange-600 text-orange-600">RHEL 10</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes("Storage")) return <HardDrive className="w-5 h-5" />;
    if (category.includes("Security")) return <Shield className="w-5 h-5" />;
    if (category.includes("Network")) return <Network className="w-5 h-5" />;
    if (category.includes("User")) return <User className="w-5 h-5" />;
    if (category.includes("Containers")) return <Container className="w-5 h-5" />;
    if (category.includes("Automation")) return <Cpu className="w-5 h-5" />;
    return <Info className="w-5 h-5" />;
  };

  if (!selectedQuestion) return null;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="container py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">{t.header.title}</h1>
              <p className="text-gray-600 mt-1 font-medium">{t.header.subtitle}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant={viewMode === "study" ? "default" : "outline"} onClick={() => setViewMode("study")} className="gap-2 rounded-xl">
                <GraduationCap className="w-4 h-4" /> {t.header.study}
              </Button>
              <Button variant={viewMode === "learn" ? "default" : "outline"} onClick={() => setViewMode("learn")} className="gap-2 rounded-xl">
                <BookOpen className="w-4 h-4" /> {t.header.learn}
              </Button>
              <Button variant={viewMode === "practice" ? "default" : "outline"} onClick={() => setViewMode("practice")} className="gap-2 rounded-xl">
                <TerminalIcon className="w-4 h-4" /> {t.header.practice}
              </Button>
              <Button variant={viewMode === "exam" ? "default" : "outline"} onClick={() => setViewMode("exam")} className="gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white border-none">
                <Trophy className="w-4 h-4" /> {language === "pt" ? "Simulado" : "Exam Mode"}
              </Button>
              <div className="flex gap-1 ml-2 border-l pl-4">
                <Button variant={language === "en" ? "default" : "outline"} size="sm" onClick={() => setLanguage("en")} className="rounded-lg">EN</Button>
                <Button variant={language === "pt" ? "default" : "outline"} size="sm" onClick={() => setLanguage("pt")} className="rounded-lg">PT</Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {viewMode === "exam" ? (
          <ExamMode />
        ) : viewMode === "study" ? (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">{t.study.title}</h2>
              <p className="text-xl text-gray-600 font-medium">{t.study.subtitle}</p>
            </div>

            {/* Exam Weights Dashboard */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b-4 border-red-600 pb-2">
                <PieChart className="w-8 h-8 text-red-600" />
                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{language === "pt" ? "Pesos e Importância das Matérias" : "Exam Weights & Importance"}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examWeights.map((item, idx) => (
                  <Card key={idx} className="border-gray-200 hover:shadow-2xl transition-all overflow-hidden group">
                    <div className="h-3 bg-red-600 transition-all group-hover:h-4" style={{ width: `${item.weight}%` }} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="p-3 bg-red-50 rounded-2xl text-red-600 group-hover:scale-110 transition-transform">
                          {getCategoryIcon(item.category)}
                        </div>
                        <span className="text-3xl font-black text-red-600">{item.weight}%</span>
                      </div>
                      <CardTitle className="text-xl font-black mt-4 text-gray-900">{item.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 font-medium leading-relaxed">{item.description[language]}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Essential Commands Expanded */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b-4 border-red-600 pb-2">
                <TerminalIcon className="w-8 h-8 text-red-600" />
                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{t.study.essentialCommands}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {essentialCommands.map((cmd, idx) => (
                  <Card key={idx} className="border-gray-200 hover:border-red-600 transition-all shadow-sm group">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <code className="text-lg font-black text-red-600 bg-red-50 px-3 py-1 rounded-lg">{cmd.command}</code>
                        {cmd.critical && <Badge className="bg-red-600 text-white animate-pulse">CRITICAL</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600 font-bold">{cmd.description[language]}</p>
                      <div className="bg-gray-900 p-3 rounded-xl">
                        <code className="text-xs text-green-400 font-mono">{cmd.example}</code>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Study Guide */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b-4 border-red-600 pb-2">
                <BookOpen className="w-8 h-8 text-red-600" />
                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{t.study.guide}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {studyGuide.map((section, idx) => (
                  <Card key={idx} className="border-gray-200 shadow-lg rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="bg-gray-50 border-b border-gray-100 p-8">
                      <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <div className="bg-red-600 p-2 rounded-xl text-white">
                          {getCategoryIcon(section.title)}
                        </div>
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <ul className="space-y-4">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 group">
                            <div className="mt-1.5 w-2 h-2 rounded-full bg-red-600 group-hover:scale-150 transition-transform" />
                            <span className="text-gray-700 font-medium leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
            <aside className="lg:col-span-3 space-y-6">
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-200 shadow-sm space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder={t.filters.search} 
                      className="pl-10 rounded-xl border-gray-200 focus:ring-red-600"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select onValueChange={setFilterCategory}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder={t.filters.category} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.filters.all}</SelectItem>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setFilterDifficulty}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder={t.filters.difficulty} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.filters.all}</SelectItem>
                      {difficulties.map(d => <SelectItem key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredQuestions.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuestion(q)}
                      className={`w-full text-left p-4 rounded-2xl transition-all border-2 flex flex-col gap-2 group ${
                        selectedQuestion.id === q.id 
                          ? "bg-white border-red-600 shadow-lg scale-[1.02]" 
                          : "bg-transparent border-transparent hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${selectedQuestion.id === q.id ? "text-red-600" : "text-gray-400"}`}>
                          {q.node}
                        </span>
                        <Badge className={`${getDifficultyColor(q.difficulty)} border-none text-[10px] font-black`}>
                          {q.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                      <span className={`font-bold leading-tight ${selectedQuestion.id === q.id ? "text-gray-900" : "text-gray-600"}`}>
                        {q[language].title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <div className="lg:col-span-9 space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge className="bg-red-600 text-white font-black px-3 py-1 rounded-lg">QUESTION {selectedQuestion.id}</Badge>
                    <Badge variant="outline" className="border-red-200 text-red-600 font-black">{selectedQuestion.node}</Badge>
                    {getProbabilityBadge(selectedQuestion.probability)}
                    {getVersionBadge(selectedQuestion.version)}
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">{selectedQuestion[language].title}</h2>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={prevQuestion} disabled={rhcsaQuestions.findIndex(q => q.id === selectedQuestion.id) === 0} className="rounded-xl font-bold border-2">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "pt" ? "Anterior" : "Prev"}
                  </Button>
                  <Button variant="outline" onClick={nextQuestion} disabled={rhcsaQuestions.findIndex(q => q.id === selectedQuestion.id) === rhcsaQuestions.length - 1} className="rounded-xl font-bold border-2">
                    {language === "pt" ? "Próxima" : "Next"} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              <Card className="border-gray-200 shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="bg-gray-50 border-b border-gray-100 p-8">
                  <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <Info className="w-6 h-6 text-red-600" /> {t.learn.description}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-xl text-gray-700 leading-relaxed font-medium">
                    {selectedQuestion[language].description}
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-600 p-2 rounded-xl text-white">
                      <TerminalIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                      {viewMode === "learn" ? t.learn.solution : t.practice.terminal}
                    </h3>
                  </div>
                  {viewMode === "practice" && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={resetPractice} className="rounded-xl font-bold border-2">
                        <RotateCcw className="w-4 h-4 mr-2" /> {t.practice.reset}
                      </Button>
                      <Button variant="outline" size="sm" onClick={skipCommand} className="rounded-xl font-bold border-2">
                        <SkipForward className="w-4 h-4 mr-2" /> {language === "pt" ? "Pular" : "Skip"}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-950 rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-800">
                  <div className="bg-gray-900 px-6 py-3 flex items-center justify-between border-b border-gray-800">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 font-black uppercase tracking-widest">terminal — {selectedQuestion.node}</span>
                  </div>
                  <div className="p-8">
                    {/* Key prop forces re-mount of Terminal when question or mode changes */}
                    <Terminal 
                      key={`${selectedQuestion.id}-${viewMode}-${currentCommandIndex}`}
                      expectedCommand={viewMode === "practice" ? safeCommands[currentCommandIndex] : undefined}
                      onSuccess={handleSuccess}
                      onFailure={handleFailure}
                      showSolution={viewMode === "learn"}
                      solutionCommands={safeCommands}
                      commandExplanations={safeExplanations}
                    />
                  </div>
                </div>

                {viewMode === "practice" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-lg">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">{t.practice.currentTask}</h4>
                      <div className="flex items-start gap-6">
                        <div className="bg-red-50 text-red-600 font-black w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl shadow-sm">
                          {currentCommandIndex + 1}
                        </div>
                        <p className="text-xl text-gray-800 font-bold leading-tight">
                          {safeExplanations[currentCommandIndex] || ""}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <Card className="border-gray-200 shadow-lg rounded-3xl overflow-hidden">
                        <CardHeader className="pb-4 bg-gray-50 border-b">
                          <CardTitle className="text-xs font-black text-gray-500 uppercase tracking-widest">{t.practice.progress}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                          <div className="flex justify-between items-end">
                            <span className="text-4xl font-black text-gray-900">
                              {safeCommands.length > 0 ? Math.round((completedCommands.filter(Boolean).length / safeCommands.length) * 100) : 0}%
                            </span>
                            <span className="text-sm text-gray-500 font-bold uppercase">
                              {completedCommands.filter(Boolean).length} / {safeCommands.length} {t.practice.tasks}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-3 shadow-inner">
                            <div 
                              className="bg-red-600 h-3 rounded-full transition-all duration-700 shadow-lg" 
                              style={{ width: `${safeCommands.length > 0 ? (completedCommands.filter(Boolean).length / safeCommands.length) * 100 : 0}%` }}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-red-600 text-white border-none shadow-2xl rounded-3xl overflow-hidden">
                        <CardHeader className="pb-4 opacity-80">
                          <CardTitle className="text-xs font-black uppercase tracking-widest">{t.practice.repetition}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {[1, 2, 3].map((i) => (
                                <div 
                                  key={i} 
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all shadow-lg ${
                                    repetitionCount >= i ? "bg-white text-red-600 scale-110" : "bg-red-500 text-red-200"
                                  }`}
                                >
                                  {i}
                                </div>
                              ))}
                            </div>
                            <span className="text-sm font-black uppercase opacity-80">{repetitionCount}/3 {t.practice.completed}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
