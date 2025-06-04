"use client";

import { useState } from "react";
import { Question } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Upload, X } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface QuestionCardProps {
  question: Question;
  answer: any;
  onAnswerChange: (answer: any) => void;
  previousAnswers?: { [key: string]: any };
}

export default function QuestionCard({
  question,
  answer,
  onAnswerChange,
  previousAnswers = {},
}: QuestionCardProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleCardFlip = (optionId: string) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(optionId)) {
      newFlipped.delete(optionId);
    } else {
      newFlipped.add(optionId);
    }
    setFlippedCards(newFlipped);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
  };

  const renderCardsQuestion = () => {
    if (!question.options) return null;

    const handleCardSelection = (optionId: string) => {
      if (question.selectionType === "single") {
        onAnswerChange(optionId);
      } else if (question.selectionType === "multiple") {
        const currentAnswers = Array.isArray(answer) ? answer : [];
        const newAnswers = currentAnswers.includes(optionId)
          ? currentAnswers.filter((id: string) => id !== optionId)
          : [...currentAnswers, optionId];
        onAnswerChange(newAnswers);
      } else if (question.selectionType === "single-with-addon") {
        // For kitchen layout: can select one main layout + optionally island
        const currentAnswers = Array.isArray(answer) ? answer : [];
        const mainLayouts = ["straight", "l-shaped", "u-shaped"];
        const isMainLayout = mainLayouts.includes(optionId);
        const isIsland = optionId === "island";

        if (isMainLayout) {
          // Remove any existing main layout and add the new one
          const withoutMainLayouts = currentAnswers.filter(
            (id: string) => !mainLayouts.includes(id)
          );
          const newAnswers = [optionId, ...withoutMainLayouts];
          onAnswerChange(newAnswers);
        } else if (isIsland) {
          // Toggle island
          const newAnswers = currentAnswers.includes(optionId)
            ? currentAnswers.filter((id: string) => id !== optionId)
            : [...currentAnswers, optionId];
          onAnswerChange(newAnswers);
        }
      }
    };

    const isSelected = (optionId: string) => {
      if (question.selectionType === "single") {
        return answer === optionId;
      } else {
        return Array.isArray(answer) && answer.includes(optionId);
      }
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {question.options.map((option) => {
          const selected = isSelected(option.id);
          const isFlipped = flippedCards.has(option.id);

          return (
            <div key={option.id} className="relative h-32">
              <div
                className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front of card */}
                <Card
                  className={`absolute inset-0 cursor-pointer transition-all hover:shadow-lg backface-hidden ${
                    selected
                      ? "ring-2 ring-primary border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => handleCardSelection(option.id)}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <CardContent className="p-4 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getIcon(option.icon || "Square")}
                      </div>
                      {option.description && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCardFlip(option.id);
                          }}
                        >
                          <Info className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <h3 className="font-medium text-sm">{option.label}</h3>
                  </CardContent>
                </Card>

                {/* Back of card */}
                {option.description && (
                  <Card
                    className="absolute inset-0 cursor-pointer transition-all hover:shadow-lg rotate-y-180 backface-hidden bg-gray-50 dark:bg-gray-800"
                    onClick={() => toggleCardFlip(option.id)}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <CardContent className="p-4 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm">{option.label}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCardFlip(option.id);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                        {option.description}
                      </p>
                      <Button
                        className="mt-2"
                        size="sm"
                        variant={selected ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardSelection(option.id);
                          toggleCardFlip(option.id);
                        }}
                      >
                        {selected ? "Selectat" : "Selectează"}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMeasurementsQuestion = () => {
    if (!question.measurements) return null;

    const currentAnswers = answer || {};
    const currentUnit =
      currentAnswers.unit || question.measurements.defaultUnit;

    const handleMeasurementChange = (fieldId: string, value: string) => {
      const newAnswers = {
        ...currentAnswers,
        [fieldId]: value,
        unit: currentUnit,
      };
      onAnswerChange(newAnswers);
    };

    const handleUnitChange = (unit: string) => {
      const newAnswers = {
        ...currentAnswers,
        unit,
      };
      onAnswerChange(newAnswers);
    };

    // Dynamic fields based on kitchen layout
    const getDynamicFields = () => {
      if (question.id === "kitchen-measurements") {
        const layoutAnswer = previousAnswers["kitchen-layout"];
        const selectedLayouts = Array.isArray(layoutAnswer) ? layoutAnswer : [];
        const hasIsland = selectedLayouts.includes("island");

        let fields = [{ id: "height", label: "Height", required: true }];

        if (selectedLayouts.includes("straight")) {
          fields.unshift({ id: "length-a", label: "A Length", required: true });
        } else if (selectedLayouts.includes("l-shaped")) {
          fields.unshift(
            { id: "length-a", label: "A Length", required: true },
            { id: "length-b", label: "B Length", required: true }
          );
        } else if (selectedLayouts.includes("u-shaped")) {
          fields.unshift(
            { id: "length-a", label: "A Length", required: true },
            { id: "length-b", label: "B Length", required: true },
            { id: "length-c", label: "C Length", required: true }
          );
        }

        if (hasIsland) {
          fields.push(
            { id: "island-length", label: "Island Length", required: true },
            { id: "island-width", label: "Island Width", required: true }
          );
        }

        return fields;
      }

      return question.measurements?.fields || [];
    };

    const fieldsToRender = getDynamicFields();

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Unitatea de măsură</Label>
          <Select value={currentUnit} onValueChange={handleUnitChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {question.measurements.units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldsToRender.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id}>
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id={field.id}
                type="number"
                placeholder={`ex: 200 ${currentUnit}`}
                value={currentAnswers[field.id] || ""}
                onChange={(e) =>
                  handleMeasurementChange(field.id, e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFileUploadQuestion = () => {
    if (!question.fileUpload) return null;

    const currentFiles = Array.isArray(answer) ? answer : [];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        const updatedFiles = [...currentFiles, ...newFiles];
        onAnswerChange(updatedFiles);
      }
    };

    const removeFile = (index: number) => {
      const updatedFiles = currentFiles.filter(
        (_: any, i: number) => i !== index
      );
      onAnswerChange(updatedFiles);
    };

    return (
      <div className="space-y-4">
        {question.fileUpload.helpGif && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              💡 Cum să desenezi o schiță:
            </p>
            <img
              src={question.fileUpload.helpGif}
              alt="Cum să desenezi o schiță"
              className="max-w-full h-auto rounded"
              onError={(e) => {
                // Hide image if it fails to load
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="mb-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
              >
                Încarcă Fișiere
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept={question.fileUpload.acceptedTypes.join(",")}
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {question.fileUpload.description}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tipuri acceptate: {question.fileUpload.acceptedTypes.join(", ")} |
              Max {question.fileUpload.maxSize}MB per fișier | Max{" "}
              {question.fileUpload.maxFiles} fișiere
            </p>
          </div>
        </div>

        {currentFiles.length > 0 && (
          <div className="space-y-2">
            <Label>Fișiere încărcate ({currentFiles.length})</Label>
            <div className="space-y-2">
              {currentFiles.map((file: File, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <span className="text-sm truncate">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {question.title}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        {question.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {question.description}
          </p>
        )}
      </div>

      <div>
        {question.type === "cards" && renderCardsQuestion()}
        {question.type === "measurements" && renderMeasurementsQuestion()}
        {question.type === "file-upload" && renderFileUploadQuestion()}
      </div>
    </div>
  );
}
