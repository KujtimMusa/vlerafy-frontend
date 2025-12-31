'use client';

import React, { useState } from 'react';
import { Store, TrendingUp, Package, AlertCircle } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

interface StoryStep {
  step: number;
  title: string;
  explanation: string;
  impact: number;
  impact_pct: number;
  confidence: number;
  data_points: any;
  reasoning: string;
}

interface PriceStory {
  steps: StoryStep[];
  total_impact: number;
  total_impact_pct: number;
  base_price: number;
  recommended_price: number;
  confidence: number;
  summary: string;
}

interface Props {
  priceStory: PriceStory;
}

export function PriceStoryExplainer({ priceStory }: Props) {
  // 🆕 NEU: State für expanded Details - Step 1 default open
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1]));
  
  const toggleStep = (step: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(step)) {
      newExpanded.delete(step);
    } else {
      newExpanded.add(step);
    }
    setExpandedSteps(newExpanded);
  };
  
  // Icon mapping
  const getStepIcon = (step: number) => {
    const icons: Record<number, typeof Store> = {
      1: Store,
      2: TrendingUp,
      3: Package,
    };
    const Icon = icons[step] || AlertCircle;
    return Icon;
  };

  // Color based on impact
  const getImpactColor = (impact: number) => {
    if (impact > 0) {
      return {
        bg: 'bg-green-50',
        border: 'border-green-300',
        text: 'text-green-600',
        bar: 'bg-green-500'
      };
    } else if (impact < 0) {
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        text: 'text-orange-600',
        bar: 'bg-orange-500'
      };
    }
    return {
      bg: 'bg-gray-50',
      border: 'border-gray-300',
      text: 'text-gray-600',
      bar: 'bg-gray-500'
    };
  };

  // Berechne maxImpact - mindestens 1 für Division, aber ignoriere 0-Impacts
  const impacts = priceStory.steps.map(s => Math.abs(s.impact)).filter(i => i > 0);
  const maxImpact = impacts.length > 0 ? Math.max(...impacts) : 1;

  // Format explanation with bold text
  const formatExplanation = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  if (!priceStory || !priceStory.steps || priceStory.steps.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Main Story Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          📖 Warum empfehlen wir {formatCurrency(priceStory.recommended_price)}?
        </h3>

        {/* Story Steps */}
        <div className="space-y-6">
          {priceStory.steps.map((step) => {
            const Icon = getStepIcon(step.step);
            const colors = getImpactColor(step.impact);
            const isExpanded = expandedSteps.has(step.step);

            return (
              <div key={step.step} className="flex gap-4">
                {/* Step Number Badge */}
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                  {step.step}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">
                        {step.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded text-xs font-medium text-blue-700">
                      {step.confidence}% sicher
                    </div>
                  </div>

                  {/* Explanation */}
                  <p 
                    className="text-sm text-gray-700 mb-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatExplanation(step.explanation) }}
                  />

                  {/* Impact Bar */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${colors.bar} transition-all duration-500`}
                          style={{ width: `${(Math.abs(step.impact) / maxImpact) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${colors.text} min-w-[80px] text-right tabular-nums`}>
                      {step.impact > 0 ? '+' : ''}{step.impact === 0 ? '±' : ''}{formatCurrency(Math.abs(step.impact))}
                    </div>
                  </div>

                  {/* 🆕 GEÄNDERT: Controlled Details statt <details> */}
                  {step.reasoning && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleStep(step.step)}
                        className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
                      >
                        <span>{isExpanded ? '▼' : '▶'}</span>
                        <span>💡 {isExpanded ? 'Weniger Details' : 'Mehr Details anzeigen'}</span>
                      </button>
                      
                      {isExpanded && (
                        <div 
                          className="mt-2 text-xs text-gray-600 pl-4 border-l-2 border-blue-200 leading-relaxed animate-fadeIn"
                          dangerouslySetInnerHTML={{ __html: formatExplanation(step.reasoning) }}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Impact Summary */}
        <div className="mt-8 pt-6 border-t-2 border-blue-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p 
                className="text-sm text-gray-700 mb-1 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: `<strong>Gesamt-Effekt:</strong> ${formatExplanation(priceStory.summary)}` }}
              />
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold tabular-nums ${priceStory.total_impact > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                {priceStory.total_impact > 0 ? '+' : ''}{formatCurrency(priceStory.total_impact)}
              </div>
              <div className="text-xs text-gray-600 tabular-nums">
                {formatCurrency(priceStory.base_price)} → {formatCurrency(priceStory.recommended_price)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Data Transparency Panel */}
      <details className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-blue-600 hover:bg-gray-50 transition flex items-center gap-2">
          🔍 Zeig mir die Rohdaten hinter dieser Analyse
        </summary>
        
        <div className="p-4 space-y-4 border-t border-gray-200 bg-gray-50">
          {priceStory.steps.map((step) => (
            <div key={step.step} className="bg-white rounded-lg p-4 border border-gray-200">
              <h5 className="font-semibold text-gray-900 mb-3">
                Schritt {step.step}: {step.title}
              </h5>
              <pre className="text-xs bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto font-mono">
                {JSON.stringify(step.data_points, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

