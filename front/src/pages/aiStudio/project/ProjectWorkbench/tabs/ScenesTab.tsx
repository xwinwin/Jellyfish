import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PlaceholderTab } from './PlaceholderTab'

export function ScenesTab() {
  const navigate = useNavigate()
  return (
    <PlaceholderTab
      title="场景管理"
      description="管理场景资源，支持按室内/室外/特殊分类。"
      actionLabel="前往资产管理"
      onAction={() => navigate('/assets')}
    />
  )
}

