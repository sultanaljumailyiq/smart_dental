import React, { useState } from "react";
import {
  CreditCard,
  DollarSign,
  Shield,
  Plus,
  Brain,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  MoreHorizontal,
  Settings,
  Lock,
  Smartphone,
  Globe,
  Building,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const paymentMethods = [
  {
    id: 1,
    type: "Credit Card",
    provider: "Visa",
    lastFour: "4532",
    expiry: "12/25",
    status: "active",
    usage: 450,
    fees: 2.9,
    aiScore: 98,
    fraudRisk: "low",
    icon: CreditCard,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    type: "Credit Card",
    provider: "Mastercard",
    lastFour: "8901",
    expiry: "08/26",
    status: "active",
    usage: 320,
    fees: 2.9,
    aiScore: 96,
    fraudRisk: "low",
    icon: CreditCard,
    color: "bg-red-100 text-red-700",
  },
  {
    id: 3,
    type: "Digital Wallet",
    provider: "Apple Pay",
    lastFour: "N/A",
    expiry: "N/A",
    status: "active",
    usage: 180,
    fees: 2.5,
    aiScore: 99,
    fraudRisk: "very_low",
    icon: Smartphone,
    color: "bg-gray-100 text-gray-700",
  },
  {
    id: 4,
    type: "ACH Transfer",
    provider: "Bank Transfer",
    lastFour: "2847",
    expiry: "N/A",
    status: "active",
    usage: 95,
    fees: 0.8,
    aiScore: 94,
    fraudRisk: "low",
    icon: Building,
    color: "bg-green-100 text-green-700",
  },
  {
    id: 5,
    type: "Insurance",
    provider: "Delta Dental",
    lastFour: "N/A",
    expiry: "12/24",
    status: "pending",
    usage: 0,
    fees: 0,
    aiScore: 92,
    fraudRisk: "low",
    icon: Shield,
    color: "bg-purple-100 text-purple-700",
  },
];

const paymentStats = [
  {
    title: "Total Processed",
    value: "$124,850",
    change: "+12%",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Success Rate",
    value: "98.7%",
    change: "+0.5%",
    icon: CheckCircle,
    color: "text-blue-600",
  },
  {
    title: "AI Fraud Prevention",
    value: "99.2%",
    change: "+1.2%",
    icon: Brain,
    color: "text-purple-600",
  },
  {
    title: "Avg Processing Time",
    value: "2.1s",
    change: "-8%",
    icon: Clock,
    color: "text-teal-600",
  },
];

const fraudAlerts = [
  {
    id: 1,
    type: "Suspicious Pattern",
    description: "Multiple failed attempts from same IP",
    severity: "medium",
    timestamp: "2 hours ago",
    status: "investigating",
  },
  {
    id: 2,
    type: "High-Risk Transaction",
    description: "Large payment from new patient",
    severity: "low",
    timestamp: "4 hours ago",
    status: "cleared",
  },
  {
    id: 3,
    type: "Unusual Location",
    description: "Payment from foreign country",
    severity: "high",
    timestamp: "6 hours ago",
    status: "blocked",
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  inactive: "bg-gray-100 text-gray-800",
  blocked: "bg-red-100 text-red-800",
};

const riskColors = {
  very_low: "bg-green-100 text-green-800",
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            AI-Secured Payment Methods
          </h1>
          <p className="text-gray-600 mt-1">
            Intelligent fraud detection and payment processing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all">
            <Zap className="w-4 h-4" />
            AI Analysis
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            <Plus className="w-4 h-4" />
            Add Method
          </button>
        </div>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paymentStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p
                  className={cn("text-sm flex items-center gap-1", stat.color)}
                >
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </p>
              </div>
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  stat.color === "text-green-600" && "bg-green-100",
                  stat.color === "text-blue-600" && "bg-blue-100",
                  stat.color === "text-purple-600" && "bg-purple-100",
                  stat.color === "text-teal-600" && "bg-teal-100",
                )}
              >
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Methods
              </h3>
              <p className="text-sm text-gray-600">
                Manage accepted payment options
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={cn(
                    "p-6 cursor-pointer transition-colors",
                    selectedMethod === method.id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "hover:bg-gray-50",
                  )}
                  onClick={() =>
                    setSelectedMethod(
                      selectedMethod === method.id ? null : method.id,
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center",
                          method.color,
                        )}
                      >
                        <method.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {method.provider}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {method.type}
                          {method.lastFour !== "N/A" &&
                            ` •••• ${method.lastFour}`}
                        </p>
                        {method.expiry !== "N/A" && (
                          <p className="text-xs text-gray-500">
                            Expires {method.expiry}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">
                            {method.aiScore}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "px-2 py-1 text-xs font-medium rounded-full",
                              statusColors[
                                method.status as keyof typeof statusColors
                              ],
                            )}
                          >
                            {method.status}
                          </span>
                          <span
                            className={cn(
                              "px-2 py-1 text-xs font-medium rounded-full",
                              riskColors[
                                method.fraudRisk as keyof typeof riskColors
                              ],
                            )}
                          >
                            {method.fraudRisk.replace("_", " ")} risk
                          </span>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {selectedMethod === method.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">
                            {method.usage}
                          </p>
                          <p className="text-xs text-gray-600">
                            Transactions this month
                          </p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">
                            {method.fees}%
                          </p>
                          <p className="text-xs text-gray-600">
                            Processing fee
                          </p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">
                            {method.aiScore}%
                          </p>
                          <p className="text-xs text-gray-600">
                            AI Trust Score
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <button className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700">
                          Configure
                        </button>
                        <button className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Fraud Detection */}
        <div className="space-y-6">
          {/* Fraud Alerts */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Fraud Alerts</h3>
                  <p className="text-sm text-gray-600">AI-detected threats</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {fraudAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={cn(
                          "w-4 h-4",
                          alert.severity === "high" && "text-red-600",
                          alert.severity === "medium" && "text-yellow-600",
                          alert.severity === "low" && "text-blue-600",
                        )}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {alert.type}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        alert.status === "investigating" &&
                          "bg-yellow-100 text-yellow-800",
                        alert.status === "cleared" &&
                          "bg-green-100 text-green-800",
                        alert.status === "blocked" && "bg-red-100 text-red-800",
                      )}
                    >
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {alert.description}
                  </p>
                  <p className="text-xs text-gray-500">{alert.timestamp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Security Settings
                  </h3>
                  <p className="text-sm text-gray-600">
                    AI protection features
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    AI Fraud Detection
                  </p>
                  <p className="text-xs text-gray-600">
                    Real-time transaction monitoring
                  </p>
                </div>
                <div className="w-10 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">3D Secure</p>
                  <p className="text-xs text-gray-600">
                    Enhanced card verification
                  </p>
                </div>
                <div className="w-10 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Velocity Checks
                  </p>
                  <p className="text-xs text-gray-600">
                    Unusual spending pattern alerts
                  </p>
                </div>
                <div className="w-10 h-6 bg-gray-300 rounded-full flex items-center justify-start px-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Brain className="w-6 h-6 text-blue-600" />
          AI Payment Optimization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Reduce Processing Fees
                </h3>
                <p className="text-sm text-gray-600">
                  Switch to ACH for large payments
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Potential savings: $240/month
            </p>
            <button className="w-full bg-green-600 text-white text-sm py-2 rounded-lg hover:bg-green-700">
              Apply Suggestion
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Enhanced Security</h3>
                <p className="text-sm text-gray-600">
                  Enable biometric verification
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Reduce fraud risk by 85%
            </p>
            <button className="w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700">
              Enable Feature
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Patient Preferences
                </h3>
                <p className="text-sm text-gray-600">
                  Promote preferred payment methods
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              75% prefer digital payments
            </p>
            <button className="w-full bg-purple-600 text-white text-sm py-2 rounded-lg hover:bg-purple-700">
              Optimize Flow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
