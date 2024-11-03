import React from 'react'
import './header.scss'

function Header() {
	return (
		<div className='header'>
			<div className='header__container'>
				<a href='https://vistegra.by/' className='header__logo'>
					<img className='Logo' src='./logo.svg' alt='Vistegra'></img>
				</a>
				<h1>Calculator</h1>
			</div>
		</div>
	)
}

export default Header
