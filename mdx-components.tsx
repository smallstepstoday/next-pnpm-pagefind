import type { MDXComponents as MDXComponentsType } from 'mdx/types'
import { MDXComponents } from '@/components/MDXComponents'

export function useMDXComponents(
  components: MDXComponentsType
): MDXComponentsType {
  return {
    ...components,
    ...MDXComponents,
  }
}
