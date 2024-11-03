import React, { useContext, useCallback } from 'react'
import { DataContext } from '../../DataContext'
import materialsData from '../Data/data.json'
import configData from '../Data/config.json'
import './result.scss'

const MM_TO_M_CONVERSION = 1000
const DEFAULT_MATERIAL_WIDTH = 1
const DEFAULT_STEP = 1
const DEFAULT_PRICE = 0
const SCREW_NAME = 'Саморез'
function Result() {
	const { selectedData, resetResults } = useContext(DataContext)

	const calculateTotals = useCallback(() => {
		let metalTotal = { quantity: 0, total: 0 }
		let pipeTotal = { quantity: 0, total: 0 }
		let fixTotal = { quantity: 0, total: 0 }

		const length = parseFloat(selectedData.length) || 0
		const width = parseFloat(selectedData.width) || 0

		if (length <= 0 || width <= 0) {
			return {
				metalTotal,
				pipeTotal,
				fixTotal,
				cellSize: { length: 0, width: 0 },
			}
		}

		const area = length * width
		let cellSize = { length: 0, width: 0 }

		if (selectedData.material) {
			const material = materialsData.find(
				item => item.name === selectedData.material
			)
			if (material) {
				const sheetCount = Math.ceil(
					area / (material.width || DEFAULT_MATERIAL_WIDTH)
				)
				metalTotal.quantity = area
				metalTotal.total = sheetCount * (material.price || DEFAULT_PRICE)
			}
		}

		if (selectedData.pipe) {
			const pipe = materialsData.find(item => item.name === selectedData.pipe)
			if (pipe) {
				const stepConfig =
					configData.find(
						item => item.type === 'frame' && item.key === selectedData.strength
					)?.step || DEFAULT_STEP

				const pipeWidthMeters = (pipe.width || 0) / MM_TO_M_CONVERSION
				const distanceBetweenPipes = stepConfig - pipeWidthMeters

				const pipesAlongLength = Math.ceil(length / distanceBetweenPipes)
				const pipesAlongWidth = Math.ceil(width / distanceBetweenPipes)

				const totalPipeLength =
					(pipesAlongLength / distanceBetweenPipes) *
					(pipesAlongWidth / distanceBetweenPipes)

				pipeTotal.quantity = totalPipeLength
				pipeTotal.total = totalPipeLength * (pipe.price || DEFAULT_PRICE)

				if (pipesAlongWidth > 0) {
					cellSize.width = width / pipesAlongWidth
				}
				if (pipesAlongLength > 0) {
					cellSize.length = length / pipesAlongLength
				}
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
				const quantity = area * fixConfig.value
				const screwPrice =
					materialsData.find(item => item.name === SCREW_NAME)?.price ||
					DEFAULT_PRICE
				fixTotal.quantity = quantity
				fixTotal.total = quantity * screwPrice
			}
		}

		return { metalTotal, pipeTotal, fixTotal, area, cellSize }
	}, [selectedData])

	const { metalTotal, pipeTotal, fixTotal, area, cellSize } = calculateTotals()

	const grandTotal =
		parseFloat(metalTotal.total) +
		parseFloat(pipeTotal.total) +
		parseFloat(fixTotal.total)

	return (
		<div className='result'>
			<h2>Результаты:</h2>
			<p>Площадь изделия: {(area || 0).toFixed(2)} м²</p>
			<p>
				Размер ячейки: {(cellSize.length || 0).toFixed(2)} х{' '}
				{(cellSize.width || 0).toFixed(2)} м
			</p>
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
						<td>{metalTotal.quantity.toFixed(2)}</td>
						<td>{metalTotal.total.toFixed(2)}</td>
					</tr>
					<tr>
						<td>{selectedData.pipe || 'Не выбрано'}</td>
						<td>мп</td>
						<td>{pipeTotal.quantity.toFixed(2)}</td>
						<td>{pipeTotal.total.toFixed(2)}</td>
					</tr>
					<tr>
						<td>Саморезы</td>
						<td>шт</td>
						<td>{fixTotal.quantity.toFixed(2)}</td>
						<td>{fixTotal.total.toFixed(2)}</td>
					</tr>
				</tbody>
			</table>
			<div className='result-actions'>
				<button onClick={resetResults}>Сбросить результаты</button>
			</div>
			<div className='total'>
				<p>Итог:</p>
				<span>{grandTotal.toFixed(2)}</span>
			</div>
		</div>
	)
}

export default Result
