import { Fragment } from 'react'
import { Routes, Route } from 'react-router-dom'

import { Home } from './views/Home'
import MainLayout from './layouts/main'
import { Punks } from './views/Punks'
import { Punk } from './views/Punk'

function App() {
  return (
    <Fragment>
      <MainLayout>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/punks" exact element={<Punks />} />
          <Route path="/punk/:tokenId" exact element={<Punk />} />
        </Routes>
      </MainLayout>
    </Fragment>
  )
}

export default App
