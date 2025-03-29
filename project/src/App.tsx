import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Snippets from './components/Snippets';
import SavedSnippets from './components/SavedSnippets';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Layout />}
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="snippets" element={<Snippets />} />
          <Route path="saved-snippets" element={<SavedSnippets />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;