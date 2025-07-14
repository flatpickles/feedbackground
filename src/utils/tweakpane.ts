import type { BladeApi, FolderApi, InputBindingApi } from 'tweakpane'
import type { Pane } from 'tweakpane'

/**
 * Typed wrapper for `addFolder` to avoid `any` casts.
 */
export function addFolderTyped(
  parent: Pane | FolderApi,
  params: Record<string, unknown>,
): FolderApi {
  return (parent as unknown as { addFolder(p: Record<string, unknown>): FolderApi }).addFolder(
    params,
  )
}

/**
 * Typed wrapper for `addBlade` to avoid `any` casts.
 */
export function addBladeTyped<Api extends BladeApi>(
  parent: Pane | FolderApi,
  params: Record<string, unknown>,
): Api {
  return (parent as unknown as { addBlade(p: Record<string, unknown>): BladeApi }).addBlade(
    params,
  ) as Api
}

/**
 * Typed wrapper for `addBinding` to avoid `any` casts.
 */
export function addBindingTyped<T>(
  parent: Pane | FolderApi,
  object: { [k: string]: T },
  key: string,
  params?: Record<string, unknown>,
): InputBindingApi<T> {
  return (parent as unknown as {
    addBinding(obj: { [k: string]: T }, key: string, p?: Record<string, unknown>): InputBindingApi<T>
  }).addBinding(object, key, params)
}

/**
 * Typed wrapper for `remove`.
 */
export function removeBladeTyped(parent: Pane | FolderApi, child: BladeApi): void {
  return (parent as unknown as { remove(api: BladeApi): void }).remove(child)
}
