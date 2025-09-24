import { Navbar } from "./components/Navbar/Navbar"
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Shop from './Pages/Shop'
import ShopCategory from './Pages/ShopCategory'
import Product from './Pages/Product'
import Cart from './Pages/Cart'
import LoginSignup from './Pages/LoginSignup'
export default function App(){
  return(
    <>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path = '/' element = {<Shop/>} />
        <Route path = '/Accessories' element = {<ShopCategory category = 'Accessories'/>} />
        <Route path = '/Makeup' element = {<ShopCategory category = 'Make up'/>} />
        <Route path = '/Clothes' element = {<ShopCategory category = 'Clothes'/>} />
        <Route path = '/product/' element = {<Product/>} />
        <Route path = '/product/:productId' element = {<Product/>} />
        <Route path = '/cart' element = {<Cart/>} />
        <Route path = '/login' element = {<LoginSignup/>} />

      </Routes>
      </BrowserRouter>
      
    </>

  )
}