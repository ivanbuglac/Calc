import React, { useContext } from 'react' // Удален useEffect и useState
import materialsData from '../Data/data.json'
import configData from '../Data/config.json'
import { DataContext } from '../../DataContext'
import './inputData.scss'

function InputData() {
	const { selectedData, setSelectedData } = useContext(DataContext)

	const handleMaterialChange = (type, value) => {
		const selectedItem = materialsData.find(item => item.name === value)
		setSelectedData(prev => ({
			...prev,
			[type]: selectedItem.name,
			[`${type}Price`]: selectedItem.price,
			[`${type}Unit`]: selectedItem.unit,
			...(type === 'fix' && { fixValue: selectedItem.value || 0 }), // Добавляем количество саморезов, если это необходимо
		}))
	}

	const handleRangeChange = (key, value) => {
		setSelectedData(prev => ({ ...prev, [key]: value }))
	}

	const handleStrengthChange = event => {
		setSelectedData(prev => ({ ...prev, strength: event.target.value }))
	}

	return (
		<div className='material'>
			<h2>Выберите материал</h2>
			<div className='material__select'>
				{['plastic', 'metal'].map(materialType => (
					<div key={materialType}>
						<h3>{materialType === 'plastic' ? 'Пластик' : 'Металл'}</h3>
						{materialsData
							.filter(item => item.material === materialType)
							.map((item, index) => (
								<label key={index}>
									<input
										type='radio'
										name={materialType}
										value={item.name}
										onChange={() => handleMaterialChange('material', item.name)}
									/>
									{item.name}
								</label>
							))}
					</div>
				))}

				<div>
					<h3>Трубы</h3>
					{materialsData.filter(item => item.type === 'pipe').length > 0 ? (
						materialsData
							.filter(item => item.type === 'pipe')
							.map((item, index) => (
								<label key={index}>
									<input
										type='radio'
										name='pipe'
										value={item.name}
										onChange={() => handleMaterialChange('pipe', item.name)}
									/>
									{item.name}
								</label>
							))
					) : (
						<p>Нет доступных труб.</p>
					)}
				</div>
			</div>

			<h2>Введите данные:</h2>
			<div>
				<label>
					{configData.find(item => item.key === 'length')?.name}:{' '}
					{selectedData.length} м
					<input
						type='range'
						min={configData.find(item => item.key === 'length')?.min || 0}
						max={configData.find(item => item.key === 'length')?.max || 0}
						step={configData.find(item => item.key === 'length')?.step || 1}
						value={selectedData.length}
						onChange={e => handleRangeChange('length', e.target.value)}
					/>
				</label>
			</div>
			<div>
				<label>
					{configData.find(item => item.key === 'width')?.name}:{' '}
					{selectedData.width} м
					<input
						type='range'
						min={configData.find(item => item.key === 'width')?.min || 0}
						max={configData.find(item => item.key === 'width')?.max || 0}
						step={configData.find(item => item.key === 'width')?.step || 1}
						value={selectedData.width}
						onChange={e => handleRangeChange('width', e.target.value)}
					/>
				</label>
			</div>
			<h3>Выберите прочность:</h3>
			<div>
				{configData
					.filter(item => item.type === 'frame')
					.map(item => (
						<label key={item.key}>
							<input
								type='radio'
								name='strength'
								value={item.key}
								checked={selectedData.strength === item.key}
								onChange={handleStrengthChange}
							/>
							{item.name}
						</label>
					))}
			</div>
		</div>
	)
}

export default InputData
