import React from 'react';
import logo from './logo.svg';
import List from "./components/List";
import Form from "./components/Form.jsx";
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Gosh
      </header>
      <div className="row mt-5">
        <div className="col-md-4 offset-md-1">
        <h2>Articles</h2>
          <List />
        </div>
        <div className="col-md-4 offset-md-1">
          <h2>Add a new article</h2>
          <Form />
        </div>
      </div>
    </div>
  );
}

export default App;
