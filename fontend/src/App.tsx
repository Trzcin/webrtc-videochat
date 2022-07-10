import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import RoomComponent from './components/RoomComponent';
import SetupForm from './components/SetupForm';
import RoomList from './components/RoomList';
import NewRoomForm from './components/NewRoomForm';

const App: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-gray-900 text-gray-50">
      {/* @ts-ignore */}
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <SetupForm />
          </Route>

          <Route path="/rooms" exact>
            <RoomList />
          </Route>

          <Route path="/newRoom" exact>
            <NewRoomForm />
          </Route>

          <Route path="/room/:roomId" exact>
            <RoomComponent />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
