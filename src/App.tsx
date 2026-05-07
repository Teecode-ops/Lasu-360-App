import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Bell, Download, LogOut } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { Tab, User, NewsItem, TimetableEntry, Result, Payment, CampusLocation, RegistrationRequest } from './types';
import { Login } from '@/components/Login';
import { Dashboard } from '@/components/Dashboard';
import { CourseReg } from '@/components/CourseReg';
import { Timetable } from '@/components/Timetable';
import { Results } from '@/components/Results';
import { CampusMap } from '@/components/CampusMap';
import { Navigation } from '@/components/Navigation';
import { Payments } from '@/components/Payments';
import { AdminPanel } from '@/components/AdminPanel';
import { HODApproval } from '@/components/HODApproval';
import { ScheduleManager } from '@/components/ScheduleManager';
import { 
  subscribeToNews, 
  subscribeToTimetable, 
  subscribeToResults, 
  subscribeToPayments, 
  getCampusLocations,
  subscribeToRegistrationRequests,
  updateRegistrationStatus,
  submitRegistrationRequest
} from '@/services/firebaseService';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Data State
  const [news, setNews] = useState<NewsItem[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [approvals, setApprovals] = useState<RegistrationRequest[]>([]);

  // Fetch confidential info from Central University REST API
  useEffect(() => {
    if (isAuthenticated && user?.matricNumber) {
      fetch(`/api/university/confidential/${user.matricNumber}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
          }
          return res.json();
        })
        .then(data => {
          if (data && !data.error) {
            console.log("Confidential data fetched from University DB:", data);
          }
        })
        .catch(err => {
          console.warn("Could not reach University Data Center", err.message);
        });
    }
  }, [isAuthenticated, user?.matricNumber]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle PWA Install Prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Firebase Subscriptions
  useEffect(() => {
    if (!user) return;

    const unsubNews = subscribeToNews((updatedNews) => {
      setNews(prev => {
        // Find new items added (if not it's not the first time)
        if (prev.length > 0 && updatedNews.length > prev.length) {
          const newItems = updatedNews.filter(item => !prev.some(p => p.id === item.id));
          newItems.forEach(item => {
            toast.success('New update from LASU!', {
              description: item.title,
              action: {
                label: 'View',
                onClick: () => setCurrentTab('home')
              }
            });
          });
        }
        return updatedNews;
      });
    });

    const unsubTimetable = subscribeToTimetable(setTimetable);
    const unsubResults = subscribeToResults(user.id, setResults);
    const unsubPayments = subscribeToPayments(user.id, setPayments);

    const unsubApprovals = subscribeToRegistrationRequests((updatedApprovals) => {
      setApprovals(prev => {
        // Check for status changes relevant to the user
        if (prev.length > 0) {
          updatedApprovals.forEach(req => {
            const oldReq = prev.find(p => p.id === req.id);
            if (oldReq && oldReq.status !== req.status && req.studentId === user.id) {
              if (req.status === 'approved') {
                toast.success('Course Registration Approved!', {
                  description: 'Your registration has been cleared by the HOD.',
                  duration: 5000
                });
              } else if (req.status === 'rejected') {
                toast.error('Registration Rejected', {
                  description: 'Please check your portal for details or contact your department.',
                  duration: 5000
                });
              }
            }
          });
        }
        return updatedApprovals;
      });
    });
    
    getCampusLocations().then(setLocations);

    return () => {
      unsubNews();
      unsubTimetable();
      unsubResults();
      unsubPayments();
      unsubApprovals();
    };
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentTab('home'); // Reset to home on login
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentTab('home'); // Reset on logout
    localStorage.removeItem('user');
  };

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    });
  };

  const handleApprove = (id: string) => {
    updateRegistrationStatus(id, 'approved');
  };

  const handleReject = (id: string) => {
    updateRegistrationStatus(id, 'rejected');
  };

  const handleCourseSubmit = async (courses: string[], totalUnits: number) => {
    if (!user) return;
    await submitRegistrationRequest({
      studentId: user.id,
      studentName: `${user.surname} ${user.name}`,
      matricNumber: user.matricNumber,
      courses,
      totalUnits,
      status: 'pending',
      level: user.level || 'Unknown',
      submittedAt: new Date().toISOString()
    });
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} isOffline={isOffline} />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <Dashboard user={user!} news={news} timetable={timetable} onNavigate={setCurrentTab} />;
      case 'courses':
        return <CourseReg isLoading={false} studentDepartment={user?.department} onSubmit={handleCourseSubmit} />;
      case 'timetable':
        return <Timetable timetable={timetable} user={user!} />;
      case 'results':
        return <Results results={results} user={user!} />;
      case 'map':
        return <CampusMap locations={locations} />;
      case 'payments':
        return <Payments payments={payments} user={user!} />;
      case 'approvals':
        return <HODApproval requests={approvals} onApprove={handleApprove} onReject={handleReject} />;
      case 'schedule_manager':
        return <ScheduleManager timetable={timetable} user={user!} />;
      case 'admin':
        return <AdminPanel user={user!} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex justify-center selection:bg-blue-500 selection:text-white">
      {/* Mobile Container Limit */}
      <div className="w-full max-w-md bg-white shadow-2xl relative flex flex-col h-[100dvh] overflow-hidden">

        {/* Header */}
        <header className="px-5 py-4 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div className="flex flex-col">
            <h1 className="text-lg font-black text-blue-800 uppercase tracking-tighter leading-none">LASU 360</h1>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Student Portal</span>
          </div>

          <div className="flex items-center gap-2">
             <button
                className={`p-2 rounded-full transition-all ${isOffline ? 'bg-orange-100 text-orange-600' : 'bg-green-50 text-green-600'}`}
                title={isOffline ? 'Offline' : 'Online'}
             >
                {isOffline ? <WifiOff size={18} /> : <Wifi size={18} />}
             </button>
             
             {installPrompt && (
               <button 
                 onClick={handleInstallClick}
                 className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
               >
                 <Download size={18} />
               </button>
             )}

             <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                <LogOut size={18} />
             </button>
          </div>
        </header>

        {/* Offline Banner */}
        {isOffline && (
            <div className="bg-orange-500 text-white text-[10px] text-center py-1 font-bold uppercase tracking-wider z-20">
                You are currently offline • Data is cached
            </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-neutral-50 scroll-smooth pb-20">
          {renderContent()}
        </main>

        {/* Bottom Navigation */}
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} userRole={user?.role} />
        
        {/* Real-time Notifications Pop-up */}
        <Toaster 
          position="top-center" 
          expand={true}
          richColors 
          toastOptions={{
            style: {
              borderRadius: '1.2rem',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            },
          }}
        />
      </div>
    </div>
  );
}
