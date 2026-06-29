import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Users,
  ShieldCheck,
  TrendingUp,
  CloudSun,
  Wrench,
  MapPin,
  Info,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { farmerAPI } from '../services/api';

interface FarmerHubProps {
  onNavigate: (page: string) => void;
}

interface Laborer {
  id: string | number;
  name: string;
  skills: string;
  rating?: number;
  experience?: string;
  pay: string;
  location: string;
  status: string;
}

interface Equipment {
  id: string | number;
  name: string;
  owner: string;
  rate: string;
  type: string;
  distance: string;
  status: string;
}

interface MandiPrice {
  id?: string | number;
  crop: string;
  sonipat: string;
  narela: string;
  rohtak: string;
  trend: 'up' | 'down';
}

interface TabConfig {
  id: 'labor' | 'machinery' | 'prices';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const FarmerHub: React.FC<FarmerHubProps> = ({ onNavigate }: FarmerHubProps) => {
  const { darkMode } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'labor' | 'machinery' | 'prices'>('labor');
  const [bookingWorkerId, setBookingWorkerId] = useState<string | number | null>(null);
  const [bookedWorkers, setBookedWorkers] = useState<(string | number)[]>([]);
  
  // Data states
  const [laborers, setLaborers] = useState<Laborer[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [mandiPrices, setMandiPrices] = useState<MandiPrice[]>([]);
  
  // Loading/Error states
  const [labLoadingError, setLabLoadingError] = useState<string | null>(null);
  const [eqLoadingError, setEqLoadingError] = useState<string | null>(null);
  const [pricesLoadingError, setPricesLoadingError] = useState<string | null>(null);
  
  const [labLoading, setLabLoading] = useState(true);
  const [eqLoading, setEqLoading] = useState(true);
  const [pricesLoading, setPricesLoading] = useState(true);
  
  // Fetch laborers
  useEffect(() => {
    const fetchLaborers = async () => {
      try {
        setLabLoading(true);
        setLabLoadingError(null);
        const response = await farmerAPI.getLaborers();
        setLaborers(response.laborers || []);
      } catch (err) {
        console.error('Error fetching laborers:', err);
        setLabLoadingError('Failed to load laborers. Please try again later.');
      } finally {
        setLabLoading(false);
      }
    };

    fetchLaborers();
  }, []);
  
  // Fetch equipment
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setEqLoading(true);
        setEqLoadingError(null);
        const response = await farmerAPI.getEquipment();
        setEquipment(response.equipment || []);
      } catch (err) {
        console.error('Error fetching equipment:', err);
        setEqLoadingError('Failed to load equipment. Please try again later.');
      } finally {
        setEqLoading(false);
      }
    };

