import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Toaster from './components/Toaster';
import Menu from './components/Menu';
import Transactions from './pages/Transactions';
import Main from './pages/Main';
import Accounts from './pages/Accounts';
import BalanceRecords from './pages/BalanceRecords';
import styled from 'styled-components';

const AppContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
`;

const ContentContainer = styled.main`
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

function App() {
  return (
    <BrowserRouter>
      <AppContainer>
        <Toaster />
        <Menu />
        <ContentContainer>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/balance-records" element={<BalanceRecords />} />
            <Route path="/accounts" element={<Accounts />} />
          </Routes>
        </ContentContainer>
      </AppContainer>
    </BrowserRouter>
  );
}

export default App;
