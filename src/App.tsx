import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SettingsProvider } from './state/SettingsContext';
import { QuizProvider } from './state/QuizContext';
import { HistoryProvider } from './state/HistoryContext';
import { LanguageGate } from './components/LanguageGate';
import { AppShell } from './components/AppShell';
import { IntroPage } from './pages/IntroPage';
import { SelfRatePage } from './pages/SelfRatePage';
import { QuestionsPage } from './pages/QuestionsPage';
import { ReflectPage } from './pages/ReflectPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { HistoryDetailPage } from './pages/HistoryDetailPage';

function Shell() {
  const { pathname } = useLocation();
  return (
    <AppShell fixed={pathname === '/questions'}>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/levels" element={<SelfRatePage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/reflect" element={<ReflectPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:id" element={<HistoryDetailPage />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <HistoryProvider>
        <QuizProvider>
          <HashRouter>
            <LanguageGate>
              <Shell />
            </LanguageGate>
          </HashRouter>
        </QuizProvider>
      </HistoryProvider>
    </SettingsProvider>
  );
}