    fetchEquipment();
  }, []);
  
  // Fetch mandi prices
  useEffect(() => {
    const fetchMandiPrices = async () => {
      try {
        setPricesLoading(true);
        setPricesLoadingError(null);
        const response = await farmerAPI.getMandiPrices();
        setMandiPrices(response.mandiPrices || response.prices || []);
      } catch (err) {
        console.error('Error fetching mandi prices:', err);
        setPricesLoadingError('Failed to load mandi prices. Please try again later.');
      } finally {
        setPricesLoading(false);
      }
    };

    fetchMandiPrices();
  }, []);
  
  const handleBookWorker = async (workerId: string | number): Promise<void> => {
    setBookingWorkerId(workerId);
    try {
      await farmerAPI.bookLaborer(Number(workerId));
      setTimeout(() => {
        setBookedWorkers((prev: (string | number)[]) => [...prev, workerId]);
        setBookingWorkerId(null);
      }, 1500);
    } catch (err) {
      console.error('Error booking laborer:', err);
      setBookingWorkerId(null);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
            <Sprout className="w-8 h-8" />
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Smart Agriculture Hub
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Find verified agricultural laborers, rent machineries, check hyper-local mandi prices, and protect crop profits.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Seasonal Demand Verified
          </span>
        </div>
      </div>

      {/* Weather & Price alerts widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Weather advisory */}
        <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5 border border-slate-200/50 dark:border-slate-800 flex gap-4 items-start`}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
            <CloudSun className="w-6 h-6 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Weather Advisory</h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Clear Sky • Perfect for harvesting</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">No rainfall expected in Sonipat for 5 days. Complete cutting crop cycles now.</p>
          </div>
        </div>

        {/* P2P Anti-Overpricing Guarantee */}
        <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5 border border-slate-200/50 dark:border-slate-800 flex gap-4 items-start col-span-1 md:col-span-2`}>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Price Stabilization Guarantee</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              JeevanSetu implements smart contracts monitoring agricultural services to block mid-work rate negotiations and harvester rental manipulators. Platform checks ensure honest seasonal hiring.
            </p>
          </div>
        </div>

      </div>

      {/* Main Tabs */}
      <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-1.5 border border-slate-200/50 dark:border-slate-800`}>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(
            [
              { id: 'labor', label: 'Hire Farm Laborers', icon: Users },
              { id: 'machinery', label: 'Equipment Rentals', icon: Wrench },
              { id: 'prices', label: 'Hyper-Local Mandi Prices', icon: TrendingUp },
            ] as TabConfig[]
          ).map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : darkMode
                      ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'labor' && (
        <>
          {labLoadingError && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/25 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">{labLoadingError}</span>
            </div>
          )}
          {labLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Loading laborers...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {laborers.map((worker) => (
                <div
                  key={worker.id}
                  className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-500/30 transition-all`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                        {worker.status}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{worker.experience || 'N/A'} Exp</span>
                    </div>

                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{worker.name}</h3>
                    <p className="text-xs text-teal-500 font-semibold mt-0.5">{worker.skills}</p>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-xs text-slate-400 block">Rate Required</span>
                        <span className="font-bold text-slate-900 dark:text-white">{worker.pay}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Proximity</span>
                        <span className="font-bold text-slate-950 dark:text-white flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {worker.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    {bookedWorkers.includes(worker.id) ? (
                      <button className="w-full py-2.5 rounded-lg bg-emerald-500 text-white font-bold text-sm cursor-default flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-4.5 h-4.5" />
                        Laborer Booked
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBookWorker(worker.id)}
                        disabled={bookingWorkerId === worker.id || worker.status === 'Booked'}
                        className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                          worker.status === 'Booked'
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white shadow-md'
                        }`}
                      >
                        {bookingWorkerId === worker.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Booking...
                          </>
                        ) : worker.status === 'Booked' ? (
                          'Not Available'
                        ) : (
                          'Book Laborer'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'machinery' && (
        <>
          {eqLoadingError && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/25 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">{eqLoadingError}</span>
            </div>
          )}
          {eqLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Loading equipment...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {equipment.map((eq) => (
                <div
                  key={eq.id}
                  className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-500/30 transition-all`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-sky-400 text-[10px] font-bold uppercase">
                        {eq.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{eq.status}</span>
                    </div>

                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{eq.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">Owner: <span className="font-bold text-slate-600 dark:text-slate-300">{eq.owner}</span></p>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-xs text-slate-400 block">Rental Rate</span>
                        <span className="font-bold text-slate-900 dark:text-white">{eq.rate}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Location</span>
                        <span className="font-bold text-slate-950 dark:text-white flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {eq.distance}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    <button
                      disabled={eq.status === 'Rented'}
                      className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors ${
                        eq.status === 'Rented'
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white'
                      }`}
                    >
                      {eq.status === 'Rented' ? 'Currently Rented' : 'Rent Equipment'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'prices' && (
        <>
          {pricesLoadingError && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/25 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">{pricesLoadingError}</span>
            </div>
          )}
          {pricesLoading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Loading mandi prices...</span>
              </div>
            </div>
          ) : (
            <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border border-slate-200/50 dark:border-slate-800 overflow-hidden`}>
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <Info className="w-5 h-5 text-emerald-500" />
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Below are today's verified grain and produce rates compiled directly from local APMC Mandis. Verify rates before selling or negotiating transport.
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">Crop Name</th>
                      <th className="py-3 px-4">Sonipat Mandi</th>
                      <th className="py-3 px-4">Narela Mandi</th>
                      <th className="py-3 px-4">Rohtak Mandi</th>
                      <th className="py-3 px-4">Daily Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {mandiPrices.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{row.crop}</td>
                        <td className="py-4 px-4 font-semibold text-emerald-600 dark:text-emerald-400">{row.sonipat}</td>
                        <td className="py-4 px-4 font-semibold text-govBlue-600 dark:text-sky-400">{row.narela}</td>
                        <td className="py-4 px-4">{row.rohtak}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            row.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {row.trend === 'up' ? '▲ Upward' : '▼ Downward'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

    </section>
  );
};
export default FarmerHub;
