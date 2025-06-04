"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHomes } from "@/contexts/HomeContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import HomeSelection from "@/components/rfq/HomeSelection";
import CategorySelection from "@/components/rfq/CategorySelection";
import QuestionsFlow from "@/components/rfq/QuestionsFlow";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";

type RFQStep = "home" | "categories" | "questions" | "files" | "review";

export default function CreateRFQPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { selectedHome } = useHomes();

  const [currentStep, setCurrentStep] = useState<RFQStep>("home");
  const [selectedCategories, setSelectedCategories] = useState<{
    [categoryId: string]: number;
  }>({});
  const [questionAnswers, setQuestionAnswers] = useState<any>({});
  const [rfqData, setRfqData] = useState<any>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/rfq/create");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const steps: RFQStep[] = ["home", "categories", "questions", "review"];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = (currentStepIndex / (steps.length - 1)) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case "home":
        return !!selectedHome;
      case "categories":
        return Object.keys(selectedCategories).length > 0;
      case "questions":
        return true; // Questions component handles its own validation
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "home":
        return "Selectează Casa";
      case "categories":
        return "Alege Categoriile de Mobilier";
      case "questions":
        return "Completează Detaliile";
      case "review":
        return "Revizuiește Cererea";
      default:
        return "";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "home":
        return <HomeSelection />;
      case "categories":
        return (
          <CategorySelection
            selectedCategories={selectedCategories}
            onSelectionChange={setSelectedCategories}
          />
        );
      case "questions":
        return (
          <QuestionsFlow
            selectedCategories={selectedCategories}
            onAnswersChange={setQuestionAnswers}
            onBack={() => setCurrentStep("categories")}
            onNext={() => setCurrentStep("review")}
          />
        );
      case "review":
        return <div>Review component will go here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Creează o Cerere Nouă
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{getStepTitle()}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progres</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation - Only show for non-questions steps */}
        {currentStep !== "questions" && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Înapoi
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || currentStepIndex === steps.length - 1}
            >
              Următorul Pas
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
