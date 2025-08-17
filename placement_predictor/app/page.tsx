"use client";
import { useState } from "react";

export default function Home() {
  const [inputs, setInputs] = useState({
    iq: "",
    cgpa: "",
    academic: "",
    internship: "",
    comm: "",
    extra: "",
    projects: "",
  });
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fieldLabels = {
    iq: "IQ Score",
    cgpa: "CGPA",
    academic: "Academic Performance",
    internship: "Internship Experience",
    comm: "Communication Skills",
    extra: "Extra-curricular Activities",
    projects: "Number of Projects",
  };

  const fieldDescriptions = {
    iq: "Intelligence Quotient (0-200)",
    cgpa: "Cumulative Grade Point Average (0-10)",
    academic: "Academic performance rating (1-10)",
    internship: "Internship experience (0=No, 1=Yes)",
    comm: "Communication skills rating (1-10)",
    extra: "Extra-curricular activities rating (1-10)",
    projects: "Number of technical projects (0 or more)",
  };

  const fieldLimits = {
    iq: { min: 0, max: 200 },
    cgpa: { min: 0, max: 10, step: 0.1 },
    academic: { min: 1, max: 10 },
    internship: { min: 0, max: 1 },
    comm: { min: 1, max: 10 },
    extra: { min: 1, max: 10 },
    projects: { min: 0, max: 50 },
  };

  // Simple linear regression model function
  function predictScore(input: number[]) {
    return -28.841797314668007 + 
           input[0] * 0.1079845539174013 + 
           input[1] * 1.225804047346464 + 
           input[2] * -0.010188111356505292 + 
           input[3] * 0.04235407811768269 + 
           input[4] * -0.010663467448247333 + 
           input[5] * 0.6457323393079181 + 
           input[6] * 0.6859962350066806;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    const limits = fieldLimits[name as keyof typeof fieldLimits];
    
    // Allow empty values for user to clear the field
    if (value === '') {
      setInputs({ ...inputs, [name]: value });
      return;
    }
    
    // Validate against min/max limits
    if (!isNaN(numValue)) {
      if (numValue >= limits.min && numValue <= limits.max) {
        setInputs({ ...inputs, [name]: value });
      }
      // If value is out of range, don't update (keeps previous valid value)
    }
  };

  const handlePredict = async () => {
    setIsLoading(true);
    
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Input sequence must match DataFrame columns:
      // ["IQ", "CGPA", "Academic_Performance", "Internship_Experience", 
      //  "Extra_Curricular_Score", "Communication_Skills", "Projects_Completed"]
      const inputData = [
        parseFloat(inputs.iq) || 0,           // IQ
        parseFloat(inputs.cgpa) || 0,         // CGPA
        parseInt(inputs.academic) || 0,       // Academic_Performance
        parseInt(inputs.internship) || 0,     // Internship_Experience
        parseInt(inputs.extra) || 0,          // Extra_Curricular_Score
        parseInt(inputs.comm) || 0,           // Communication_Skills
        parseInt(inputs.projects) || 0,       // Projects_Completed
      ];

      console.log("Input data:", inputData);

      // Get prediction using the linear regression function
      const prediction = predictScore(inputData);
      
      console.log("Raw prediction:", prediction);
      
      // Apply sigmoid function to convert raw score to probability (0-1)
      // Sigmoid formula: 1 / (1 + e^(-x))
      const sigmoid = 1 / (1 + Math.exp(-prediction));
      const percentage = sigmoid * 100;
      
      console.log(`Sigmoid value: ${sigmoid}`);
      console.log(`Final percentage: ${percentage}%`);
      
      setScore(Math.max(0, Math.min(100, percentage))); // Ensure 0-100 range
      
    } catch (err) {
      console.error("Prediction error:", err);
      alert(`Prediction failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getColor = () => {
    if (score === null) return "";
    if (score >= 80) return "from-green-500 to-green-600";
    if (score >= 60) return "from-yellow-400 to-yellow-500";
    return "from-red-500 to-red-600";
  };

  const getScoreText = () => {
    if (score === null) return "";
    if (score >= 80) return "Excellent Prospects";
    if (score >= 60) return "Good Prospects";
    return "Needs Improvement";
  };

  const isFormValid = Object.values(inputs).every(value => value !== "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Placement Predictor
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Predict your placement success probability using advanced machine learning algorithms
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {Object.keys(inputs).map((key, index) => (
              <div
                key={key}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {fieldLabels[key as keyof typeof fieldLabels]}
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  {fieldDescriptions[key as keyof typeof fieldDescriptions]}
                  <span className="text-blue-600 font-medium ml-1">
                    (Range: {fieldLimits[key as keyof typeof fieldLimits].min}-{fieldLimits[key as keyof typeof fieldLimits].max})
                  </span>
                </p>
                <input
                  type="number"
                  name={key}
                  value={(inputs as any)[key]}
                  onChange={handleChange}
                  min={fieldLimits[key as keyof typeof fieldLimits].min}
                  max={fieldLimits[key as keyof typeof fieldLimits].max}
                  step={fieldLimits[key as keyof typeof fieldLimits].step || 1}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-gray-300 group-hover:shadow-md text-black font-semibold text-lg"
                  placeholder="Enter value"
                />
              </div>
            ))}
          </div>

          {/* Predict Button */}
          <div className="text-center">
            <button
              onClick={handlePredict}
              disabled={!isFormValid || isLoading}
              className={`px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isFormValid && !isLoading
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  : "bg-gray-400"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </div>
              ) : (
                "Predict Placement Score"
              )}
            </button>
          </div>
        </div>

        {/* Results Card */}
        {score !== null && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 animate-slide-up">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Prediction Results</h3>
              
              {/* Score Circle */}
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r ${getColor()} shadow-lg mb-6 animate-scale-in`}>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {score.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Score Description */}
              <div className={`inline-block px-6 py-3 rounded-full text-white font-semibold text-lg bg-gradient-to-r ${getColor()} shadow-lg animate-fade-in`}>
                {getScoreText()}
              </div>

              {/* Score Interpretation */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-600 font-medium">
                  {score >= 80 ? (
                    "🎉 Excellent! You have a high probability of successful placement. Keep up the great work!"
                  ) : score >= 60 ? (
                    "👍 Good prospects! Consider improving in areas where you scored lower to increase your chances."
                  ) : (
                    "💪 Focus on skill development and gaining more experience to improve your placement prospects."
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}