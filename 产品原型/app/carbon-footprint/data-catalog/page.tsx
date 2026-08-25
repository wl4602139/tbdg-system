'use client'

import { DataCatalogView } from '@/components/shared/data-catalog-view'
import { carbonFootprintDataItems, dataCatalogNote } from '@/lib/data-catalog'

export default function CarbonFootprintDataCatalogPage() {
  return (
    <DataCatalogView
      title="产品碳足迹集采中心 · 数据采集需求清单"
      desc="产品及订单碳足迹的核算结果、溯源依据、报告信息均来源于各经营单位本地的碳足迹追踪及报告系统，本地系统内嵌数据接口"
      items={carbonFootprintDataItems}
      note={dataCatalogNote}
    />
  )
}
