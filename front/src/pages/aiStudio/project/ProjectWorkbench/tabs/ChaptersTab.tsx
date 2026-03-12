import { useState } from 'react'
import { Card, Button, Tag, Space, Table, Empty, Modal, Input, message } from 'antd'
import type { TableColumnsType } from 'antd'
import { PlusOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import type { Chapter } from '../../../../../mocks/data'
import { chapterStatusMap } from '../constants'
import { getChapterPrepPath, getChapterStudioPath } from '../routes'

const { TextArea } = Input

export function ChaptersTab({
  chapters,
  loading,
  onOpenCreate,
}: {
  chapters: Chapter[]
  loading: boolean
  onOpenCreate: () => void
}) {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const [editOpen, setEditOpen] = useState(false)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [editContent, setEditContent] = useState('')

  const openEditModal = (chapter: Chapter) => {
    setEditingChapter(chapter)
    setEditContent(chapter.summary || '')
    setEditOpen(true)
  }

  const columns: TableColumnsType<Chapter> = [
    { title: '章节', dataIndex: 'index', key: 'index', width: 80, render: (v: number) => `第${v}集` },
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '分镜数', dataIndex: 'storyboardCount', key: 'storyboardCount', width: 90 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: Chapter['status']) => (
        <Tag color={chapterStatusMap[status].color}>{chapterStatusMap[status].text}</Tag>
      ),
    },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 260,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => projectId && navigate(getChapterPrepPath(projectId, record.id))}
          >
            章节编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<VideoCameraOutlined />}
            onClick={() => projectId && navigate(getChapterStudioPath(projectId, record.id))}
          >
            进入拍摄
          </Button>
        </Space>
      ),
    },
  ]

  if (chapters.length === 0 && !loading) {
    return (
      <Card>
        <Empty description="还没有任何章节，立即创建第一章吧" image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Space>
            <Button type="primary" size="large" icon={<PlusOutlined />} onClick={onOpenCreate}>
              创建第一章
            </Button>
          </Space>
        </Empty>
      </Card>
    )
  }

  return (
    <Card
      title="章节列表"
      extra={
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={onOpenCreate}>
            新建章节
          </Button>
        </Space>
      }
    >
      <Table<Chapter>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={chapters}
        pagination={{ pageSize: 10 }}
        size="small"
      />

      <Modal
        title={editingChapter ? `编辑章节：${editingChapter.title}` : '编辑章节'}
        open={editOpen}
        onCancel={() => {
          setEditOpen(false)
          setEditingChapter(null)
        }}
        onOk={() => {
          message.success('已保存（Mock）')
          setEditOpen(false)
          setEditingChapter(null)
        }}
        okText="保存"
        width={560}
      >
        <div>
          <span className="text-gray-600 text-sm">内容编辑</span>
          <TextArea
            rows={6}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="mt-1"
          />
        </div>
      </Modal>
    </Card>
  )
}

