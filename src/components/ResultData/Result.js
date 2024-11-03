import React, { useContext, useCallback } from 'react'
import { DataContext } from '../../DataContext'
import materialsData from '../Data/data.json'
import configData from '../Data/config.json'
import './result.scss'

function Result() {
	const { selectedData, resetResults } = useContext(DataContext)

	const calculateTotals = useCallback(() => {
		let metalTotal = { quantity: 0, total: 0 }
		let pipeTotal = { quantity: 0, total: 0 }
		let fixTotal = { quantity: 0, total: 0 }

		// Расчет для выбранного материала
		if (selectedData.material) {
			const material = materialsData.find(
				item => item.name === selectedData.material
			)
			if (material) {
				const area = (selectedData.length || 0) * (selectedData.width || 0)
				const sheetCount = Math.ceil(area / (material.width || 1))
				metalTotal.quantity = area.toFixed(2)
				metalTotal.total = (sheetCount * (material.price || 0)).toFixed(2)
			}
		}

		// Расчет для выбранной трубы
		if (selectedData.pipe) {
			const pipe = materialsData.find(item => item.name === selectedData.pipe)
			if (pipe) {
				// Получаем шаг, основанный на выбранной прочности
				const stepConfig =
					configData.find(
						item => item.type === 'frame' && item.key === selectedData.strength
					)?.step || 1

				// Рассчитываем расстояние между трубами
				const pipeWidthMeters = (pipe.width || 0) / 1000 // Перевод в метры
				const distanceBetweenPipes = stepConfig - pipeWidthMeters

				const length = parseFloat(selectedData.length) || 0
				const width = parseFloat(selectedData.width) || 0

				// Количество труб вдоль длины и ширины
				const pipesAlongLength = Math.ceil(length / distanceBetweenPipes)
				const pipesAlongWidth = Math.ceil(width / distanceBetweenPipes)

				// Общая длина труб
				const totalPipeLength =
					pipesAlongLength * width + pipesAlongWidth * length

				pipeTotal.quantity = totalPipeLength.toFixed(2)
				pipeTotal.total = (totalPipeLength * (pipe.price || 0)).toFixed(2)
			}
		}

		// Расчет для саморезов
		if (selectedData.material) {
			const materialType = materialsData.find(
				item => item.name === selectedData.material
			)?.material
			const fixConfig = configData.find(
				item => item.type === 'fix' && item.key === materialType
			)
			if (fixConfig) {
				const area = (selectedData.length || 0) * (selectedData.width || 0)
				const quantity = area * fixConfig.value // Общее количество саморезов
				const screwPrice =
					materialsData.find(item => item.name === 'Саморез')?.price || 0
				fixTotal.quantity = quantity.toFixed(2)
				fixTotal.total = (quantity * screwPrice).toFixed(2)
			}
		}

		return { metalTotal, pipeTotal, fixTotal }
	}, [selectedData])

	const { metalTotal, pipeTotal, fixTotal } = calculateTotals()

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
						<td>{metalTotal.total}</td>
					</tr>
					<tr>
						<td>{selectedData.pipe || 'Не выбрано'}</td>
						<td>мп</td>
						<td>{pipeTotal.quantity}</td>
						<td>{pipeTotal.total}</td>
					</tr>
					<tr>
						<td>Саморезы</td>
						<td>шт</td>
						<td>{fixTotal.quantity}</td>
						<td>{fixTotal.total}</td>
					</tr>
				</tbody>
			</table>
			<div className='result-actions'>
				<button onClick={resetResults}>Сбросить результаты</button>
			</div>
			<div className='total'>
				<p>Итог:</p>
				<span>{grandTotal}</span>
			</div>
		</div>
	)
}

export default Result
