const WIX_MEDIA_HOSTS = {
  "media.base44.com": "/images/public/",
  "static.wixstatic.com": "/media/",
}
export const DEFAULT_TRANSFORM_WIDTH = 1024
export const IMAGE_LOAD_MODE = {
  OPTIMIZED: "optimized",
  ORIGINAL: "original",
  FALLBACK: "fallback",
}
const DEVICE_PIXEL_RATIOS = [1, 2, 3]
const MAX_DIMENSION = 6000
export function splitImageProps(props) {
  const wrapperProps = {}
  const imageProps = {}
  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith("data-")) wrapperProps[key] = value
    else imageProps[key] = value
  }
  return { wrapperProps, imageProps }
}
export function getImagePreviewClassName(className, currentClassName, baselineClassName) {
  const sourceClasses = new Set((className || "").split(/\s+/))
  const baselineClasses = new Set(baselineClassName.split(/\s+/))
  return currentClassName.split(/\s+/).filter((token) =>
    !["inline-block", "relative"].includes(token) || !baselineClasses.has(token) || sourceClasses.has(token)
  ).join(" ")
}
/** Returns transform metadata only for canonical public Wix image URLs. */
export function parseWixMediaUrl(src) {
  try {
    const url = new URL(src)
    if (