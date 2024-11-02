import React, { createContext, useState } from 'react'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {
	const initialData = {
		material: '',
		pipe: '',
		fix: '',
		length: 0,
		width: 0,
		strength: '',
		fixValue: 0,
		frameType: '',
		materialType: '',
	}

	const [selectedData, setSelectedData] = useState(initialData)

	const resetResults = () => {
		setSelectedData(initialData)
	}

	return (
		<DataContext.Provider
			value={{ selectedData, setSelectedData, resetResults }}
		>
			{children}
		</DataContext.Provider>
	)
}
