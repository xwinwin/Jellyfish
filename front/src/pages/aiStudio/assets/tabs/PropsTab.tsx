import { AssetTypeTab } from './AssetTypeTab'
import { StudioAssetsService } from '../../../../services/generated'
import type { PropRead } from '../../../../services/generated'
import { useNavigate } from 'react-router-dom'

export function PropsTab() {
  const navigate = useNavigate()

  return (
    <AssetTypeTab
      label="道具"
      listAssets={async ({ q, page, pageSize }) => {
        const res = await StudioAssetsService.listPropsApiV1StudioAssetsPropsGet({ q: q ?? null, page, pageSize })
        return { items: (res.data?.items ?? []) as PropRead[], total: res.data?.pagination.total ?? 0 }
      }}
      createAsset={async (payload) => {
        const res = await StudioAssetsService.createPropApiV1StudioAssetsPropsPost({ requestBody: payload })
        if (!res.data) throw new Error('empty prop')
        return res.data as PropRead
      }}
      updateAsset={async (id, payload) => {
        const res = await StudioAssetsService.updatePropApiV1StudioAssetsPropsPropIdPatch({
          propId: id,
          requestBody: payload,
        })
        if (!res.data) throw new Error('empty prop')
        return res.data as PropRead
      }}
      deleteAsset={async (id) => {
        await StudioAssetsService.deletePropApiV1StudioAssetsPropsPropIdDelete({ propId: id })
      }}
      onEditAsset={(asset) => {
        navigate(`/assets/props/${asset.id}/edit`)
      }}
    />
  )
}
