// atoms/product.atom.ts
import { atomWithStorage } from 'jotai/utils'

export const selectedProductAtom = atomWithStorage(
  'selected-product',
  {name:'ndour'}
)
