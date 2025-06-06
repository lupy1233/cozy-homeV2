"use client";

import { useState, useEffect } from "react";
import {
  getFrontendQuestionsForCategory,
  getFrontendCategories,
} from "@/lib/db-categories";
import { Question, QuestionType, SelectionType } from "@/data/questions";
import QuestionCard from "./QuestionCard";
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [allQuestions, setAllQuestions] = useState<
    Array<{
      question: Question;
      categoryId: string;
      instanceId: string;
    }>
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate default questions for categories that don't have specific questions
  const generateDefaultQuestions = (categoryId: string): Question[] => {
    return [
      {
        id: "measurements",
        title: "Rough measurements",
        description: "Provide the dimensions for your furniture",
        type: "measurements" as QuestionType,
        required: true,
        measurements: {
          fields: [
            { id: "length", label: "Length", required: true },
            { id: "width", label: "Width", required: true },
            { id: "height", label: "Height", required: true },
          ],
          units: ["m", "cm", "mm"],
          defaultUnit: "cm",
        },
      },
      {
        id: "material",
        title: "The door Material",
        type: "cards" as QuestionType,
        selectionType: "multiple" as SelectionType,
        required: true,
        options: [
          {
            id: "pal",
            label: "PAL",
            description: "Particle board with melamine coating",
            icon: "Square",
          },
          {
            id: "mdf-infoliat",
            label: "MDF Infoliat",
            description: "MDF with foil wrapping",
            icon: "Layers",
          },
          {
            id: "mdf-vopsit",
            label: "MDF Vopsit",
            description: "Painted MDF finish",
            icon: "Paintbrush",
          },
        ],
      },
      {
        id: "opening-method",
        title: "The method of Opening",
        type: "cards" as QuestionType,
        selectionType: "single" as SelectionType,
        required: true,
        options: [
          {
            id: "push-to-open",
            label: "Push to Open",
            description: "Touch to open mechanism",
            icon: "Hand",
          },
          {
            id: "maner",
            label: "Maner",
            description: "Traditional handles",
            icon: "Grab",
          },
        ],
      },
    ];
  };

  useEffect(() => {
    const loadQuestionsAndCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load categories first
        const fetchedCategories = await getFrontendCategories();
        setCategories(fetchedCategories);

        // Generate all questions for all selected categories and their instances
        const questions: Array<{
          question: Question;
          categoryId: string;
          instanceId: string;
        }> = [];

        for (const [categoryId, quantity] of Object.entries(
          selectedCategories
        )) {
          // Load questions for this category from database
          const categoryQuestions = await getFrontendQuestionsForCategory(
            categoryId
          );

          // If no specific questions found, use default questions
          const questionsToUse =
            categoryQuestions.length > 0
              ? categoryQuestions
              : generateDefaultQuestions(categoryId);

          // Create questions for each instance of this category
          for (let i = 1; i <= quantity; i++) {
            questionsToUse.forEach((question) => {
              questions.push({
                question,
                categoryId,
                instanceId: `${categoryId}-${i}`,
              });
            });
          }
        }

        setAllQuestions(questions);
        setCurrentQuestionIndex(0);
      } catch (err) {
        console.error("Error loading questions and categories:", err);
        setError(
          "Nu am putut încărca întrebările. Te rugăm să încerci din nou."
        );
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(selectedCategories).length > 0) {
      loadQuestionsAndCategories();
    } else {
      setLoading(false);
    }
  }, [selectedCategories]);

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

      {/* Current Question */}
      <QuestionCard
        question={currentQuestion.question}
        answer={
          answers[
            `${currentQuestion.instanceId}-${currentQuestion.question.id}`
          ]
        }
        onAnswerChange={(answer) =>
          handleAnswerChange(currentQuestion.question.id, answer)
        }
        previousAnswers={
          // Get all previous answers for this instance
          Object.fromEntries(
            Object.entries(answers)
              .filter(([key]) => key.startsWith(currentQuestion.instanceId))
              .map(([key, value]) => [key.split("-").slice(2).join("-"), value])
          )
        }
      />

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentQuestionIndex === 0
            ? "Înapoi la Categorii"
            : "Întrebarea Anterioară"}
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
