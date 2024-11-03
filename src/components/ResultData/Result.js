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

		const length = parseFloat(selectedData.length) || 0
		const width = parseFloat(selectedData.width) || 0

		if (length <= 0 || width <= 0) {
			console.error('Длина и ширина должны быть положительными числами.')
			return { metalTotal, pipeTotal, fixTotal }
		}

		if (selectedData.material) {
			const material = materialsData.find(
				item => item.name === selectedData.material
			)
			if (material) {
				const area = length * width
				const sheetCount = Math.ceil(area / (material.width || 1))
				metalTotal.quantity = area
				metalTotal.total = sheetCount * (material.price || 0)

				console.log('Промежуточные результаты для материала:', {
					area,
					sheetCount,
					total: metalTotal.total,
				})
			}
		}

		if (selectedData.pipe) {
			const pipe = materialsData.find(item => item.name === selectedData.pipe)
			if (pipe) {
				const stepConfig =
					configData.find(
						item => item.type === 'frame' && item.key === selectedData.strength
					)?.step || 1

				const pipeWidthMeters = (pipe.width || 0) / 1000
				const distanceBetweenPipes = stepConfig - pipeWidthMeters

				const pipesAlongLength = Math.ceil(length / distanceBetweenPipes)
				const pipesAlongWidth = Math.ceil(width / distanceBetweenPipes)

				const totalPipeLength =
					(pipesAlongLength + pipesAlongWidth) * distanceBetweenPipes

				pipeTotal.quantity = totalPipeLength
				pipeTotal.total = totalPipeLength * (pipe.price || 0)

				console.log('Промежуточные результаты для трубы:', {
					pipesAlongLength,
					pipesAlongWidth,
					totalPipeLength,
					total: pipeTotal.total,
				})
			}
		}

		if (selectedData.material) {
			const materialType = materialsData.find(
				item => item.name === selectedData.material
			)?.material
			const fixConfig = configData.find(
				item => item.type === 'fix' && item.key === materialType
			)
			if (fixConfig) {
				const area = length * width
				const quantity = area * fixConfig.value
				const screwPrice =
					materialsData.find(item => item.name === 'Саморез')?.price || 0
				fixTotal.quantity = quantity
				fixTotal.total = quantity * screwPrice

				console.log('Промежуточные результаты для саморезов:', {
					area,
					quantity,
					total: fixTotal.total,
				})
			}
		}

		return { metalTotal, pipeTotal, fixTotal }
	}, [selectedData])

	const { metalTotal, pipeTotal, fixTotal } = calculateTotals()

	const grandTotal =
		parseFloat(metalTotal.total) +
		parseFloat(pipeTotal.total) +
		parseFloat(fixTotal.total)

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
