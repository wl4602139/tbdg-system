'use client'

import { DataCatalogView } from '@/components/shared/data-catalog-view'
import { zeroCarbonDataItems, dataCatalogNote } from '@/lib/data-catalog'

export default function ZeroCarbonDataCatalogPage() {
  return (
    <DataCatalogView
      title="零碳园区集控中心 · 数据采集需求清单"
      desc="静态数据线下收集，动态数据通过系统接入 / 界面录入 / 大数据平台获取；两类数据均从项目公司或工厂收集"
      items={zeroCarbonDataItems}
      note={dataCatalogNote}
    />
  )
}
