import React, { useEffect } from 'react'
import styles from './styles.module.css'
import TimeTable from './Component/TimeTable'

export const OnuiiTimeTable = ({ areaData, itemData }) => {
  console.log('!!', itemData)
  useEffect(() => {
    console.log('active')
  }, [])
  return (
    <div>
      <TimeTable areaData={areaData} itemData={itemData} />
    </div>
  )
}
