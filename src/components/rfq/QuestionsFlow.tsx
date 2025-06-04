"use client";

import { useState, useEffect } from "react";
import {
  getQuestionsForCategory,
  generateDefaultQuestions,
  Question,
} from "@/data/questions";
import { getCategoriesByIds } from "@/data/categories";
import QuestionCard from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface QuestionsFlowProps {
  selectedCategories: { [categoryId: string]: number };
  onAnswersChange: (answers: any) => void;
  onBack: () => void;
  onNext: () => void;
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

  useEffect(() => {
    // Generate all questions for all selected categories and their instances
    const questions: Array<{
      question: Question;
      categoryId: string;
      instanceId: string;
    }> = [];

    Object.entries(selectedCategories).forEach(([categoryId, quantity]) => {
      for (let i = 1; i <= quantity; i++) {
        const categoryQuestions = getQuestionsForCategory(categoryId);
        const questionsToUse =
          categoryQuestions.length > 0
            ? categoryQuestions
            : generateDefaultQuestions(categoryId);

        questionsToUse.forEach((question) => {
          questions.push({
            question,
            categoryId,
            instanceId: `${categoryId}-${i}`,
          });
        });
      }
    });

    setAllQuestions(questions);
    setCurrentQuestionIndex(0);
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

  if (!currentQuestion) {
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

  const categories = getCategoriesByIds(Object.keys(selectedCategories));
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
