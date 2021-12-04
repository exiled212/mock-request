import React from 'react';
import {PendingsTable} from './hooks/request/PendingsTable';
import {AppNav} from './hooks/app/AppNav';

/**
 * Init app
 * @return {void}
 */
function App() {
  return (
    <React.StrictMode>
      <div className="grid grid-cols-12 gab-4">
        <div className="col-span-full">
          <AppNav />
        </div>
      </div>
      <div className="grid grid-cols-12 gab-4">
        <div className="col-span-full">
          <PendingsTable/>
        </div>
      </div>
    </React.StrictMode>
  );
}

export default App;
