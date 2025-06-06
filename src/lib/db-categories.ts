// Database operations for categories and questions
import { supabase } from "./supabase";
import { Database } from "./database.types";
import { Question, QuestionType, SelectionType } from "@/data/questions";

// Types based on our database schema
type CategoryRow = Database["public"]["Tables"]["request_categories"]["Row"];
type QuestionRow = Database["public"]["Tables"]["request_questions"]["Row"];

export interface DatabaseCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  image_url?: string;
  lang_code: string;
}

export interface DatabaseQuestion {
  id: string;
  category_id: string;
  question_text: string;
  description?: string;
  question_type: string;
  selection_type: string;
  required: boolean;
  options?: any;
  measurements_config?: any;
  file_upload_config?: any;
  depends_on_question_id?: string;
  depends_on_values?: any;
  sort_order: number;
  lang_code: string;
}

// Fetch all categories
export async function getCategories(): Promise<DatabaseCategory[]> {
  try {
    const { data, error } = await supabase
      .from("request_categories")
      .select("*")
      .eq("lang_code", "ro")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      name: row.name || "",
      icon: row.icon || "",
      description: row.description || "",
      image_url: row.image_url || undefined,
      lang_code: row.lang_code || "ro",
    }));
  } catch (error) {
    console.error("Unexpected error fetching categories:", error);
    return [];
  }
}

// Fetch category by ID
export async function getCategoryById(
  id: string
): Promise<DatabaseCategory | null> {
  try {
    const { data, error } = await supabase
      .from("request_categories")
      .select("*")
      .eq("id", id)
      .eq("lang_code", "ro")
      .single();

    if (error) {
      console.error("Error fetching category:", error);
      return null;
    }

    return {
      id: data.id,
      name: data.name || "",
      icon: data.icon || "",
      description: data.description || "",
      image_url: data.image_url || undefined,
      lang_code: data.lang_code || "ro",
    };
  } catch (error) {
    console.error("Unexpected error fetching category:", error);
    return null;
  }
}

// Fetch questions for a category
export async function getQuestionsForCategory(
  categoryId: string
): Promise<DatabaseQuestion[]> {
  try {
    const { data, error } = await supabase
      .from("request_questions")
      .select("*")
      .eq("category_id", categoryId)
      .eq("lang_code", "ro")
      .order("sort_order");

    if (error) {
      console.error("Error fetching questions:", error);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      category_id: row.category_id || "",
      question_text: row.question_text || "",
      description: row.description || undefined,
      question_type: row.question_type || "cards",
      selection_type: row.selection_type || "single",
      required: row.required || false,
      options: row.options,
      measurements_config: row.measurements_config,
      file_upload_config: row.file_upload_config,
      depends_on_question_id: row.depends_on_question_id || undefined,
      depends_on_values: row.depends_on_values,
      sort_order: row.sort_order || 0,
      lang_code: row.lang_code || "ro",
    }));
  } catch (error) {
    console.error("Unexpected error fetching questions:", error);
    return [];
  }
}

// Fetch a specific question by ID
export async function getQuestionById(
  questionId: string
): Promise<DatabaseQuestion | null> {
  try {
    const { data, error } = await supabase
      .from("request_questions")
      .select("*")
      .eq("id", questionId)
      .eq("lang_code", "ro")
      .single();

    if (error) {
      console.error("Error fetching question:", error);
      return null;
    }

    return {
      id: data.id,
      category_id: data.category_id || "",
      question_text: data.question_text || "",
      description: data.description || undefined,
      question_type: data.question_type || "cards",
      selection_type: data.selection_type || "single",
      required: data.required || false,
      options: data.options,
      measurements_config: data.measurements_config,
      file_upload_config: data.file_upload_config,
      depends_on_question_id: data.depends_on_question_id || undefined,
      depends_on_values: data.depends_on_values,
      sort_order: data.sort_order || 0,
      lang_code: data.lang_code || "ro",
    };
  } catch (error) {
    console.error("Unexpected error fetching question:", error);
    return null;
  }
}

// Convert database category to the format expected by the frontend
export function convertToFrontendCategory(dbCategory: DatabaseCategory) {
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    icon: dbCategory.icon,
    description: dbCategory.description,
    image: dbCategory.image_url,
  };
}

// Convert database question to the format expected by the frontend
export function convertToFrontendQuestion(
  dbQuestion: DatabaseQuestion
): Question {
  const question: Question = {
    id: dbQuestion.question_text.toLowerCase().replace(/\s+/g, "-"),
    title: dbQuestion.question_text,
    description: dbQuestion.description,
    type: dbQuestion.question_type as QuestionType,
    required: dbQuestion.required,
  };

  if (dbQuestion.selection_type) {
    question.selectionType = dbQuestion.selection_type as SelectionType;
  }

  if (dbQuestion.options) {
    question.options = dbQuestion.options;
  }

  if (dbQuestion.measurements_config) {
    question.measurements = dbQuestion.measurements_config;
  }

  if (dbQuestion.file_upload_config) {
    question.fileUpload = dbQuestion.file_upload_config;
  }

  if (dbQuestion.depends_on_question_id && dbQuestion.depends_on_values) {
    question.dependsOn = {
      questionId: dbQuestion.depends_on_question_id,
      values: Array.isArray(dbQuestion.depends_on_values)
        ? dbQuestion.depends_on_values
        : [dbQuestion.depends_on_values],
    };
  }

  return question;
}

// Get categories and convert to frontend format
export async function getFrontendCategories() {
  const dbCategories = await getCategories();
  return dbCategories.map(convertToFrontendCategory);
}

// Get questions for category and convert to frontend format
export async function getFrontendQuestionsForCategory(categoryId: string) {
  const dbQuestions = await getQuestionsForCategory(categoryId);
  return dbQuestions.map(convertToFrontendQuestion);
}
