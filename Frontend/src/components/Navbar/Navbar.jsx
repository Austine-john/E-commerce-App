import React from 'react'
import { useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
export const Navbar = () => {

  const [menu, setMenu] = useState("Shop");
  return (
    <div className='navbar'>
        <div className='nav-logo'>
            <img src={logo} alt="logo" />
            <p>SHOPPER</p>
        </div>

        <ul className='nav-menu'>
            <li onClick={() => {setMenu("Shop")}}><Link style={{textDecoration:"none"}} to = '/'>Shop</Link>{menu ==='Shop' ? <hr/>:<></>}</li>
            <li onClick={() => {setMenu("Accessories")}}><Link style={{textDecoration:"none"}} to = '/Accessories'>Accessories</Link>{menu ==='Accessories' ? <hr/>:<></>}</li>
            <li onClick={() => {setMenu("Makeup")}}><Link style={{textDecoration:"none"}} to = '/Makeup'>Make up</Link>{menu ==='Makeup' ? <hr/>:<></>}</li>
            <li onClick={() => {setMenu("Clothes")}}><Link style={{textDecoration:"none"}} to = '/Clothes'>Clothes</Link>{menu ==='Clothes' ? <hr/>:<></>}</li>
        </ul>
        <div className='nav-login-cart'>
            <Link to = '/login'><button>Login</button></Link>
            <Link to = '/cart'><img src={cart_icon} alt="cart_icon" /></Link>
            <div className="nav-cart-count">0</div>

        </div>
    </div>
  )
}

