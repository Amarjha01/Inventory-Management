import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/shared/ui/Button";
import Card from "../../components/shared/ui/Card";

const Language = () => {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("en");

  const handleContinue = () => {
    localStorage.setItem("language", language);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <Card className="w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">
          Axeiro Inventory
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Select Your Language
        </p>

        <div className="space-y-4 mt-8">

          <button
            onClick={() => setLanguage("en")}
            className={`w-full rounded-xl border p-4 ${
              language === "en"
                ? "border-teal-600 bg-teal-50"
                : "border-gray-300"
            }`}
          >
            🇺🇸 English
          </button>

          <button
            onClick={() => setLanguage("hi")}
            className={`w-full rounded-xl border p-4 ${
              language === "hi"
                ? "border-teal-600 bg-teal-50"
                : "border-gray-300"
            }`}
          >
            🇮🇳 हिन्दी
          </button>

        </div>

        <Button
          className="mt-8"
          onClick={handleContinue}
        >
          Continue
        </Button>

      </Card>

    </div>
  );
};

export default Language;