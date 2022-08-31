import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './app.scss';
import Game from './components/game';
import NewGame from './components/new-game'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<NewGame />}></Route>
        <Route path='/play' element={<Game />}></Route> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
