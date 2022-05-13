import React, { useEffect } from 'react'
import styles from './styles.module.css'
import TimeTable from './component/TimeTable'

export const OnuiiTimeTable = ({ areaData, itemData }) => {
  return (
    <div>
      <TimeTable areaData={areaData} itemData={itemData} />
    </div>
  )
}
