// Database operations for categories and questions
import { supabase } from "./supabase";
import { Database } from "./database.types";
// Define types locally since we removed the hardcoded questions file
export type QuestionType =
  | "cards"
  | "measurements"
  | "file-upload"
  | "text"
  | "number";
export type SelectionType = "single" | "multiple" | "single-with-addon";

export interface FrontendQuestionOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  selectionType?: SelectionType;
  required: boolean;
  options?: FrontendQuestionOption[];
  measurements?: any;
  fileUpload?: any;
  dependsOn?: {
    questionId: string;
    values: string[];
  };
}

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
  options?: QuestionOption[];
  measurements_config?: any;
  file_upload_config?: any;
  depends_on_question_id?: string;
  depends_on_values?: any;
  sort_order: number;
  lang_code: string;
}

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

export interface VisibilityRule {
  id: string;
  parent_question_id: string;
  option_value: string;
  child_question_id: string;
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

// Fetch questions for a category with their options
export async function getQuestionsForCategory(
  categoryId: string
): Promise<DatabaseQuestion[]> {
  try {
    // First, get the questions
    const { data: questions, error: questionsError } = await supabase
      .from("request_questions")
      .select("*")
      .eq("category_id", categoryId)
      .eq("lang_code", "ro")
      .order("sort_order");

    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
      return [];
    }

    // Then, get options for all questions
    const questionIds = questions.map((q) => q.id);
    const { data: options, error: optionsError } = await supabase
      .from("request_question_options")
      .select("*")
      .in("question_id", questionIds)
      .eq("lang_code", "ro")
      .order("sort_order");

    if (optionsError) {
      console.error("Error fetching question options:", optionsError);
      return [];
    }

    // Group options by question_id
    const optionsByQuestion = options.reduce((acc, option) => {
      if (!acc[option.question_id]) {
        acc[option.question_id] = [];
      }
      acc[option.question_id].push({
        id: option.option_value,
        option_text: option.option_text,
        option_value: option.option_value,
        sort_order: option.sort_order || 0,
        icon: option.icon,
        description: option.description,
        is_addon: option.is_addon || false,
        addon_parent_value: option.addon_parent_value,
      });
      return acc;
    }, {} as Record<string, QuestionOption[]>);

    // Map questions with their options
    return questions.map((row) => ({
      id: row.id,
      category_id: row.category_id || "",
      question_text: row.question_text || "",
      description: row.description || undefined,
      question_type: row.question_type || "cards",
      selection_type: row.selection_type || "single",
      required: row.required || false,
      options: optionsByQuestion[row.id] || [],
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

// Fetch a specific question by ID with its options
export async function getQuestionById(
  questionId: string
): Promise<DatabaseQuestion | null> {
  try {
    const { data: question, error: questionError } = await supabase
      .from("request_questions")
      .select("*")
      .eq("id", questionId)
      .eq("lang_code", "ro")
      .single();

    if (questionError) {
      console.error("Error fetching question:", questionError);
      return null;
    }

    // Get options for this question
    const { data: options, error: optionsError } = await supabase
      .from("request_question_options")
      .select("*")
      .eq("question_id", questionId)
      .eq("lang_code", "ro")
      .order("sort_order");

    if (optionsError) {
      console.error("Error fetching question options:", optionsError);
      return null;
    }

    const questionOptions = options.map((option) => ({
      id: option.option_value,
      option_text: option.option_text,
      option_value: option.option_value,
      sort_order: option.sort_order || 0,
    }));

    return {
      id: question.id,
      category_id: question.category_id || "",
      question_text: question.question_text || "",
      description: question.description || undefined,
      question_type: question.question_type || "cards",
      selection_type: question.selection_type || "single",
      required: question.required || false,
      options: questionOptions,
      measurements_config: question.measurements_config,
      file_upload_config: question.file_upload_config,
      depends_on_question_id: question.depends_on_question_id || undefined,
      depends_on_values: question.depends_on_values,
      sort_order: question.sort_order || 0,
      lang_code: question.lang_code || "ro",
    };
  } catch (error) {
    console.error("Unexpected error fetching question:", error);
    return null;
  }
}

// Fetch visibility rules for questions
export async function getVisibilityRules(
  parentQuestionId?: string
): Promise<VisibilityRule[]> {
  try {
    let query = supabase.from("question_visibility_rules").select("*");

    if (parentQuestionId) {
      query = query.eq("parent_question_id", parentQuestionId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching visibility rules:", error);
      return [];
    }

    return data.map((rule) => ({
      id: rule.id,
      parent_question_id: rule.parent_question_id,
      option_value: rule.option_value,
      child_question_id: rule.child_question_id,
    }));
  } catch (error) {
    console.error("Unexpected error fetching visibility rules:", error);
    return [];
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
    id: dbQuestion.id,
    title: dbQuestion.question_text,
    description: dbQuestion.description,
    type: dbQuestion.question_type as QuestionType,
    required: dbQuestion.required,
  };

  if (dbQuestion.selection_type) {
    question.selectionType = dbQuestion.selection_type as SelectionType;
  }

  if (dbQuestion.options && dbQuestion.options.length > 0) {
    // Convert database options to frontend format
    question.options = dbQuestion.options.map((option) => ({
      id: option.option_value,
      label: option.option_text,
      description: option.description,
      icon: option.icon,
    }));
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

// Get filtered questions based on visibility rules and previous answers
export async function getFilteredQuestionsForCategory(
  categoryId: string,
  previousAnswers: Record<string, any> = {}
): Promise<Question[]> {
  try {
    // Get all questions and visibility rules
    const [dbQuestions, visibilityRules] = await Promise.all([
      getQuestionsForCategory(categoryId),
      getVisibilityRules(),
    ]);

    // Convert to frontend format
    const questions = dbQuestions.map(convertToFrontendQuestion);

    // Filter questions based on visibility rules
    const visibleQuestions = questions.filter((question) => {
      // Check if this question has visibility rules
      const rules = visibilityRules.filter(
        (rule) => rule.child_question_id === question.id
      );

      // If no visibility rules, question is always visible
      if (rules.length === 0) {
        return true;
      }

      // Check if any visibility rule is satisfied
      return rules.some((rule) => {
        const parentAnswer = previousAnswers[rule.parent_question_id];
        if (!parentAnswer) return false;

        // Handle both single values and arrays
        if (Array.isArray(parentAnswer)) {
          return parentAnswer.includes(rule.option_value);
        } else {
          return parentAnswer === rule.option_value;
        }
      });
    });

    return visibleQuestions;
  } catch (error) {
    console.error("Error getting filtered questions:", error);
    return [];
  }
}

export interface ImprovedQuestionOption {
  id: string;
  option_text: string;
  option_value: string;
  sort_order: number;
  icon?: string;
  description?: string;
  is_addon?: boolean;
  addon_parent_value?: string | null;
}

export interface ImprovedQuestion {
  id: string;
  title: string;
  description?: string;
  type: "cards" | "measurements" | "file-upload" | "text" | "number";
  selectionType?: "single" | "multiple" | "single-with-addon";
  required: boolean;
  options?: ImprovedQuestionOption[];
  measurements?: any;
  fileUpload?: any;
  dependsOn?: {
    questionId: string;
    values: string[];
  };
}

// Get questions directly from database in ImprovedQuestionCard format
export async function getDatabaseQuestionsForCategory(
  categoryId: string,
  langCode: string = "ro"
): Promise<ImprovedQuestion[]> {
  try {
    // Use the imported supabase instance

    // Get questions for this category
    const { data: questions, error: questionsError } = await supabase
      .from("request_questions")
      .select("*")
      .eq("category_id", categoryId)
      .eq("lang_code", langCode)
      .order("sort_order");

    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
      return [];
    }

    if (!questions?.length) {
      return [];
    }

    const questionIds = questions.map((q) => q.id);

    // Get all options for these questions including addon information
    const { data: options, error: optionsError } = await supabase
      .from("request_question_options")
      .select("*")
      .in("question_id", questionIds)
      .eq("lang_code", langCode)
      .order("sort_order");

    if (optionsError) {
      console.error("Error fetching options:", optionsError);
      return [];
    }

    // Group options by question_id
    const optionsByQuestion =
      options?.reduce((acc, option) => {
        if (!acc[option.question_id]) {
          acc[option.question_id] = [];
        }
        acc[option.question_id].push({
          id: option.id,
          option_text: option.option_text,
          option_value: option.option_value,
          sort_order: option.sort_order || 0,
          icon: option.icon,
          description: option.description,
          is_addon: option.is_addon || false,
          addon_parent_value: option.addon_parent_value,
        });
        return acc;
      }, {} as Record<string, ImprovedQuestionOption[]>) || {};

    // Convert to ImprovedQuestion format
    const improvedQuestions: ImprovedQuestion[] = questions.map((q) => {
      const questionOptions = optionsByQuestion[q.id] || [];

      // Determine selection type based on addon options
      let selectionType: "single" | "multiple" | "single-with-addon" = "single";
      if (questionOptions.some((opt) => opt.is_addon)) {
        selectionType = "single-with-addon";
      }

      return {
        id: q.id,
        title: q.question_text || "Untitled Question",
        description: q.description,
        type: (q.input_type as any) || "cards",
        selectionType,
        required: q.required !== false,
        options: questionOptions.length > 0 ? questionOptions : undefined,
        measurements: q.measurements_config
          ? JSON.parse(q.measurements_config)
          : undefined,
        fileUpload: q.file_upload_config
          ? JSON.parse(q.file_upload_config)
          : undefined,
      };
    });

    return improvedQuestions;
  } catch (error) {
    console.error("Error in getDatabaseQuestionsForCategory:", error);
    return [];
  }
}
