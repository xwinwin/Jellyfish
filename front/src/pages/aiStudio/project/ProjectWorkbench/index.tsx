import React, { useEffect, useState } from 'react'
import { Card, Button, Tabs, Space, Dropdown, Modal, Input, message, Empty, Spin } from 'antd'
import type { MenuProps } from 'antd'
import {
  PlusOutlined,
  EllipsisOutlined,
  ArrowLeftOutlined,
  VideoCameraOutlined,
  VideoCameraFilled,
} from '@ant-design/icons'
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { projects as mockProjects, chapters as mockChapters, type Project, type Chapter } from '../../../../mocks/data'
import { StudioChaptersService, StudioProjectsService } from '../../../../services/generated'
import type { ChapterRead, ProjectRead } from '../../../../services/generated'
import { TAB_CONFIG, type TabKey, isTabKey, DEFAULT_TAB } from './constants'
import { DashboardTab } from './tabs/DashboardTab'
import { ChaptersTab } from './tabs/ChaptersTab'
import { RolesTab } from './tabs/RolesTab'
import { ScenesTab } from './tabs/ScenesTab'
import { PropsTab } from './tabs/PropsTab'
import { FilesTab } from './tabs/FilesTab'
import { EditTab } from './tabs/EditTab'
import { SettingsTab } from './tabs/SettingsTab'
import { getChapterStudioPath, getProjectEditorPath } from './routes'

const { TextArea } = Input

const TAB_PARAM = 'tab'

