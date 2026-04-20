// Resize + compress an uploaded image to a JPEG data URL.
// Keeps localStorage small and PDF renders fast.
// maxSize = longest edge in pixels; quality = 0–1 JPEG quality.
export async function fileToResizedDataUrl(
  file: File,
  maxSize = 400,
  quality = 0.85
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image file')
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image too large — must be under 10MB')
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context failed'))
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image — try a different file'))
    }
    img.src = url
  })
}
