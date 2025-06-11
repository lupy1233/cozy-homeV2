"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function TestDBPage() {
  const { user, isAuthenticated } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    setTestResults([]);

    try {
      addTestResult("🔍 Testing database connection...");

      // Test 1: Basic connection
      const { data, error } = await supabase.from("profiles").select("count");
      if (error) {
        addTestResult(`❌ Database connection failed: ${error.message}`);
        return;
      }
      addTestResult("✅ Database connection successful");

      // Test 2: Check if homes table exists
      const { data: homesTest, error: homesError } = await supabase
        .from("homes")
        .select("id")
        .limit(1);

      if (homesError) {
        addTestResult(`❌ Homes table issue: ${homesError.message}`);
        addTestResult(
          "💡 The 'homes' table might not exist in your Supabase database"
        );
      } else {
        addTestResult("✅ Homes table exists and accessible");
      }

      // Test 3: Check current user authentication
      if (!user) {
        addTestResult("❌ No authenticated user");
        return;
      }
      addTestResult(`✅ User authenticated: ${user.email}`);

      // Test 4: Check user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        addTestResult(`⚠️ User profile issue: ${profileError.message}`);
        addTestResult("💡 User might need a profile in the 'profiles' table");
      } else {
        addTestResult(`✅ User profile found: ${profile.role}`);
      }

      // Test 5: Test homes table structure
      const { data: homeSchema, error: schemaError } = await supabase
        .from("homes")
        .select("*")
        .limit(0);

      if (!schemaError) {
        addTestResult("✅ Homes table schema accessible");
      }
    } catch (error) {
      addTestResult(
        `❌ Unexpected error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const testHomeCreation = async () => {
    setIsLoading(true);
    setTestResults([]);

    try {
      addTestResult("🏠 Testing home creation...");

      if (!user) {
        addTestResult("❌ No user found - not authenticated");
        return;
      }

      addTestResult(`✅ User: ${user.email} (ID: ${user.id})`);

      // Test home creation with minimal data first
      const simpleHomeData = {
        owner_id: user.id,
        name: "Test Home " + Date.now(),
      };

      addTestResult("Testing simple home creation:");
      addTestResult(JSON.stringify(simpleHomeData, null, 2));

      const { data: newHome, error: createError } = await supabase
        .from("homes")
        .insert(simpleHomeData)
        .select()
        .single();

      if (createError) {
        addTestResult(`❌ Home creation failed: ${createError.message}`);
        addTestResult(`Error details: ${JSON.stringify(createError, null, 2)}`);

        // Common issues and solutions
        if (createError.message.includes("permission denied")) {
          addTestResult(
            "💡 Permission denied - Check Row Level Security (RLS) policies"
          );
        }
        if (
          createError.message.includes("relation") &&
          createError.message.includes("does not exist")
        ) {
          addTestResult("💡 Table doesn't exist - Run the database migration");
        }
        return;
      }

      addTestResult(`✅ Home created! ID: ${newHome.id}`);

      // Test reading the home back
      const { data: fetchedHome, error: fetchError } = await supabase
        .from("homes")
        .select("*")
        .eq("id", newHome.id)
        .single();

      if (fetchError) {
        addTestResult(`❌ Failed to fetch created home: ${fetchError.message}`);
      } else {
        addTestResult(
          `✅ Home fetched successfully: ${JSON.stringify(
            fetchedHome,
            null,
            2
          )}`
        );
      }

      // Clean up - delete the test home
      const { error: deleteError } = await supabase
        .from("homes")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", newHome.id);

      if (!deleteError) {
        addTestResult(`✅ Test home cleaned up`);
      }

      addTestResult("🎉 Home creation test completed successfully!");
    } catch (error) {
      addTestResult(
        `❌ Test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generateDatabaseSchema = () => {
    setTestResults([]);
    addTestResult("📋 Database Schema for Supabase:");
    addTestResult("");
    addTestResult("-- Create homes table");
    addTestResult(`CREATE TABLE IF NOT EXISTS homes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  address_json JSONB,
  home_point GEOMETRY(POINT, 4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);`);
    addTestResult("");
    addTestResult("-- Enable Row Level Security");
    addTestResult("ALTER TABLE homes ENABLE ROW LEVEL SECURITY;");
    addTestResult("");
    addTestResult("-- Create RLS policies for homes");
    addTestResult(`CREATE POLICY "Users can view their own homes" ON homes
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own homes" ON homes
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own homes" ON homes
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own homes" ON homes
  FOR DELETE USING (auth.uid() = owner_id);`);
    addTestResult("");
    addTestResult("-- Create profiles table (if not exists)");
    addTestResult(`CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'HOMEOWNER',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  last_login_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);`);
    addTestResult("");
    addTestResult("-- Enable RLS for profiles");
    addTestResult("ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;");
    addTestResult("");
    addTestResult("-- Create RLS policies for profiles");
    addTestResult(`CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);`);
    addTestResult("");
    addTestResult(
      "💡 Copy the above SQL and run it in your Supabase SQL Editor:"
    );
    addTestResult("1. Go to your Supabase dashboard");
    addTestResult("2. Navigate to SQL Editor");
    addTestResult("3. Create a new query");
    addTestResult("4. Paste and run the above SQL");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Database Test</h1>
            <p>Please log in to test database functionality.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>

        <div className="space-y-4 mb-6">
          <Button
            onClick={testDatabaseConnection}
            disabled={isLoading}
            className="mr-4"
          >
            {isLoading ? "Testing..." : "Test Database Connection"}
          </Button>

          <Button
            onClick={testHomeCreation}
            disabled={isLoading}
            className="mr-4"
          >
            {isLoading ? "Testing..." : "Test Home Creation"}
          </Button>

          <Button
            onClick={generateDatabaseSchema}
            disabled={isLoading}
            variant="outline"
          >
            Generate Database Schema
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Test Results:</h2>
          <div className="space-y-1 font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">
                No tests run yet. Click a test button above.
              </p>
            ) : (
              testResults.map((result, index) => (
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