const ProjectWorkbench: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabFromUrl = searchParams.get(TAB_PARAM)
  const resolvedTab: TabKey =
    tabFromUrl !== null && isTabKey(tabFromUrl) ? tabFromUrl : DEFAULT_TAB

  const [project, setProject] = useState<Project | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>(() => resolvedTab)
  const [createChapterOpen, setCreateChapterOpen] = useState(false)
  const [createTitle, setCreateTitle] = useState('')
  const [createContent, setCreateContent] = useState('')

  // 与 URL 中的 tab 同步：URL 变化时更新 activeTab；初次或无效 tab 时写回 URL
  useEffect(() => {
    if (tabFromUrl !== null && isTabKey(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    } else if (tabFromUrl === null || tabFromUrl === '') {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set(TAB_PARAM, DEFAULT_TAB)
          return next
        },
        { replace: true }
      )
    }
  }, [tabFromUrl, setSearchParams])

  const useMock = import.meta.env.VITE_USE_MOCK === 'true'

  const newId = (prefix: string) => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
  }

  const toUIProject = (p: ProjectRead): Project => {
    const stats = (p.stats ?? {}) as Record<string, unknown>
    const getNum = (key: string) => {
      const v = stats[key]
      return typeof v === 'number' && Number.isFinite(v) ? v : 0
    }

    const updatedAt =
      (typeof stats.updated_at === 'string' && stats.updated_at) ||
      (typeof stats.updatedAt === 'string' && stats.updatedAt) ||
      new Date().toISOString()

    return {
      id: p.id,
      name: p.name,
      description: p.description ?? '',
      style: (p.style as Project['style']) ?? '现实主义',
      seed: p.seed ?? 0,
      unifyStyle: p.unify_style ?? true,
      progress: p.progress ?? 0,
      stats: {
        chapters: getNum('chapters'),
        roles: getNum('roles'),
        scenes: getNum('scenes'),
        props: getNum('props'),
      },
      updatedAt,
    }
  }

  const toUIChapter = (c: ChapterRead): Chapter => {
    return {
      id: c.id,
      projectId: c.project_id,
      index: c.index,
      title: c.title,
      summary: c.summary ?? '',
      storyboardCount: c.storyboard_count ?? 0,
      status: c.status ?? 'draft',
      updatedAt: new Date().toISOString(),
    }
  }

  const load = async () => {
    if (!projectId) return
    setLoading(true)
    try {
      if (useMock) {
        setProject(mockProjects.find((p) => p.id === projectId) ?? null)
        setChapters(mockChapters.filter((c) => c.projectId === projectId))
      } else {
        const [projRes, chapterRes] = await Promise.all([
          StudioProjectsService.getProjectApiV1StudioProjectsProjectIdGet({ projectId }),
          StudioChaptersService.listChaptersApiV1StudioChaptersGet({
            projectId,
            page: 1,
            pageSize: 100,
          }),
        ])

        const proj = projRes.data ?? null
        const chapterItems = chapterRes.data?.items ?? []

        setProject(proj ? toUIProject(proj) : null)
        setChapters(chapterItems.map(toUIChapter))
      }
    } catch {
      if (useMock) {
        setProject(mockProjects.find((p) => p.id === projectId) ?? null)
        setChapters(mockChapters.filter((c) => c.projectId === projectId))
      } else {
        setProject(null)
        setChapters([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [projectId])

  const handleCreateChapter = async () => {
    if (!createTitle.trim()) {
      message.warning('请输入章节标题')
      return
    }

    if (!projectId) return

    try {
      if (useMock) {
        message.success('创建成功（Mock）')
      } else {
        const nextIndex = Math.max(0, ...chapters.map((c) => c.index)) + 1
        const res = await StudioChaptersService.createChapterApiV1StudioChaptersPost({
          requestBody: {
            id: newId('c'),
            project_id: projectId,
            index: nextIndex,
            title: createTitle.trim(),
            summary: '',
            raw_text: createContent || undefined,
            storyboard_count: 0,
            status: 'draft',
          },
        })
        if (!res.data) throw new Error('empty chapter')
        message.success('章节创建成功')
      }

      setCreateChapterOpen(false)
      setCreateTitle('')
      setCreateContent('')
      await load()
    } catch {
      message.error('创建章节失败')
    }
  }

  const incompleteChapters = chapters.filter((c) => c.status !== 'done')
  const latestInProgressChapter = chapters.find((c) => c.status === 'shooting') ?? incompleteChapters[0]

  const setTabInUrl = (tab: TabKey) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set(TAB_PARAM, tab)
        return next
      },
      { replace: true }
    )
  }

  const moreMenuItems: MenuProps['items'] = [
    { key: 'newRole', label: '新建角色', onClick: () => setTabInUrl('roles') },
    { key: 'upload', label: '上传素材', onClick: () => navigate('/assets') },
    { key: 'newScene', label: '新建场景', onClick: () => setTabInUrl('scenes') },
    { key: 'newProp', label: '新建道具', onClick: () => setTabInUrl('props') },
  ]

  if (!project && !loading) {
    return (
      <Card>
        <Empty description="项目不存在" />
        <Link to="/projects">
          <Button type="link" icon={<ArrowLeftOutlined />}>
            返回项目列表
          </Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-0">
      <div
        className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm"
        style={{ margin: -5, marginBottom: 0, padding: '16px 24px' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <Tabs
            activeKey={activeTab}
            onChange={(k) => setTabInUrl(k as TabKey)}
            size="middle"
            className="project-workbench-tabs flex-1 min-w-0"
            items={TAB_CONFIG.map(({ key, label, icon }) => ({
              key,
              label: (
                <span className="flex items-center gap-1.5">
                  {icon}
                  {label}
                </span>
              ),
            }))}
          />
          <Space size="small" wrap className="shrink-0">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateChapterOpen(true)}>
              新建章节
            </Button>
            {latestInProgressChapter ? (
              <Button
                icon={<VideoCameraOutlined />}
                onClick={() => projectId && navigate(getChapterStudioPath(projectId, latestInProgressChapter.id))}
              >
                继续拍摄{chapters.length > 0 ? `第${latestInProgressChapter.index}章` : ''}
              </Button>
            ) : (
              <Button icon={<VideoCameraOutlined />} disabled>
                继续拍摄
              </Button>
            )}
            <Button icon={<VideoCameraFilled />} onClick={() => projectId && navigate(getProjectEditorPath(projectId))}>
              进入后期剪辑
            </Button>
            <Dropdown menu={{ items: moreMenuItems }} placement="bottomRight">
              <Button icon={<EllipsisOutlined />}>更多</Button>
            </Dropdown>
          </Space>
        </div>
      </div>

      <div className="pt-4 animate-fadeIn" style={{ animation: 'fadeIn 0.25s ease-out' }}>
        {activeTab === 'dashboard' &&
          (project ? (
            <DashboardTab
              project={project}
              chapters={chapters}
              latestChapter={latestInProgressChapter}
              onSelectTab={setTabInUrl}
            />
          ) : (
            <div className="flex justify-center items-center py-16">
              <Spin size="large" tip="加载中…" />
            </div>
          ))}

        {activeTab === 'chapters' && (
          <ChaptersTab
            chapters={chapters}
            loading={loading}
            onOpenCreate={() => setCreateChapterOpen(true)}
          />
        )}

        {activeTab === 'roles' && <RolesTab />}
        {activeTab === 'scenes' && <ScenesTab />}
        {activeTab === 'props' && <PropsTab />}
        {activeTab === 'files' && <FilesTab />}
        {activeTab === 'edit' && <EditTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>

      <Modal
        title="新建章节"
        open={createChapterOpen}
        onCancel={() => setCreateChapterOpen(false)}
        onOk={handleCreateChapter}
        okText="创建"
        width={560}
      >
        <div className="space-y-3">
          <div>
            <span className="text-gray-600 text-sm">章节标题</span>
            <Input
              placeholder="例如：第1集 出租屋里的争吵"
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <span className="text-gray-600 text-sm">章节内容（可粘贴剧本）</span>
            <TextArea
              rows={6}
              placeholder="粘贴文学剧本..."
              value={createContent}
              onChange={(e) => setCreateContent(e.target.value)}
              className="mt-1 font-mono text-sm"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProjectWorkbench

