import type { AffineDownloadProvider } from '@affine/workspace/type';
import { assertExists } from '@blocksuite/store';

import { BlockSuiteWorkspace } from '../../../shared';
import { affineApis } from '../../../shared/apis';
import { providerLogger } from '../../logger';

const hashMap = new Map<string, Promise<ArrayBuffer>>();

export const createAffineDownloadProvider = (
  blockSuiteWorkspace: BlockSuiteWorkspace
): AffineDownloadProvider => {
  assertExists(blockSuiteWorkspace.id);
  const id = blockSuiteWorkspace.id;
  return {
    flavour: 'affine-download',
    background: true,
    connect: () => {
      providerLogger.info('connect download provider', id);
      if (!hashMap.has(id)) {
        hashMap.set(id, affineApis.downloadWorkspace(id, false));
      }

      hashMap.get(id)?.then(binary => {
        providerLogger.debug('applyUpdate');
        BlockSuiteWorkspace.Y.applyUpdate(
          blockSuiteWorkspace.doc,
          new Uint8Array(binary)
        );
      });
    },
    disconnect: () => {
      providerLogger.info('disconnect download provider', id);
    },
    cleanup: () => {
      hashMap.delete(id);
    },
  };
};
