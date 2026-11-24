import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";



function App() {
  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={<MainLayout/>}>
              <Route index element={<HomePage/>}/>
            </Route>
          </Routes>

        </BrowserRouter>
      </>
  );
}

export default App;
