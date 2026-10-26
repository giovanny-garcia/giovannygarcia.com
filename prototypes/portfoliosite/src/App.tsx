import { useState } from 'react'
import Logo from '/logo.svg'
import Scene from './components/Scene'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={Logo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Giovanny's Site</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Scene></Scene>
    </>
  )
}

export default App
