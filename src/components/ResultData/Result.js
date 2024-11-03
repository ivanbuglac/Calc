import React, { useState, useContext, useEffect, useCallback } from 'react'
import { DataContext } from '../../DataContext'
import materialsData from '../Data/data.json'
import configData from '../Data/config.json'
import './result.scss'

function Result() {
	const { selectedData, resetResults } = useContext(DataContext)

	const [metalTotal, setMetalTotal] = useState({ quantity: 0, total: 0 })
	const [pipeTotal, setPipeTotal] = useState({ quantity: 0, total: 0 })
	const [fixTotal, setFixTotal] = useState({ quantity: 0, total: 0 })

	const calculateMaterialTotal = useCallback(() => {
		if (!selectedData.material) return { quantity: 0, total: 0 }

		const material = materialsData.find(
			item => item.name === selectedData.material
		)
		if (!material) return { quantity: 0, total: 0 }

		const area = (selectedData.length || 0) * (selectedData.width || 0)
		const sheetCount = Math.ceil(area / (material.width || 1))
		const total = sheetCount * (material.price || 0)

		return { quantity: area.toFixed(2), total: total.toFixed(2) }
	}, [selectedData.material, selectedData.length, selectedData.width])

	const calculatePipeTotal = useCallback(() => {
		if (!selectedData.pipe) return { quantity: 0, total: 0 }

		const pipe = materialsData.find(item => item.name === selectedData.pipe)
		if (!pipe) return { quantity: 0, total: 0 }

		const stepConfig =
			configData.find(
				item => item.type === 'frame' && item.key === selectedData.strength
			)?.step || 1
		const pipeWidthMeters = (pipe.width || 0) / 1000
		const distanceBetweenTubes = stepConfig - pipeWidthMeters

		const length = parseFloat(selectedData.length) || 0
		const width = parseFloat(selectedData.width) || 0

		const pipesAlongLength = Math.ceil(length / distanceBetweenTubes)
		const pipesAlongWidth = Math.ceil(width / distanceBetweenTubes)

		const totalPipeLength = pipesAlongLength * width + pipesAlongWidth * length
		const total = totalPipeLength * (pipe.price || 0)

		return { quantity: totalPipeLength.toFixed(2), total: total.toFixed(2) }
	}, [
		selectedData.pipe,
		selectedData.length,
		selectedData.width,
		selectedData.strength,
	])

	const calculateFixTotal = useCallback(() => {
		const materialType = selectedData.materialType
		const fixConfig = configData.find(
			item => item.type === 'fix' && item.key === materialType
		)

		if (!fixConfig) {
			console.warn(
				`Не удалось найти конфигурацию для материала: ${materialType}`
			)
			return { quantity: 0, total: 0 }
		}

		const screwPrice =
			materialsData.find(item => item.name === 'Саморез')?.price || 0

		const area =
			(parseFloat(selectedData.length) || 0) *
			(parseFloat(selectedData.width) || 0)
		const screwsPerSquareMeter = fixConfig.value
		const quantity = area * screwsPerSquareMeter

		const total = quantity * screwPrice

		return { quantity: quantity.toFixed(2), total: total.toFixed(2) }
	}, [selectedData.length, selectedData.width, selectedData.materialType])

	useEffect(() => {
		setMetalTotal(calculateMaterialTotal())
		setFixTotal(calculateFixTotal())
		setPipeTotal(calculatePipeTotal())
	}, [calculateMaterialTotal, calculateFixTotal, calculatePipeTotal])

	const handleReset = () => {
		resetResults() // Сбрасываем данные
		setMetalTotal({ quantity: 0, total: 0 }) // Сбрасываем результаты металла
		setPipeTotal({ quantity: 0, total: 0 }) // Сбрасываем результаты труб
		setFixTotal({ quantity: 0, total: 0 }) // Сбрасываем результаты саморезов
	}

	const grandTotal = (
		parseFloat(metalTotal.total) +
		parseFloat(pipeTotal.total) +
		parseFloat(fixTotal.total)
	).toFixed(2)

	return (
		<div className='result'>
			<h2>Результаты:</h2>
			<table>
				<thead>
					<tr>
						<th>Наименование</th>
						<th>Ед.</th>
						<th>Кол-во</th>
						<th>Сумма</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{selectedData.material || 'Не выбрано'}</td>
						<td>м²</td>
						<td>{metalTotal.quantity}</td>
						<td>{metalTotal.total} руб.</td>
					</tr>
					<tr>
						<td>{selectedData.pipe || 'Не выбрано'}</td>
						<td>мп</td>
						<td>{pipeTotal.quantity}</td>
						<td>{pipeTotal.total} руб.</td>
					</tr>
					<tr>
						<td>Саморезы</td>
						<td>шт</td>
						<td>{fixTotal.quantity}</td>
						<td>{fixTotal.total} руб.</td>
					</tr>
				</tbody>
			</table>
			<div className='result-actions'>
				<button onClick={handleReset}>Сбросить результаты</button>
			</div>
			<div className='total'>
				<p>Итог:</p>
				<span>{grandTotal} руб.</span>
			</div>
		</div>
	)
}

export default Result
