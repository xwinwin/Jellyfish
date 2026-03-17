import { StudioAssetsService, StudioImageTasksService } from '../../../services/generated'
import type {
  ActorImageImageRead,
  ActorImageRead,
  CostumeImageRead,
  CostumeRead,
  PropImageRead,
  PropRead,
  SceneImageRead,
  SceneRead,
} from '../../../services/generated'
import type { AssetEditPageBaseProps, BaseAsset, BaseAssetImage } from './components/AssetEditPageBase'

type AdapterConfig<TAsset extends BaseAsset, TImage extends BaseAssetImage> = Omit<
  AssetEditPageBaseProps<TAsset, TImage>,
  'assetId' | 'onNavigate'
>

type UpdateImagePayload = {
  file_id: string
  width?: number | null
  height?: number | null
  format?: string | null
}

function normalizeUpdateImagePayload(payload: UpdateImagePayload): UpdateImagePayload {
  return {
    ...payload,
    format: payload.format ?? 'png',
  }
}

export const assetAdapters = {
  actor: {
    missingAssetIdText: '缺少 actor_image_id',
    assetDisplayName: '演员',
    backTo: '/assets?tab=actor',
    relationType: 'actor_image_image',
    getAsset: async (id: string) => {
      const res = await StudioAssetsService.getActorImageApiV1StudioAssetsActorImagesActorImageIdGet({ actorImageId: id })
      return (res.data ?? null) as ActorImageRead | null
    },
    updateAsset: async (id: string, payload) => {
      const res = await StudioAssetsService.updateActorImageApiV1StudioAssetsActorImagesActorImageIdPatch({
        actorImageId: id,
        requestBody: payload,
      })
      return (res.data ?? null) as ActorImageRead | null
    },
    listImages: async (id: string) => {
      const res = await StudioAssetsService.listActorImageImagesApiV1StudioAssetsActorImagesActorImageIdImagesGet({
        actorImageId: id,
        page: 1,
        pageSize: 100,
      })
      return (res.data?.items ?? []) as ActorImageImageRead[]
    },
    createImageSlot: async (id: string, angle) => {
      await StudioAssetsService.createActorImageImageApiV1StudioAssetsActorImagesActorImageIdImagesPost({
        actorImageId: id,
        requestBody: { view_angle: angle },
      })
    },
    updateImage: async (id: string, imageId: number, payload) => {
      await StudioAssetsService.updateActorImageImageApiV1StudioAssetsActorImagesActorImageIdImagesImageIdPatch({
        actorImageId: id,
        imageId,
        requestBody: normalizeUpdateImagePayload(payload),
      })
    },
    createGenerationTask: async (id: string, imageId: number) => {
      const res = await StudioImageTasksService.createActorImageGenerationTaskApiV1StudioImageTasksActorImagesActorImageIdImageTasksPost({
        actorImageId: id,
        requestBody: { image_id: imageId },
      })
      return res.data?.task_id ?? null
    },
  } satisfies AdapterConfig<ActorImageRead, ActorImageImageRead>,
  scene: {
    missingAssetIdText: '缺少 scene_id',
    assetDisplayName: '场景',
    backTo: '/assets?tab=scene',
    relationType: 'scene_image',
    getAsset: async (id: string) => {
      const res = await StudioAssetsService.getSceneApiV1StudioAssetsScenesSceneIdGet({ sceneId: id })
      return (res.data ?? null) as SceneRead | null
    },
    updateAsset: async (id: string, payload) => {
      const res = await StudioAssetsService.updateSceneApiV1StudioAssetsScenesSceneIdPatch({
        sceneId: id,
        requestBody: payload,
      })
      return (res.data ?? null) as SceneRead | null
    },
    listImages: async (id: string) => {
      const res = await StudioAssetsService.listSceneImagesApiV1StudioAssetsScenesSceneIdImagesGet({
        sceneId: id,
        page: 1,
        pageSize: 100,
      })
      return (res.data?.items ?? []) as SceneImageRead[]
    },
    createImageSlot: async (id: string, angle) => {
      await StudioAssetsService.createSceneImageApiV1StudioAssetsScenesSceneIdImagesPost({
        sceneId: id,
        requestBody: { view_angle: angle },
      })
    },
    updateImage: async (id: string, imageId: number, payload) => {
      await StudioAssetsService.updateSceneImageApiV1StudioAssetsScenesSceneIdImagesImageIdPatch({
        sceneId: id,
        imageId,
        requestBody: normalizeUpdateImagePayload(payload),
      })
    },
    createGenerationTask: async (id: string, imageId: number) => {
      const res = await StudioImageTasksService.createAssetImageGenerationTaskApiV1StudioImageTasksAssetsAssetTypeAssetIdImageTasksPost({
        assetType: 'scene',
        assetId: id,
        requestBody: { image_id: imageId },
      })
      return res.data?.task_id ?? null
    },
  } satisfies AdapterConfig<SceneRead, SceneImageRead>,
  prop: {
    missingAssetIdText: '缺少 prop_id',
    assetDisplayName: '道具',
    backTo: '/assets?tab=prop',
    relationType: 'prop_image',
    getAsset: async (id: string) => {
      const res = await StudioAssetsService.getPropApiV1StudioAssetsPropsPropIdGet({ propId: id })
      return (res.data ?? null) as PropRead | null
    },
    updateAsset: async (id: string, payload) => {
      const res = await StudioAssetsService.updatePropApiV1StudioAssetsPropsPropIdPatch({
        propId: id,
        requestBody: payload,
      })
      return (res.data ?? null) as PropRead | null
    },
    listImages: async (id: string) => {
      const res = await StudioAssetsService.listPropImagesApiV1StudioAssetsPropsPropIdImagesGet({
        propId: id,
        page: 1,
        pageSize: 100,
      })
      return (res.data?.items ?? []) as PropImageRead[]
    },
    createImageSlot: async (id: string, angle) => {
      await StudioAssetsService.createPropImageApiV1StudioAssetsPropsPropIdImagesPost({
        propId: id,
        requestBody: { view_angle: angle },
      })
    },
    updateImage: async (id: string, imageId: number, payload) => {
      await StudioAssetsService.updatePropImageApiV1StudioAssetsPropsPropIdImagesImageIdPatch({
        propId: id,
        imageId,
        requestBody: normalizeUpdateImagePayload(payload),
      })
    },
    createGenerationTask: async (id: string, imageId: number) => {
      const res = await StudioImageTasksService.createAssetImageGenerationTaskApiV1StudioImageTasksAssetsAssetTypeAssetIdImageTasksPost({
        assetType: 'prop',
        assetId: id,
        requestBody: { image_id: imageId },
      })
      return res.data?.task_id ?? null
    },
  } satisfies AdapterConfig<PropRead, PropImageRead>,
  costume: {
    missingAssetIdText: '缺少 costume_id',
    assetDisplayName: '服装',
    backTo: '/assets?tab=costume',
    relationType: 'costume_image',
    getAsset: async (id: string) => {
      const res = await StudioAssetsService.getCostumeApiV1StudioAssetsCostumesCostumeIdGet({ costumeId: id })
      return (res.data ?? null) as CostumeRead | null
    },
    updateAsset: async (id: string, payload) => {
      const res = await StudioAssetsService.updateCostumeApiV1StudioAssetsCostumesCostumeIdPatch({
        costumeId: id,
        requestBody: payload,
      })
      return (res.data ?? null) as CostumeRead | null
    },
    listImages: async (id: string) => {
      const res = await StudioAssetsService.listCostumeImagesApiV1StudioAssetsCostumesCostumeIdImagesGet({
        costumeId: id,
        page: 1,
        pageSize: 100,
      })
      return (res.data?.items ?? []) as CostumeImageRead[]
    },
    createImageSlot: async (id: string, angle) => {
      await StudioAssetsService.createCostumeImageApiV1StudioAssetsCostumesCostumeIdImagesPost({
        costumeId: id,
        requestBody: { view_angle: angle },
      })
    },
    updateImage: async (id: string, imageId: number, payload) => {
      await StudioAssetsService.updateCostumeImageApiV1StudioAssetsCostumesCostumeIdImagesImageIdPatch({
        costumeId: id,
        imageId,
        requestBody: normalizeUpdateImagePayload(payload),
      })
    },
    createGenerationTask: async (id: string, imageId: number) => {
      const res = await StudioImageTasksService.createAssetImageGenerationTaskApiV1StudioImageTasksAssetsAssetTypeAssetIdImageTasksPost({
        assetType: 'costume',
        assetId: id,
        requestBody: { image_id: imageId },
      })
      return res.data?.task_id ?? null
    },
  } satisfies AdapterConfig<CostumeRead, CostumeImageRead>,
}

