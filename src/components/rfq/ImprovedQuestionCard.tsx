"use client";

import { useState, useEffect } from "react";
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

// Types
export interface QuestionOption {
  id: string;
  option_text: string;
  option_value: string;
  sort_order: number;
  icon?: string;
  description?: string;
  is_addon?: boolean;
  addon_parent_value?: string | null;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: "cards" | "measurements" | "file-upload" | "text" | "number";
  selectionType?: "single" | "multiple" | "single-with-addon";
  required: boolean;
  options?: QuestionOption[];
  measurements?: any;
  fileUpload?: any;
  dependsOn?: {
    questionId: string;
    values: string[];
  };
}

interface ImprovedQuestionCardProps {
  question: Question;
  answer: any;
  onAnswerChange: (answer: any) => void;
  previousAnswers?: { [key: string]: any };
}

export default function ImprovedQuestionCard({
  question,
  answer,
  onAnswerChange,
  previousAnswers = {},
}: ImprovedQuestionCardProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [selectedMain, setSelectedMain] = useState<string | null>(null);
  const [enabledAddons, setEnabledAddons] = useState<QuestionOption[]>([]);

  // Split options into main and addon options
  const mainOptions = question.options?.filter((opt) => !opt.is_addon) || [];
  const addonOptions = question.options?.filter((opt) => opt.is_addon) || [];

  // Initialize selected main and addons from current answer
  useEffect(() => {
    if (
      question.type === "cards" &&
      question.selectionType === "single-with-addon"
    ) {
      const currentAnswers = Array.isArray(answer)
        ? answer
        : answer
        ? [answer]
        : [];

      // Find the main option (non-addon option that's selected)
      const mainOption = mainOptions.find((opt) =>
        currentAnswers.includes(opt.option_value)
      );
      if (mainOption) {
        setSelectedMain(mainOption.option_value);
        updateEnabledAddons(mainOption.option_value);
      } else {
        setSelectedMain(null);
        setEnabledAddons([]);
      }
    }
  }, [answer, question.options]);

  // Update enabled addons based on selected main option
  const updateEnabledAddons = (mainValue: string) => {
    const enabled = addonOptions.filter(
      (addon) =>
        !addon.addon_parent_value || addon.addon_parent_value === mainValue
    );
    setEnabledAddons(enabled);
  };

  const toggleCardFlip = (optionId: string) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(optionId)) {
      newFlipped.delete(optionId);
    } else {
      newFlipped.add(optionId);
    }
    setFlippedCards(newFlipped);
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
  };

  const handleMainOptionChange = (optionValue: string) => {
    console.log("Main option changed:", optionValue);

    setSelectedMain(optionValue);
    updateEnabledAddons(optionValue);

    // Update answer - keep only the new main option, remove all addons
    if (question.selectionType === "single-with-addon") {
      onAnswerChange([optionValue]);
    } else if (question.selectionType === "single") {
      onAnswerChange(optionValue);
    } else if (question.selectionType === "multiple") {
      const currentAnswers = Array.isArray(answer) ? answer : [];
      const mainAnswers = currentAnswers.filter((val) =>
        mainOptions.some((opt) => opt.option_value === val)
      );
      const newAnswers = mainAnswers.includes(optionValue)
        ? mainAnswers.filter((val) => val !== optionValue)
        : [...mainAnswers.filter((val) => val !== optionValue), optionValue];
      onAnswerChange(newAnswers);
    }
  };

  const handleAddonToggle = (addonValue: string) => {
    console.log("Addon toggled:", addonValue);

    const currentAnswers = Array.isArray(answer)
      ? answer
      : answer
      ? [answer]
      : [];
    const newAnswers = currentAnswers.includes(addonValue)
      ? currentAnswers.filter((val) => val !== addonValue)
      : [...currentAnswers, addonValue];

    onAnswerChange(newAnswers);
  };

  const isSelected = (optionValue: string) => {
    if (question.selectionType === "single") {
      return answer === optionValue;
    } else {
      const currentAnswers = Array.isArray(answer)
        ? answer
        : answer
        ? [answer]
        : [];
      return currentAnswers.includes(optionValue);
    }
  };

  const isAddonEnabled = (addon: QuestionOption) => {
    return enabledAddons.some(
      (enabled) => enabled.option_value === addon.option_value
    );
  };

  const renderCardsQuestion = () => {
    if (!question.options?.length) {
      return <div className="text-gray-500">No options available</div>;
    }

    return (
      <div className="space-y-6">
        {/* Main Options */}
        {mainOptions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Layout
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mainOptions.map((option) => {
                const selected = isSelected(option.option_value);
                const isFlipped = flippedCards.has(option.option_value);

                return (
                  <div key={option.option_value} className="relative h-32">
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
                        onClick={() =>
                          handleMainOptionChange(option.option_value)
                        }
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <CardContent className="p-4 h-full flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {getIcon(option.icon) || (
                                <div className="h-6 w-6 bg-gray-300 rounded" />
                              )}
                            </div>
                            {option.description && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCardFlip(option.option_value);
                                }}
                              >
                                <Info className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <h3 className="font-medium text-sm">
                            {option.option_text}
                          </h3>
                        </CardContent>
                      </Card>

                      {/* Back of card */}
                      {option.description && (
                        <Card
                          className="absolute inset-0 cursor-pointer transition-all hover:shadow-lg rotate-y-180 backface-hidden bg-gray-50 dark:bg-gray-800"
                          onClick={() => toggleCardFlip(option.option_value)}
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <CardContent className="p-4 h-full flex flex-col justify-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                              {option.description}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Addon Options */}
        {addonOptions.length > 0 &&
          question.selectionType === "single-with-addon" && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Additional Options
                {!selectedMain && (
                  <span className="text-gray-500 ml-2">
                    (Choose a layout first)
                  </span>
                )}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {addonOptions.map((addon) => {
                  const selected = isSelected(addon.option_value);
                  const enabled = isAddonEnabled(addon);
                  const isFlipped = flippedCards.has(addon.option_value);

                  return (
                    <div key={addon.option_value} className="relative h-32">
                      <div
                        className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${
                          isFlipped ? "rotate-y-180" : ""
                        }`}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {/* Front of card */}
                        <Card
                          className={`absolute inset-0 cursor-pointer transition-all hover:shadow-lg backface-hidden ${
                            !enabled
                              ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                              : selected
                              ? "ring-2 ring-secondary border-secondary bg-secondary/5"
                              : "hover:border-secondary/50"
                          }`}
                          onClick={() =>
                            enabled && handleAddonToggle(addon.option_value)
                          }
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <CardContent className="p-4 h-full flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                              <div
                                className={`p-2 rounded-lg ${
                                  enabled ? "bg-secondary/10" : "bg-gray-200"
                                }`}
                              >
                                {getIcon(addon.icon) || (
                                  <div className="h-6 w-6 bg-gray-300 rounded" />
                                )}
                              </div>
                              {addon.description && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCardFlip(addon.option_value);
                                  }}
                                >
                                  <Info className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                            <h3 className="font-medium text-sm">
                              {addon.option_text}
                            </h3>
                            {!enabled && (
                              <p className="text-xs text-gray-400 mt-1">
                                Not available for this layout
                              </p>
                            )}
                          </CardContent>
                        </Card>

                        {/* Back of card */}
                        {addon.description && (
                          <Card
                            className="absolute inset-0 cursor-pointer transition-all hover:shadow-lg rotate-y-180 backface-hidden bg-gray-50 dark:bg-gray-800"
                            onClick={() => toggleCardFlip(addon.option_value)}
                            style={{
                              backfaceVisibility: "hidden",
                              transform: "rotateY(180deg)",
                            }}
                          >
                            <CardContent className="p-4 h-full flex flex-col justify-center">
                              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                {addon.description}
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    );
  };

  const renderMeasurementsQuestion = () => {
    if (!question.measurements) return null;

    const currentAnswers = answer || {};
    const currentUnit =
      currentAnswers.unit || question.measurements.defaultUnit || "cm";

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

    const fieldsToRender = question.measurements?.fields || [];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Unitatea de măsură</Label>
          <Select value={currentUnit} onValueChange={handleUnitChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {question.measurements.units.map((unit: string) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldsToRender.map((field: any) => (
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
