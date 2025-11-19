import React from 'react'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './componentes/Signup'
import Login from './componentes/Login'
import Book from './componentes/Book'
import Home from './componentes/Home'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/book' element={<Book/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
