"use client";

import { useState, useEffect } from "react";
import {
  getFrontendCategories,
  getFrontendQuestionsForCategory,
} from "@/lib/db-categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function TestDbPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCategories = await getFrontendCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("Error loading categories: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestionsForCategory = async (categoryId: string) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedCategoryId(categoryId);
      const fetchedQuestions = await getFrontendQuestionsForCategory(
        categoryId
      );
      setQuestions(fetchedQuestions);
    } catch (err) {
      console.error("Error loading questions:", err);
      setError("Error loading questions: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Database Integration Test</h1>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Categories ({categories.length})
            <Button onClick={loadCategories} disabled={loading} size="sm">
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Reload
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !categories.length ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading categories...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCategoryId === category.id
                      ? "ring-2 ring-primary border-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => loadQuestionsForCategory(category.id)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {category.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      ID: {category.id}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions Section */}
      {selectedCategoryId && (
        <Card>
          <CardHeader>
            <CardTitle>
              Questions for{" "}
              {categories.find((c) => c.id === selectedCategoryId)?.name} (
              {questions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading questions...
              </div>
            ) : questions.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                No questions found for this category. Default questions will be
                used.
              </p>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <Card
                    key={question.id}
                    className="border-l-4 border-l-blue-500"
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium">{question.title}</h4>
                      {question.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {question.description}
                        </p>
                      )}
                      <div className="mt-2 text-xs text-gray-500 space-y-1">
                        <p>Type: {question.type}</p>
                        {question.selectionType && (
                          <p>Selection: {question.selectionType}</p>
                        )}
                        <p>Required: {question.required ? "Yes" : "No"}</p>
                        {question.options && (
                          <p>Options: {question.options.length}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
