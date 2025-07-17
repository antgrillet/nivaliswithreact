import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Types MIME pour les images
const MIME_TYPES: { [key: string]: string } = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    // Récupérer les paramètres
    const params = await context.params
    
    // Construire le chemin vers l'image
    const imagePath = path.join(process.cwd(), 'public', 'img', ...params.path)
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(imagePath)) {
      return new NextResponse('Image not found', { status: 404 })
    }
    
    // Vérifier que c'est bien un fichier (pas un dossier)
    const stat = fs.statSync(imagePath)
    if (!stat.isFile()) {
      return new NextResponse('Not a file', { status: 400 })
    }
    
    // Déterminer le type MIME
    const ext = path.extname(imagePath).toLowerCase()
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream'
    
    // Lire le fichier
    const buffer = fs.readFileSync(imagePath)
    
    // Créer la réponse avec les headers appropriés
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}