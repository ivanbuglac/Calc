import React, { useContext } from 'react'
import materialsData from '../Data/data.json'
import configData from '../Data/config.json'
import { DataContext } from '../../DataContext'
import './inputData.scss'

const LENGTH_KEY = 'length'
const WIDTH_KEY = 'width'
const MATERIAL_TYPES = ['plastic', 'metal']

function InputData() {
	const { selectedData, setSelectedData } = useContext(DataContext)

	const handleMaterialChange = (type, value) => {
		const selectedItem = materialsData.find(item => item.name === value)

		if (!selectedItem) {
			console.warn('Материал не найден в materialsData:', value)
			return
		}

		const fixItem = configData.find(
			item => item.type === 'fix' && item.key === selectedItem.material
		)

		setSelectedData(prev => {
			return {
				...prev,
				[type]: selectedItem.name,
				[`${type}Price`]: selectedItem.price,
				[`${type}Unit`]: selectedItem.unit,
				materialType: selectedItem.material,
				fixValue: fixItem ? fixItem.value : 0,
			}
		})
	}

	// Обработчик изменения диапазона
	const handleRangeChange = (key, value) => {
		setSelectedData(prev => ({ ...prev, [key]: value }))
	}

	// Обработчик изменения прочности
	const handleStrengthChange = event => {
		setSelectedData(prev => ({ ...prev, strength: event.target.value }))
	}

	// Получаем конфигурацию для длины и ширины
	const getConfig = key => configData.find(item => item.key === key) || {}

	const lengthConfig = getConfig(LENGTH_KEY)
	const widthConfig = getConfig(WIDTH_KEY)

	return (
		<div className='material'>
			<h2>Выберите материал</h2>
			<div className='material__select_type'>
				{MATERIAL_TYPES.map(materialType => (
					<div key={materialType}>
						<h3>{materialType === 'plastic' ? 'Пластик' : 'Металл'}</h3>
						{materialsData
							.filter(item => item.material === materialType)
							.map((item, index) => (
								<label key={index}>
									<input
										type='radio'
										name='material'
										value={item.name}
										checked={selectedData.material === item.name}
										onChange={() => handleMaterialChange('material', item.name)}
									/>
									{item.name}
								</label>
							))}
					</div>
				))}
			</div>
			<div>
				<h2>Введите данные:</h2>
				<div>
					<label>
						{lengthConfig.name}: {selectedData.length} м
						<input
							type='range'
							min={lengthConfig.min || 0}
							max={lengthConfig.max || 0}
							step={lengthConfig.step || 1}
							value={selectedData.length}
							onChange={e => handleRangeChange(LENGTH_KEY, e.target.value)}
						/>
					</label>
				</div>
				<div>
					<label>
						{widthConfig.name}: {selectedData.width} м
						<input
							type='range'
							min={widthConfig.min || 0}
							max={widthConfig.max || 0}
							step={widthConfig.step || 1}
							value={selectedData.width}
							onChange={e => handleRangeChange(WIDTH_KEY, e.target.value)}
						/>
					</label>
				</div>
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

			<h3>Выберите прочность:</h3>
			<div className='material__select_strength'>
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
