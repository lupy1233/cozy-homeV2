"use client";

import { useState, useEffect } from "react";
import {
  getFrontendCategories,
  getFilteredQuestionsForCategory,
  getDatabaseQuestionsForCategory,
} from "@/lib/db-categories";

// Import types from ImprovedQuestionCard
import { Question, QuestionOption } from "./ImprovedQuestionCard";
import ImprovedQuestionCard from "./ImprovedQuestionCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface QuestionsFlowProps {
  selectedCategories: { [categoryId: string]: number };
  onAnswersChange: (answers: any) => void;
  onBack: () => void;
  onNext: () => void;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  image?: string;
}

export default function QuestionsFlow({
  selectedCategories,
  onAnswersChange,
  onBack,
  onNext,
}: QuestionsFlowProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allQuestions, setAllQuestions] = useState<
    Array<{
      question: Question;
      categoryId: string;
      instanceId: string;
    }>
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuestionsForCategory = async (
    categoryId: string,
    previousAnswers: Record<string, any> = {}
  ): Promise<Question[]> => {
    try {
      // Get database questions in ImprovedQuestionCard format directly
      const dbQuestions = await getDatabaseQuestionsForCategory(categoryId);

      console.log(
        `Loaded ${dbQuestions.length} questions for category ${categoryId}`
      );

      return dbQuestions;
    } catch (error) {
      console.error("Error loading questions for category:", categoryId, error);
      // Return empty array instead of fallback questions
      return [];
    }
  };

  const reloadQuestionsWithVisibility = async () => {
    try {
      setLoading(true);

      // Get all current answers for visibility calculation
      const currentAnswers: Record<string, any> = {};
      Object.entries(answers).forEach(([key, value]) => {
        // Extract question ID from answer key (instanceId-questionId format)
        const questionId = key.split("-").slice(1).join("-");
        currentAnswers[questionId] = value;
      });

      const questions: Array<{
        question: Question;
        categoryId: string;
        instanceId: string;
      }> = [];

      for (const [categoryId, quantity] of Object.entries(selectedCategories)) {
        // Load questions with current answers for visibility
        const categoryQuestions = await loadQuestionsForCategory(
          categoryId,
          currentAnswers
        );

        // Create questions for each instance of this category
        for (let i = 1; i <= quantity; i++) {
          categoryQuestions.forEach((question) => {
            questions.push({
              question,
              categoryId,
              instanceId: `${categoryId}-${i}`,
            });
          });
        }
      }

      setAllQuestions(questions);

      // Adjust current question index if needed
      if (currentQuestionIndex >= questions.length && questions.length > 0) {
        setCurrentQuestionIndex(questions.length - 1);
      }
    } catch (err) {
      console.error("Error reloading questions:", err);
      setError("Nu am putut reîncărca întrebările.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load categories first
        const fetchedCategories = await getFrontendCategories();
        setCategories(fetchedCategories);

        // Load initial questions
        await reloadQuestionsWithVisibility();
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("Nu am putut încărca datele. Te rugăm să încerci din nou.");
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(selectedCategories).length > 0) {
      loadInitialData();
    } else {
      setLoading(false);
    }
  }, [selectedCategories]);

  // Note: Removed the automatic reload on answer changes to prevent re-rendering issues
  // Visibility rules will be handled when questions are initially loaded

  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress =
    allQuestions.length > 0
      ? ((currentQuestionIndex + 1) / allQuestions.length) * 100
      : 0;

  const handleAnswerChange = (questionId: string, answer: any) => {
    const newAnswers = {
      ...answers,
      [`${currentQuestion.instanceId}-${questionId}`]: answer,
    };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  const canProceedToNext = () => {
    if (!currentQuestion) return false;

    const answerKey = `${currentQuestion.instanceId}-${currentQuestion.question.id}`;
    const answer = answers[answerKey];

    if (!currentQuestion.question.required) return true;

    // Check if answer exists and is not empty
    if (!answer) return false;

    // For different question types, check if answer is valid
    switch (currentQuestion.question.type) {
      case "cards":
        return Array.isArray(answer) ? answer.length > 0 : !!answer;
      case "measurements":
        return answer && Object.keys(answer).length > 0;
      case "file-upload":
        return (
          !currentQuestion.question.required || (answer && answer.length > 0)
        );
      default:
        return !!answer;
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onNext();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      onBack();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Se încarcă întrebările...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <div className="space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Înapoi la Categorii
            </Button>
            <Button onClick={() => window.location.reload()}>
              Încearcă din nou
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion || allQuestions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          Nu există întrebări pentru categoriile selectate.
        </p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Înapoi la Categorii
        </Button>
      </div>
    );
  }

  const currentCategory = categories.find(
    (c) => c.id === currentQuestion.categoryId
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">
            {currentCategory?.name} - Instanța{" "}
            {currentQuestion.instanceId.split("-")[1]}
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentQuestionIndex + 1} din {allQuestions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <ImprovedQuestionCard
          question={currentQuestion.question}
          answer={
            answers[
              `${currentQuestion.instanceId}-${currentQuestion.question.id}`
            ]
          }
          onAnswerChange={(answer: any) =>
            handleAnswerChange(currentQuestion.question.id, answer)
          }
          previousAnswers={answers}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentQuestionIndex === 0 ? "Înapoi la Categorii" : "Înapoi"}
        </Button>

        <Button onClick={handleNext} disabled={!canProceedToNext()}>
          {currentQuestionIndex === allQuestions.length - 1
            ? "Finalizează"
            : "Următoarea Întrebare"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
