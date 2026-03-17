import { useNavigate, useParams } from 'react-router-dom'
import type { PropImageRead, PropRead } from '../../../services/generated'
import { AssetEditPageBase } from './components/AssetEditPageBase'
import { assetAdapters } from './assetAdapters'

export default function PropAssetEditPage() {
  const navigate = useNavigate()
  const { propId } = useParams<{ propId: string }>()
  const adapter = assetAdapters.prop

  return (
    <AssetEditPageBase<PropRead, PropImageRead>
      assetId={propId}
      onNavigate={(to, replace) => navigate(to, replace ? { replace: true } : undefined)}
      {...adapter}
    />
  )
}

