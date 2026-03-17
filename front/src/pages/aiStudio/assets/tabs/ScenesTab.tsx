import { AssetTypeTab } from './AssetTypeTab'
import { StudioAssetsService } from '../../../../services/generated'
import type { SceneRead } from '../../../../services/generated'
import { useNavigate } from 'react-router-dom'

export function ScenesTab() {
  const navigate = useNavigate()

  return (
    <AssetTypeTab
      label="场景"
      listAssets={async ({ q, page, pageSize }) => {
        const res = await StudioAssetsService.listScenesApiV1StudioAssetsScenesGet({ q: q ?? null, page, pageSize })
        return { items: (res.data?.items ?? []) as SceneRead[], total: res.data?.pagination.total ?? 0 }
      }}
      createAsset={async (payload) => {
        const res = await StudioAssetsService.createSceneApiV1StudioAssetsScenesPost({ requestBody: payload })
        if (!res.data) throw new Error('empty scene')
        return res.data as SceneRead
      }}
      updateAsset={async (id, payload) => {
        const res = await StudioAssetsService.updateSceneApiV1StudioAssetsScenesSceneIdPatch({
          sceneId: id,
          requestBody: payload,
        })
        if (!res.data) throw new Error('empty scene')
        return res.data as SceneRead
      }}
      deleteAsset={async (id) => {
        await StudioAssetsService.deleteSceneApiV1StudioAssetsScenesSceneIdDelete({ sceneId: id })
      }}
      onEditAsset={(asset) => {
        navigate(`/assets/scenes/${asset.id}/edit`)
      }}
    />
  )
}
