import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PlaceholderTab } from './PlaceholderTab'

export function PropsTab() {
  const navigate = useNavigate()
  return (
    <PlaceholderTab
      title="道具 / 服装"
      description="合并管理道具与服装，支持按类别过滤。"
      actionLabel="前往资产管理"
      onAction={() => navigate('/assets')}
    />
  )
}

