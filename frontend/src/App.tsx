import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Create from './pages/Create';
import Edit from './pages/Edit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige la raíz a /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Rutas con layout común */}
        <Route element={<BaseLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/superhero/:id" element={<Detail />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
