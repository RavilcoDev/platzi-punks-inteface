import { Fragment } from 'react'
import { Routes, Route } from 'react-router-dom'

import { Home } from './views/Home'
import MainLayout from './layouts/main'

function App () {

  return (
    <Fragment>
      <MainLayout>
        <Routes>
          <Route path='/' exact element={<Home />} />
        </Routes>
      </MainLayout>
    </Fragment>
  );
}

export default App;
