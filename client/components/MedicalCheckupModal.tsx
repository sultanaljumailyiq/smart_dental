import React, { useState } from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Brain,
  Stethoscope,
  Activity,
  Heart,
  Thermometer,
  Eye,
  ClipboardCheck,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicalCheckupModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: {
    name: string;
    id: string;
    avatar: string;
  };
}

const steps = [
  {
    id: 1,
    title: "Medical Data",
    icon: FileText,
    description: "Patient medical information",
  },
  {
    id: 2,
    title: "Treatment Plan",
    icon: Stethoscope,
    description: "Treatment planning and procedures",
  },
  {
    id: 3,
    title: "Oral Check",
    icon: Eye,
    description: "Oral examination and findings",
  },
  {
    id: 4,
    title: "Plan Agreement",
    icon: ClipboardCheck,
    description: "Treatment plan approval",
  },
];

const MedicalCheckupModal = ({
  isOpen,
  onClose,
  patient,
}: MedicalCheckupModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [medicalData, setMedicalData] = useState({
    bloodPressure: { systolic: "130", diastolic: "80" },
    conditions: {
      heartDisease: false,
      covid19: false,
      hemophilia: false,
      hepatitis: false,
      osteoporosis: false,
      otherDisease: false,
    },
    allergies: "",
  });

  const dentalChart = {
    upperTeeth: Array.from({ length: 16 }, (_, i) => ({
      number: i + 11,
      status: "healthy",
    })),
    lowerTeeth: Array.from({ length: 16 }, (_, i) => ({
      number: i + 31,
      status: "healthy",
    })),
  };

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <Brain className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Patient & Medical data are based on previous check, you can
                  update it according to latest data
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Blood Pressure */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Blood pressure
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      value={medicalData.bloodPressure.systolic}
                      onChange={(e) =>
                        setMedicalData({
                          ...medicalData,
                          bloodPressure: {
                            ...medicalData.bloodPressure,
                            systolic: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="130"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">
                      mmHg
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-2xl text-gray-400">/</span>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={medicalData.bloodPressure.diastolic}
                      onChange={(e) =>
                        setMedicalData({
                          ...medicalData,
                          bloodPressure: {
                            ...medicalData.bloodPressure,
                            diastolic: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="80"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">
                      mmHg
                    </p>
                  </div>
                </div>
              </div>

              {/* Particular Sickness */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Particular Sickness
                </label>
                <div className="space-y-3">
                  {[
                    { key: "heartDisease", label: "Heart Disease" },
                    { key: "covid19", label: "Covid-19" },
                    { key: "hemophilia", label: "Hemophilia" },
                    { key: "hepatitis", label: "Hepatitis" },
                    { key: "osteoporosis", label: "Osteoporosis" },
                    { key: "otherDisease", label: "Other Disease" },
                  ].map((condition) => (
                    <div key={condition.key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={condition.key}
                        checked={
                          medicalData.conditions[
                            condition.key as keyof typeof medicalData.conditions
                          ]
                        }
                        onChange={(e) =>
                          setMedicalData({
                            ...medicalData,
                            conditions: {
                              ...medicalData.conditions,
                              [condition.key]: e.target.checked,
                            },
                          })
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={condition.key}
                        className="ml-3 text-sm text-gray-900"
                      >
                        {condition.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergic */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Allergic
                </label>
                <textarea
                  value={medicalData.allergies}
                  onChange={(e) =>
                    setMedicalData({
                      ...medicalData,
                      allergies: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="List any known allergies..."
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Medical service
              </h3>
              <p className="text-sm text-gray-600">Select a problem tooth</p>
            </div>

            {/* Dental Chart */}
            <div className="flex justify-center">
              <svg
                width="400"
                height="300"
                viewBox="0 0 400 300"
                className="border rounded-lg"
              >
                {/* Upper Arch */}
                <g>
                  {dentalChart.upperTeeth.slice(0, 8).map((tooth, index) => {
                    const angle = index * 22.5 - 90;
                    const radius = 80;
                    const x = 200 + radius * Math.cos((angle * Math.PI) / 180);
                    const y = 100 + radius * Math.sin((angle * Math.PI) / 180);

                    return (
                      <g key={tooth.number}>
                        <circle
                          cx={x}
                          cy={y}
                          r="12"
                          className={cn(
                            "cursor-pointer transition-all",
                            selectedTooth === tooth.number
                              ? "fill-blue-200 stroke-blue-600 stroke-2"
                              : "fill-white stroke-gray-300",
                          )}
                          onClick={() =>
                            setSelectedTooth(
                              selectedTooth === tooth.number
                                ? null
                                : tooth.number,
                            )
                          }
                        />
                        <text
                          x={x}
                          y={y + 3}
                          textAnchor="middle"
                          className="text-xs font-medium fill-gray-700 pointer-events-none"
                        >
                          {tooth.number}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* Lower Arch */}
                <g>
                  {dentalChart.lowerTeeth.slice(0, 8).map((tooth, index) => {
                    const angle = index * 22.5 + 90;
                    const radius = 80;
                    const x = 200 + radius * Math.cos((angle * Math.PI) / 180);
                    const y = 200 + radius * Math.sin((angle * Math.PI) / 180);

                    return (
                      <g key={tooth.number}>
                        <circle
                          cx={x}
                          cy={y}
                          r="12"
                          className={cn(
                            "cursor-pointer transition-all",
                            selectedTooth === tooth.number
                              ? "fill-blue-200 stroke-blue-600 stroke-2"
                              : "fill-white stroke-gray-300",
                          )}
                          onClick={() =>
                            setSelectedTooth(
                              selectedTooth === tooth.number
                                ? null
                                : tooth.number,
                            )
                          }
                        />
                        <text
                          x={x}
                          y={y + 3}
                          textAnchor="middle"
                          className="text-xs font-medium fill-gray-700 pointer-events-none"
                        >
                          {tooth.number}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {selectedTooth && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-medium">2nd Molar</span>
                  <span className="text-sm text-gray-600">
                    #{selectedTooth}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-600">Issue:</span>
                    <span className="ml-2">Caries</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Treatment:</span>
                    <span className="ml-2">Filling canal</span>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <textarea
                      placeholder="Sick tooth, so we can filling this tooth for repair"
                      className="w-full border-none resize-none text-sm focus:outline-none"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="flex items-center gap-1 text-red-600 text-sm">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Record findings
                  </button>
                  <button className="flex items-center gap-1 text-blue-600 text-sm">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Next is
                  </button>
                </div>
                <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Save
                </button>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Oral Examination Results
              </h3>
              <p className="text-sm text-gray-600">
                Clinical findings and assessments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Occlusal
                </label>
                <div className="space-y-2">
                  {["Normal Bite", "Cross Bite", "Deep Bite"].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="occlusal"
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-900">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Torus Palatinus
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["No", "Small", "Medium"].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="torus"
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-xs text-gray-900">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Torus Mandibularis
                </label>
                <div className="space-y-2">
                  {["No", "Left side", "Right side", "Both side"].map(
                    (option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="mandibularis"
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-900">
                          {option}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Palatum
                </label>
                <div className="space-y-2">
                  {["No", "Left side", "Right side", "Both side"].map(
                    (option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="palatum"
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-900">
                          {option}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Diastema
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-900">Yes</span>
                </div>
                <textarea
                  placeholder="Explain what and how wide"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={2}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Medical service
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                The results of the examination of all teeth
              </p>
            </div>

            {/* Treatment Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                Treatment Summary
              </h4>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">
                      Tooth #{selectedTooth || "21"}
                    </h5>
                    <p className="text-sm text-gray-600">
                      Recommended: Filling treatment
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="ml-2 font-medium">45 minutes</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cost:</span>
                    <span className="ml-2 font-medium">$150</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Next Visit:</span>
                    <span className="ml-2 font-medium">2 weeks</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Follow-up:</span>
                    <span className="ml-2 font-medium">Required</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  AI Treatment Recommendations
                </span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Preventive fluoride treatment recommended</li>
                <li>• Schedule follow-up in 6 months</li>
                <li>• Consider night guard for bruxism protection</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-yellow-800">
                  ⚠️ Please add Medical checkup & Medical record to finish
                  treatment
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Medical Checkup
            </h2>
            {patient && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-700 text-sm font-medium">
                    {patient.avatar}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{patient.name}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    currentStep >= step.id
                      ? "bg-blue-600 text-white"
                      : currentStep + 1 === step.id
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-400",
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      currentStep >= step.id
                        ? "text-gray-900"
                        : "text-gray-500",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 h-0.5 ml-4",
                      currentStep > step.id ? "bg-blue-600" : "bg-gray-200",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              currentStep === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {currentStep} of {steps.length}
            </span>
          </div>

          {currentStep === steps.length ? (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4" />
              Finish
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalCheckupModal;
