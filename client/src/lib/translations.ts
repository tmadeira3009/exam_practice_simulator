export type Language = "en" | "pt";

export interface Translations {
  header: {
    title: string;
    subtitle: string;
    learn: string;
    practice: string;
    study: string;
  };
  study: {
    title: string;
    subtitle: string;
    essentialCommands: string;
    studyGuide: string;
    whatYouShouldKnow: string;
    keyCommands: string;
    andMore: string;
    viewSolution: string;
    practiceNow: string;
    startTraining: string;
  };
  sidebar: {
    questions: string;
    total: string;
    search: string;
    category: string;
    allCategories: string;
  };
  content: {
    description: string;
    solution: string;
    showSolution: string;
    hideSolution: string;
    tips: string;
    explanation: string;
  };
  practice: {
    repetitionNotice: string;
    reset: string;
    skip: string;
    currentTask: string;
    progress: string;
    tasks: string;
    repetition: string;
    completed: string;
  };
  difficulties: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: "RHCSA v10 Trainer",
      subtitle: "Master Linux commands through interactive practice",
      learn: "Learn",
      practice: "Practice",
      study: "Study Guide",
    },
    study: {
      title: "Study Guide",
      subtitle: "Complete Preparation Guide for the RHCSA EX200 Exam",
      essentialCommands: "Essential Commands for the Exam",
      studyGuide: "Study Guide by Question",
      whatYouShouldKnow: "What you should know:",
      keyCommands: "Key Commands:",
      andMore: "...and more {count} commands",
      viewSolution: "View Solution",
      practiceNow: "Practice Now",
      startTraining: "Start Practical Training",
    },
    sidebar: {
      questions: "Questions",
      total: "Total",
      search: "Search questions...",
      category: "Category",
      allCategories: "All Categories",
    },
    content: {
      description: "Task Description",
      solution: "Solution",
      showSolution: "Show Solution",
      hideSolution: "Hide Solution",
      tips: "Tips and Tricks",
      explanation: "Explanation",
    },
    practice: {
      repetitionNotice: "Type each command 3 times to memorize it.",
      reset: "Reset",
      skip: "Skip",
      currentTask: "Current Task",
      progress: "Progress",
      tasks: "Tasks",
      repetition: "Repetition",
      completed: "Completed",
    },
    difficulties: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
  },
  pt: {
    header: {
      title: "Treinador RHCSA v10",
      subtitle: "Domine comandos Linux através de prática interativa",
      learn: "Aprender",
      practice: "Praticar",
      study: "Aula Interativa",
    },
    study: {
      title: "Aula Interativa",
      subtitle: "Guia Completo de Preparação para o Exame RHCSA EX200",
      essentialCommands: "Comandos Essenciais para a Prova",
      studyGuide: "Guia de Estudo por Questão",
      whatYouShouldKnow: "O que você deve saber:",
      keyCommands: "Comandos Chave:",
      andMore: "...e mais {count} comandos",
      viewSolution: "Ver Solução",
      practiceNow: "Praticar Agora",
      startTraining: "Começar Treinamento Prático",
    },
    sidebar: {
      questions: "Questões",
      total: "Total",
      search: "Procurar questões...",
      category: "Categoria",
      allCategories: "Todas as Categorias",
    },
    content: {
      description: "Descrição da Tarefa",
      solution: "Solução",
      showSolution: "Ver Solução",
      hideSolution: "Ocultar Solução",
      tips: "Dicas e Truques",
      explanation: "Explicação",
    },
    practice: {
      repetitionNotice: "Digite cada comando 3 vezes para memorizá-lo.",
      reset: "Reiniciar",
      skip: "Pular",
      currentTask: "Tarefa Atual",
      progress: "Progresso",
      tasks: "Tarefas",
      repetition: "Repetição",
      completed: "Concluído",
    },
    difficulties: {
      beginner: "Iniciante",
      intermediate: "Intermediário",
      advanced: "Avançado",
    },
  },
};

export const getTranslation = (lang: Language): Translations => {
  return translations[lang];
};
