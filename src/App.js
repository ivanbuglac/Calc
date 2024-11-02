import './App.scss'
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
		</DataProvider>
	)
}

export default App
