"use client";

import { useState } from "react";
import { furnitureCategories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Plus, Minus } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface CategorySelectionProps {
  selectedCategories: { [categoryId: string]: number };
  onSelectionChange: (categories: { [categoryId: string]: number }) => void;
}

export default function CategorySelection({
  selectedCategories,
  onSelectionChange,
}: CategorySelectionProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleCardFlip = (categoryId: string) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(categoryId)) {
      newFlipped.delete(categoryId);
    } else {
      newFlipped.add(categoryId);
    }
    setFlippedCards(newFlipped);
  };

  const updateCategoryQuantity = (categoryId: string, quantity: number) => {
    const newSelection = { ...selectedCategories };
    if (quantity > 0) {
      newSelection[categoryId] = quantity;
    } else {
      delete newSelection[categoryId];
    }
    onSelectionChange(newSelection);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="h-8 w-8" /> : null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Alege Categoriile de Mobilier
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Selectează categoriile de mobilier și cantitatea pentru fiecare. Poți
          apăsa pe butonul info pentru mai multe detalii.
        </p>
      </div>

      {/* Selected Categories Summary */}
      {Object.keys(selectedCategories).length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <h3 className="font-medium mb-2">
            Categorii selectate ({Object.keys(selectedCategories).length}):
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedCategories).map(
              ([categoryId, quantity]) => {
                const category = furnitureCategories.find(
                  (c) => c.id === categoryId
                );
                return category ? (
                  <Badge key={categoryId} variant="secondary">
                    {category.name} ({quantity})
                  </Badge>
                ) : null;
              }
            )}
          </div>
        </div>
      )}

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {furnitureCategories.map((category) => {
          const quantity = selectedCategories[category.id] || 0;
          const isSelected = quantity > 0;
          const isFlipped = flippedCards.has(category.id);

          return (
            <div key={category.id} className="relative h-56">
              <div
                className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front of card */}
                <Card
                  className={`absolute inset-0 cursor-pointer transition-all hover:shadow-lg backface-hidden ${
                    isSelected
                      ? "ring-2 ring-primary border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Info button */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getIcon(category.icon)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardFlip(category.id);
                        }}
                      >
                        <Info className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Category name */}
                    <h3 className="font-semibold text-lg mb-4">
                      {category.name}
                    </h3>

                    {/* Quantity controls */}
                    <div className="mt-auto">
                      {quantity === 0 ? (
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => updateCategoryQuantity(category.id, 1)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adaugă
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Cantitate:
                            </span>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateCategoryQuantity(
                                    category.id,
                                    quantity - 1
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={quantity}
                                onChange={(e) => {
                                  const newQuantity =
                                    parseInt(e.target.value) || 0;
                                  updateCategoryQuantity(
                                    category.id,
                                    newQuantity
                                  );
                                }}
                                className="w-16 text-center"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateCategoryQuantity(
                                    category.id,
                                    quantity + 1
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Back of card */}
                <Card
                  className="absolute inset-0 cursor-pointer transition-all hover:shadow-lg rotate-y-180 backface-hidden bg-gray-50 dark:bg-gray-800"
                  onClick={() => toggleCardFlip(category.id)}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Back button */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardFlip(category.id);
                        }}
                      >
                        ×
                      </Button>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 mb-4">
                      {category.description}
                    </p>

                    {/* Select button */}
                    <Button
                      className="mt-auto"
                      variant={isSelected ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (quantity === 0) {
                          updateCategoryQuantity(category.id, 1);
                        }
                        toggleCardFlip(category.id);
                      }}
                    >
                      {isSelected ? `Selectat (${quantity})` : "Selectează"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        })}
      </div>

      {/* Help text */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Poți selecta multiple categorii și cantități diferite. De exemplu: 2
          Bedrooms + 1 Kitchen + 3 Bathrooms.
        </p>
      </div>
    </div>
  );
}
