import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PlaceholderTab } from './PlaceholderTab'

export function RolesTab() {
  const navigate = useNavigate()
  return (
    <PlaceholderTab
      title="角色管理"
      description="管理项目角色与立绘，支持筛选「缺少立绘」「缺少提示词」。"
      actionLabel="前往资产管理"
      onAction={() => navigate('/assets')}
    />
  )
}

