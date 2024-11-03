import './App.scss'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import InputData from './components/inputData/inputData'
import Result from './components/ResultData/Result'
import { DataProvider } from './DataContext'

function App() {
	return (
		<DataProvider>
			<Header />
			<div className='content'>
				<InputData />
				<Result />
			</div>
			<Footer />
		</DataProvider>
	)
}

export default App
