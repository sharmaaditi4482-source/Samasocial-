import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  Loader,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { schemesAPI } from '../services/api';

interface Scheme {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  eligibility: string[];
  requiredDocuments: string[];
  howToApply: string[];
  applicationMethod: string;
  officialWebsite: string;
  faqItems: Array<{ question: string; answer: string }>;
}

interface EligibilityAnswer {
  isLandowner?: boolean;
  isTenantFarmer?: boolean;
  landSize?: number;
  income?: number;
  age?: number;
  hasInsurance?: boolean;
  hasBankAccount?: boolean;
  hasIrrigationPotential?: boolean;
  hasPensionScheme?: boolean;
  isBPL?: boolean;
  hasHouse?: boolean;
  isSCSTOrWoman?: boolean;
  isRural?: boolean;
}

interface EligibleScheme {
  id: string;
  name: string;
  category: string;
  eligibilityScore: number;
  likelyEligible: boolean;
}

interface GovernmentSchemesProps {
  onNavigate?: (page: string) => void;
}

export const GovernmentSchemes: React.FC<GovernmentSchemesProps> = ({ onNavigate }) => {
  const { darkMode } = useTheme();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);
  const [showEligibilityCheck, setShowEligibilityCheck] = useState(false);
  const [eligibilityAnswers, setEligibilityAnswers] = useState<EligibilityAnswer>({});
  const [eligibleSchemes, setEligibleSchemes] = useState<EligibleScheme[]>([]);
  const [showEligibilityResults, setShowEligibilityResults] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  // Load schemes and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [schemesRes, categoriesRes] = await Promise.all([
          schemesAPI.getAllSchemes(),
          schemesAPI.getCategories(),
        ]);
        setSchemes(schemesRes.data || []);
        setFilteredSchemes(schemesRes.data || []);
        setCategories(categoriesRes.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load schemes');
        console.error('Error loading schemes:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter schemes based on search and category
  useEffect(() => {
    let filtered = schemes;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query)
      );
    }

    setFilteredSchemes(filtered);
  }, [schemes, searchQuery, selectedCategory]);

  const handleCheckEligibility = async () => {
    try {
      setCheckingEligibility(true);
      const response = await schemesAPI.checkEligibility(eligibilityAnswers);
      setEligibleSchemes(response.data?.eligibleSchemes || []);
      setShowEligibilityResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check eligibility');
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleEligibilityInputChange = (key: keyof EligibilityAnswer, value: any) => {
    setEligibilityAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <section className={`max-w-6xl mx-auto px-4 py-8 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-teal-500" />
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Loading government schemes...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`max-w-6xl mx-auto px-4 py-8 space-y-8 min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 md:p-8 border border-emerald-500/20`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Government Schemes Portal
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Explore 10+ government schemes for farmers, workers, and rural communities
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-600 dark:text-red-400">Error</h3>
            <p className="text-sm text-red-600/90 dark:text-red-300/90 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Check Eligibility Button */}
      <button
        onClick={() => setShowEligibilityCheck(!showEligibilityCheck)}
        className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Check Your Eligibility for Schemes
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform ${showEligibilityCheck ? 'rotate-180' : ''}`} />
      </button>

      {/* Eligibility Check Form */}
      {showEligibilityCheck && (
        <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border border-teal-500/30 space-y-4`}>
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Answer a few questions to find eligible schemes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Age */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Your Age
              </label>
              <input
                type="number"
                min="18"
                max="100"
                value={eligibilityAnswers.age || ''}
                onChange={(e) => handleEligibilityInputChange('age', Number(e.target.value) || undefined)}
                placeholder="Enter your age"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                } focus:border-teal-500 focus:outline-none`}
              />
            </div>

            {/* Income */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Annual Income (₹)
              </label>
              <input
                type="number"
                value={eligibilityAnswers.income || ''}
                onChange={(e) => handleEligibilityInputChange('income', Number(e.target.value) || undefined)}
                placeholder="Enter annual income"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                } focus:border-teal-500 focus:outline-none`}
              />
            </div>

            {/* Land Size */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Land Size (hectares)
              </label>
              <input
                type="number"
                step="0.1"
                value={eligibilityAnswers.landSize || ''}
                onChange={(e) => handleEligibilityInputChange('landSize', Number(e.target.value) || undefined)}
                placeholder="Land size (optional)"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                } focus:border-teal-500 focus:outline-none`}
              />
            </div>

            {/* Checkboxes Row 1 */}
            <div className="space-y-2">
              <label className={`flex items-center gap-3 cursor-pointer ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <input
                  type="checkbox"
                  checked={eligibilityAnswers.isLandowner || false}
                  onChange={(e) => handleEligibilityInputChange('isLandowner', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-sm font-medium">Land Owner</span>
              </label>
              <label className={`flex items-center gap-3 cursor-pointer ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <input
                  type="checkbox"
                  checked={eligibilityAnswers.isTenantFarmer || false}
                  onChange={(e) => handleEligibilityInputChange('isTenantFarmer', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-sm font-medium">Tenant Farmer</span>
              </label>
            </div>

            {/* Checkboxes Row 2 */}
            <div className="space-y-2">
              <label className={`flex items-center gap-3 cursor-pointer ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <input
                  type="checkbox"
                  checked={eligibilityAnswers.hasBankAccount || false}
                  onChange={(e) => handleEligibilityInputChange('hasBankAccount', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-sm font-medium">Have Bank Account</span>
              </label>
              <label className={`flex items-center gap-3 cursor-pointer ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <input
                  type="checkbox"
                  checked={eligibilityAnswers.isRural || false}
                  onChange={(e) => handleEligibilityInputChange('isRural', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-sm font-medium">Rural Area</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleCheckEligibility}
            disabled={checkingEligibility}
            className="w-full px-6 py-3 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {checkingEligibility ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Checking Eligibility...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Check Eligibility
              </>
            )}
          </button>

          {/* Eligibility Results */}
          {showEligibilityResults && eligibleSchemes.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                You might be eligible for these schemes:
              </h4>
              <div className="space-y-2">
                {eligibleSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className={`p-3 rounded-lg border ${
                      scheme.likelyEligible
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-slate-500/10 border-slate-500/30'
                    }`}
                  >
                    <p className={`font-semibold text-sm ${scheme.likelyEligible ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                      {scheme.likelyEligible ? '✓' : '•'} {scheme.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes by name or keyword..."
            className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-colors ${
              darkMode
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-teal-500'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-teal-500'
            } focus:outline-none`}
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-colors appearance-none cursor-pointer ${
              darkMode
                ? 'bg-slate-800 border-slate-700 text-white focus:border-teal-500'
                : 'bg-white border-slate-300 text-slate-900 focus:border-teal-500'
            } focus:outline-none`}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Schemes Count */}
      <div className={`text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        Showing {filteredSchemes.length} of {schemes.length} schemes
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className={`${darkMode ? 'glass-card-dark' : 'glass-card'} border border-slate-200/50 dark:border-slate-800 overflow-hidden transition-all hover:border-teal-500/30`}
            >
              {/* Header (Always Visible) */}
              <button
                onClick={() => setExpandedSchemeId(expandedSchemeId === scheme.id ? null : scheme.id)}
                className="w-full p-6 flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{scheme.name}</h3>
                    <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      {scheme.category}
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} line-clamp-2`}>
                    {scheme.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {expandedSchemeId === scheme.id ? (
                    <ChevronUp className="w-6 h-6 text-teal-500" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedSchemeId === scheme.id && (
                <div className={`px-6 pb-6 space-y-6 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  {/* Benefits */}
                  <div>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Key Benefits</h4>
                    <ul className="space-y-2">
                      {scheme.benefits.map((benefit, idx) => (
                        <li key={idx} className={`flex items-start gap-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          <span className="text-teal-500 font-bold mt-0.5">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Eligibility */}
                  <div>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Eligibility Criteria</h4>
                    <ul className="space-y-2">
                      {scheme.eligibility.map((criterion, idx) => (
                        <li key={idx} className={`flex items-start gap-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          <span className="text-slate-400 mt-0.5">•</span>
                          <span>{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Required Documents</h4>
                    <ul className="space-y-2">
                      {scheme.requiredDocuments.map((doc, idx) => (
                        <li key={idx} className={`flex items-start gap-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          <span className="text-slate-400 mt-0.5">📄</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* How to Apply */}
                  <div>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>How to Apply</h4>
                    <ol className="space-y-2">
                      {scheme.howToApply.map((step, idx) => (
                        <li key={idx} className={`flex gap-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Application Method */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Application Method</h4>
                    <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{scheme.applicationMethod}</p>
                  </div>

                  {/* FAQs */}
                  <div>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Frequently Asked Questions</h4>
                    <div className="space-y-2">
                      {scheme.faqItems.map((faq, idx) => (
                        <details
                          key={idx}
                          className={`group p-3 rounded-lg border ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}
                        >
                          <summary className={`font-semibold text-sm cursor-pointer ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {faq.question}
                          </summary>
                          <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{faq.answer}</p>
                        </details>
                      ))}
                    </div>
                  </div>

                  {/* Official Website */}
                  <a
                    href={scheme.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-3 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    Visit Official Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={`text-center py-12 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-semibold">No schemes found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GovernmentSchemes;
