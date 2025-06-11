"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function PopulateKitchenAnswersPage() {
  const { user, isAuthenticated } = useAuth();
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const kitchenQuestionsData = [
    {
      question_text: "Layout of the kitchen",
      options: [
        {
          id: "straight",
          label: "În linie",
          description: "Bucătărie în linie dreaptă de-a lungul unui perete",
          icon: "Minus",
        },
        {
          id: "l-shaped",
          label: "În formă de L",
          description: "Bucătărie dispusă în unghi de 90 de grade",
          icon: "CornerDownRight",
        },
        {
          id: "u-shaped",
          label: "În formă de U",
          description: "Bucătărie pe trei laturi, în formă de U",
          icon: "Square",
        },
        {
          id: "parallel",
          label: "Paralelă",
          description: "Bucătărie pe două laturi paralele",
          icon: "Equal",
        },
        {
          id: "island",
          label: "Cu insulă",
          description: "Bucătărie cu insulă centrală",
          icon: "Circle",
        },
      ],
    },
    {
      question_text: "The door Material",
      options: [
        {
          id: "pal",
          label: "PAL (Melaminat)",
          description:
            "Plăci aglomerate cu înveliș melaminat - rezistent și economic",
          icon: "Square",
        },
        {
          id: "mdf-infoliat",
          label: "MDF Înfoliat",
          description: "MDF cu folie PVC - aspect modern și ușor de întreținut",
          icon: "Layers",
        },
        {
          id: "mdf-vopsit",
          label: "MDF Vopsit",
          description: "MDF vopsit în culori mate sau lucioase",
          icon: "Paintbrush",
        },
        {
          id: "lacuit",
          label: "Lacuit",
          description: "Finisaj lacuit de înaltă calitate cu aspect lucios",
          icon: "Sparkles",
        },
        {
          id: "furnir",
          label: "Furnir",
          description: "Furnir din lemn natural pentru aspect elegant",
          icon: "TreePine",
        },
        {
          id: "lemn-masiv",
          label: "Lemn Masiv",
          description: "Lemn masiv - cea mai naturală și durabilă opțiune",
          icon: "Tree",
        },
      ],
    },
    {
      question_text: "The method of Opening the bottom part of the kitchen",
      options: [
        {
          id: "push-to-open",
          label: "Push to Open",
          description: "Deschidere prin apăsare - fără mânere vizibile",
          icon: "Hand",
        },
        {
          id: "profil-gola",
          label: "Profil Gola",
          description: "Mâner integrat în profil - aspect minimalist",
          icon: "Grip",
        },
        {
          id: "manere-clasice",
          label: "Mânere Clasice",
          description: "Mânere tradiționale din metal sau lemn",
          icon: "Grab",
        },
        {
          id: "manere-moderne",
          label: "Mânere Moderne",
          description: "Mânere contemporane din aluminiu sau inox",
          icon: "Menu",
        },
      ],
    },
    {
      question_text: "The method of opening the top part",
      options: [
        {
          id: "push-to-open",
          label: "Push to Open",
          description: "Deschidere prin apăsare pentru dulapuri suspendate",
          icon: "Hand",
        },
        {
          id: "profil-banda-led",
          label: "Profil cu Bandă LED",
          description: "Mâner cu iluminare LED integrată",
          icon: "Lightbulb",
        },
        {
          id: "manere-suspendate",
          label: "Mânere Suspendate",
          description: "Mânere speciale pentru dulapuri suspendate",
          icon: "Grab",
        },
        {
          id: "deschidere-verticala",
          label: "Deschidere Verticală",
          description: "Uși care se deschid în sus cu amortizoare",
          icon: "ArrowUp",
        },
      ],
    },
    {
      question_text: "The Material of the Worktop",
      options: [
        {
          id: "quartz",
          label: "Cuarț",
          description: "Suprafață din cuarț - durabilă și nonporoasă",
          icon: "Gem",
        },
        {
          id: "granit",
          label: "Granit",
          description: "Piatră naturală granit - elegantă și rezistentă",
          icon: "Mountain",
        },
        {
          id: "lemn-masiv",
          label: "Lemn Masiv",
          description: "Blat din lemn masiv - cald și natural",
          icon: "TreePine",
        },
        {
          id: "laminat",
          label: "Laminat",
          description: "Laminat HPL - economic și disponibil în multe variante",
          icon: "Square",
        },
        {
          id: "compozit",
          label: "Compozit",
          description: "Material compozit - rezistent la zgârieturi și pete",
          icon: "Layers",
        },
        {
          id: "marmura",
          label: "Marmură",
          description: "Marmură naturală - aspect luxos și elegant",
          icon: "Crown",
        },
        {
          id: "inox",
          label: "Inox",
          description: "Oțel inoxidabil - ideal pentru bucătării profesionale",
          icon: "Chrome",
        },
      ],
    },
    {
      question_text: "The Material of the ContraBlat",
      options: [
        {
          id: "fara",
          label: "Fără ContraBlat",
          description: "Nu se dorește contraBlat",
          icon: "X",
        },
        {
          id: "faience",
          label: "Faianță",
          description: "Faianță ceramică - clasică și ușor de curățat",
          icon: "Square",
        },
        {
          id: "sticla",
          label: "Sticlă",
          description: "Panou din sticlă securizată - modern și elegant",
          icon: "Sparkles",
        },
        {
          id: "piatra-naturala",
          label: "Piatră Naturală",
          description: "Piatră naturală - marmură, granit sau travertin",
          icon: "Mountain",
        },
        {
          id: "mdf-vopsit",
          label: "MDF Vopsit",
          description: "MDF vopsit în culoarea dorită",
          icon: "Paintbrush",
        },
        {
          id: "lemn",
          label: "Lemn",
          description: "ContraBlat din lemn masiv sau furnir",
          icon: "TreePine",
        },
        {
          id: "mozaic",
          label: "Mozaic",
          description: "Mozaic ceramic sau din sticlă",
          icon: "Grid3x3",
        },
      ],
    },
  ];

  const populateKitchenOptions = async () => {
    setIsLoading(true);
    setResults([]);

    try {
      addResult("🔄 Starting kitchen options population...");

      // First, get all kitchen questions
      const { data: questions, error: questionsError } = await supabase
        .from("request_questions")
        .select("*")
        .eq("category_id", "01234567-89ab-cdef-0123-456789abcde1")
        .eq("lang_code", "ro");

      if (questionsError) {
        addResult(`❌ Error fetching questions: ${questionsError.message}`);
        return;
      }

      addResult(`✅ Found ${questions.length} kitchen questions`);

      // Update each question with the corresponding options
      for (const questionData of kitchenQuestionsData) {
        const question = questions.find(
          (q) =>
            q.question_text?.includes(questionData.question_text) ||
            questionData.question_text.includes(q.question_text || "")
        );

        if (!question) {
          addResult(`⚠️ Question not found: ${questionData.question_text}`);
          continue;
        }

        addResult(`🔄 Updating "${question.question_text}"...`);

        const { error: updateError } = await supabase
          .from("request_questions")
          .update({
            options: questionData.options,
            updated_at: new Date().toISOString(),
          })
          .eq("id", question.id);

        if (updateError) {
          addResult(
            `❌ Error updating ${question.question_text}: ${updateError.message}`
          );
        } else {
          addResult(
            `✅ Updated "${question.question_text}" with ${questionData.options.length} options`
          );
        }

        // Small delay to avoid overwhelming the database
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      addResult("🎉 Kitchen options population completed!");
    } catch (error) {
      addResult(
        `❌ Unexpected error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const viewCurrentOptions = async () => {
    setIsLoading(true);
    setResults([]);

    try {
      addResult("🔍 Fetching current kitchen question options...");

      const { data: questions, error } = await supabase
        .from("request_questions")
        .select("*")
        .eq("category_id", "01234567-89ab-cdef-0123-456789abcde1")
        .eq("lang_code", "ro")
        .order("sort_order");

      if (error) {
        addResult(`❌ Error: ${error.message}`);
        return;
      }

      addResult(`📋 Found ${questions.length} kitchen questions:`);
      addResult("");

      questions.forEach((question, index) => {
        addResult(`${index + 1}. ${question.question_text}`);
        addResult(`   Type: ${question.question_type}`);
        addResult(`   Selection: ${question.selection_type}`);
        addResult(`   Required: ${question.required}`);

        if (question.options && Array.isArray(question.options)) {
          addResult(`   Options (${question.options.length}):`);
          question.options.forEach((option: any, i: number) => {
            addResult(`     ${i + 1}. ${option.label} (${option.id})`);
            if (option.description) {
              addResult(`        ${option.description}`);
            }
          });
        } else {
          addResult(`   ⚠️ No options configured`);
        }
        addResult("");
      });
    } catch (error) {
      addResult(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Kitchen Options Population
            </h1>
            <p>Please log in to populate kitchen question options.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          Populate Kitchen Question Options
        </h1>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="font-semibold mb-2">What this tool does:</h2>
          <ul className="text-sm space-y-1">
            <li>
              • Updates kitchen questions with comprehensive Romanian answer
              options
            </li>
            <li>• Adds proper descriptions and icons for each option</li>
            <li>
              • Ensures all questions have the correct selection types and
              requirements
            </li>
          </ul>
        </div>

        <div className="space-y-4 mb-6">
          <Button
            onClick={viewCurrentOptions}
            disabled={isLoading}
            variant="outline"
            className="mr-4"
          >
            {isLoading ? "Loading..." : "View Current Options"}
          </Button>

          <Button onClick={populateKitchenOptions} disabled={isLoading}>
            {isLoading ? "Populating..." : "Populate Kitchen Options"}
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Results:</h2>
          <div className="space-y-1 font-mono text-sm max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-500">
                No operations performed yet. Click a button above.
              </p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
