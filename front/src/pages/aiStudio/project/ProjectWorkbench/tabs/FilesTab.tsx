import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PlaceholderTab } from './PlaceholderTab'

export function FilesTab() {
  const navigate = useNavigate()
  return (
    <PlaceholderTab
      title="生成文件"
      description="生成的图片/视频素材库，支持标签过滤、批量标记、导出。"
      actionLabel="前往文件管理"
      onAction={() => navigate('/files')}
    />
  )
}

