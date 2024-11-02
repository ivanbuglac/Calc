import React, { createContext, useState } from 'react'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {
	const [selectedData, setSelectedData] = useState({
		material: '',
		pipe: '',
		fix: '',
		length: 0,
		width: 0,
		strength: '',
		fixValue: 0,
		frameType: '',
	})

	return (
		<DataContext.Provider value={{ selectedData, setSelectedData }}>
			{children}
		</DataContext.Provider>
	)
}
