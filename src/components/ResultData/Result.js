import React, { useContext } from 'react'
import { DataContext } from '../../DataContext'
import materialsData from '../Data/data.json'
import configData from '../Data/config.json'
import './result.scss'

function Result() {
	const { selectedData } = useContext(DataContext)

	// Функция для расчета количества листов и их стоимости
	const calculateMaterialTotal = () => {
		const material = materialsData.find(
			item => item.name === selectedData.material
		)
		if (!material) return { quantity: 0, total: 0, sheetCount: 0 }

		const area =
			(parseFloat(selectedData.length) || 0) *
			(parseFloat(selectedData.width) || 0)
		const sheetWidth = material.width || 1
		const sheetArea = 1 * sheetWidth // Площадь одного листа
		const sheetCount = Math.ceil(area / sheetArea) // Количество листов
		const total = sheetCount * (material.price || 0)

		return { quantity: area.toFixed(2), total: total.toFixed(2), sheetCount }
	}

	// Функция для расчета погонных метров труб
	const calculatePipeTotal = () => {
		const pipe = materialsData.find(item => item.name === selectedData.pipe)
		if (!pipe) return { quantity: 0, total: 0 }

		const stepConfig = configData.find(item => item.type === 'frame')?.step || 1
		const pipeWidthMeters = (pipe.width || 0) / 1000 // Ширина трубы в метрах
		const distanceBetweenTubes = stepConfig - pipeWidthMeters // Расстояние между трубами

		const length = parseFloat(selectedData.length) || 0
		const width = parseFloat(selectedData.width) || 0

		// Количество труб по длине и ширине
		const pipesAlongLength = Math.ceil(length / distanceBetweenTubes)
		const pipesAlongWidth = Math.ceil(width / distanceBetweenTubes)

		// Общая длина трубы (в метрах)
		const totalPipeLength = pipesAlongLength * width + pipesAlongWidth * length
		const total = totalPipeLength * (pipe.price || 0)

		return { quantity: totalPipeLength.toFixed(2), total: total.toFixed(2) }
	}

	const calculateFixTotal = () => {
		const material = materialsData.find(
			item => item.name === selectedData.material
		)
		if (!material) return { quantity: 0, total: 0 }

		// Получаем конфигурацию саморезов в зависимости от типа материала
		const fixConfig = configData.find(item => item.key === material.type) // Здесь мы используем material.type

		if (!fixConfig) return { quantity: 0, total: 0 }

		const area =
			(parseFloat(selectedData.length) || 0) *
			(parseFloat(selectedData.width) || 0)
		const screwsPerSquareMeter = fixConfig.value || 0 // Количество саморезов на квадратный метр
		const quantity = area * screwsPerSquareMeter
		const total = quantity * (fixConfig.price || 0) // Убедитесь, что в вашем configData есть цена для саморезов

		return { quantity: quantity.toFixed(2), total: total.toFixed(2) }
	}

	const materialTotal = calculateMaterialTotal()
	const pipeTotal = calculatePipeTotal()
	const fixTotal = calculateFixTotal()
	const grandTotal = (
		parseFloat(materialTotal.total) +
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
						<td>{selectedData.material}</td>
						<td>м²</td>
						<td>{materialTotal.quantity}</td>
						<td>{materialTotal.total} руб.</td>
					</tr>
					<tr>
						<td>Листы ({selectedData.material})</td>
						<td>шт</td>
						<td>{materialTotal.sheetCount}</td>
						<td>{materialTotal.total} руб.</td>
					</tr>
					<tr>
						<td>{selectedData.pipe}</td>
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
				<tfoot>
					<tr>
						<th colSpan='3'>Итого:</th>
						<th>{grandTotal} руб.</th>
					</tr>
				</tfoot>
			</table>
		</div>
	)
}

export default Result
