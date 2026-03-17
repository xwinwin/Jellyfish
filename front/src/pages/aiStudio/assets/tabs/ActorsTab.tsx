import { AssetTypeTab } from './AssetTypeTab'
import { StudioAssetsService } from '../../../../services/generated'
import type { ActorImageRead } from '../../../../services/generated'
import { useNavigate } from 'react-router-dom'

export function ActorsTab() {
  const navigate = useNavigate()

  return (
    <AssetTypeTab
      label="演员"
      listAssets={async ({ q, page, pageSize }) => {
        const res = await StudioAssetsService.listActorImagesApiV1StudioAssetsActorImagesGet({
          q: q ?? null,
          page,
          pageSize,
        })
        return { items: (res.data?.items ?? []) as ActorImageRead[], total: res.data?.pagination.total ?? 0 }
      }}
      createAsset={async (payload) => {
        const res = await StudioAssetsService.createActorImageApiV1StudioAssetsActorImagesPost({ requestBody: payload })
        if (!res.data) throw new Error('empty actor image')
        return res.data as ActorImageRead
      }}
      updateAsset={async (id, payload) => {
        const res = await StudioAssetsService.updateActorImageApiV1StudioAssetsActorImagesActorImageIdPatch({
          actorImageId: id,
          requestBody: payload,
        })
        if (!res.data) throw new Error('empty actor image')
        return res.data as ActorImageRead
      }}
      deleteAsset={async (id) => {
        await StudioAssetsService.deleteActorImageApiV1StudioAssetsActorImagesActorImageIdDelete({ actorImageId: id })
      }}
      onEditAsset={(asset) => {
        navigate(`/assets/actors/${asset.id}/edit`)
      }}
    />
  )
}
