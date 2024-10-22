import { BrowserRouter } from "react-router-dom";
import './App.css'
import RoutesIndex from "./Routes/Index";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
    <BrowserRouter>
      <RoutesIndex />
    </BrowserRouter>
    </>
  )
}

export default App
