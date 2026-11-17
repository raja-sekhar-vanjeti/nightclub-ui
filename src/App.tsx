import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { Atmosphere } from './motion';
import { Membership, Notifications, Safety, Settings } from './pages/Account';
import Circles from './pages/Circles';
import Discover from './pages/Discover';
import FindYourFour from './pages/FindYourFour';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Missions from './pages/Missions';
import Onboarding from './pages/Onboarding';
import Opportunities from './pages/Opportunities';
import Passport from './pages/Passport';
import Sessions from './pages/Sessions';
import { StoreProvider, useStore } from './store';

function Routed() {
  const { onboarded } = useStore();
  return (
    <Routes>
      <Route path="/welcome" element={<Onboarding />} />
      <Route element={onboarded ? <Layout /> : <Navigate to="/welcome" replace />}>
        <Route path="/" element={<Home />} />
        <Route path="/find-your-four" element={<FindYourFour />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/circles" element={<Circles />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/passport" element={<Passport />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/safety" element={<Safety />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Atmosphere />
      <HashRouter>
        <Routed />
      </HashRouter>
    </StoreProvider>
  );
}
