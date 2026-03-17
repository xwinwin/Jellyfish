import { useNavigate, useParams } from 'react-router-dom'
import type {
  ActorImageImageRead,
  ActorImageRead,
} from '../../../services/generated'
import { AssetEditPageBase } from './components/AssetEditPageBase'
import { assetAdapters } from './assetAdapters'

export default function ActorAssetEditPage() {
  const navigate = useNavigate()
  const { actorImageId } = useParams<{ actorImageId: string }>()
  const adapter = assetAdapters.actor

  return (
    <AssetEditPageBase<ActorImageRead, ActorImageImageRead>
      assetId={actorImageId}
      onNavigate={(to, replace) => navigate(to, replace ? { replace: true } : undefined)}
      {...adapter}
    />
  )
}




