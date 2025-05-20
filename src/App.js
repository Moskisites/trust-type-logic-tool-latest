import React, { useState, useEffect } from 'react';

export default function TrustTypeLogicApp() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('trustAnswers');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('trustAnswers', JSON.stringify(answers));
  }, [answers]);

  const questions = [
    {
      id: 'control',
      text: 'Do you want to retain the ability to change, revoke, or cancel the trust at any time?',
    },
    {
      id: 'asset_protection',
      text: 'Are you concerned about lawsuits, creditors, or divorce potentially affecting your assets?',
    },
    {
      id: 'estate_tax',
      text: 'Is your estate projected to exceed the federal estate tax exemption (~$13.61M)?',
    },
    {
      id: 'medicaid',
      text: 'Do you plan to apply for Medicaid/Medi-Cal long-term care within 5 years?',
    },
    {
      id: 'gifting',
      text: 'Do you want to give away assets permanently to reduce your taxable estate?',
    },
    {
      id: 'control_goals',
      text: 'Are your main goals avoiding probate, maintaining privacy, and retaining control over your assets?',
    },
  ];

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [questions[step].id]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep('result');
    }
  };

  const determineTrustType = () => {
    const {
      control,
      asset_protection,
      estate_tax,
      medicaid,
      gifting,
      control_goals,
    } = answers;

    if (
      asset_protection === 'yes' ||
      estate_tax === 'yes' ||
      medicaid === 'yes' ||
      gifting === 'yes'
    ) {
      return 'Irrevocable Trust';
    }

    if (control === 'yes' && control_goals === 'yes') {
      return 'Revocable Living Trust';
    }

    return 'Further clarification needed – consider speaking with a trust advisor.';
  };

  const downloadSummary = () => {
    const blob = new Blob([
      `Trust Type Logic Summary\n\n` +
        questions.map(q => `${q.text}\nAnswer: ${answers[q.id] || 'N/A'}\n\n`).join('') +
        `Recommended Trust Type: ${determineTrustType()}`
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Trust_Type_Recommendation.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Trust Type Logic Tool</h1>
      {step === 'result' ? (
        <div>
          <h2 className="text-xl font-semibold">Recommended Trust Type:</h2>
          <p className="mt-2 text-lg text-green-700">{determineTrustType()}</p>
          <button
            onClick={downloadSummary}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Download Summary
          </button>
        </div>
      ) : (
        <div>
          <p className="text-lg mb-4">{questions[step].text}</p>
          <div className="flex space-x-4">
            <button
              onClick={() => handleAnswer('yes')}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer('no')}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
