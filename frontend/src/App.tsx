import { useState } from 'react';
import { Box } from '@mui/material';
import Header from './pages/Header';
import Home from './pages/Home';
import Footer from './pages/Footer';
import type { Page } from './pages/Home';

function App() {
  const [page, setPage] = useState<Page>({ view: 'list' });

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header
          onNavigateToList={() => setPage({ view: 'list' })}
          onNavigateToForm={() => setPage({ view: 'form' })}
          onNavigateToSimulator={() => setPage({ view: 'simulator' })}
        />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Home page={page} setPage={setPage} />
        </Box>
        <Footer />
      </Box>
    </>
  );
}

export default App;
