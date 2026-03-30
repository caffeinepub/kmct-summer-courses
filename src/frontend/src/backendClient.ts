import type { backendInterface } from "./backend.d";
/**
 * Lazy singleton backend client for direct (non-hook) calls.
 * All methods on the backend are public — no auth required.
 */
import { createActorWithConfig } from "./config";

let _actor: backendInterface | null = null;
let _promise: Promise<backendInterface> | null = null;

export async function getBackend(): Promise<backendInterface> {
  if (_actor) return _actor;
  if (_promise) return _promise;
  _promise = createActorWithConfig().then((a) => {
    _actor = a as unknown as backendInterface;
    return _actor;
  });
  return _promise;
}
