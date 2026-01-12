import { loggerService } from '../../services/logger.service.js'
import { backgroundService } from './background.service.js'

export async function removeBackground(req, res) {
    try {
        const { imageUrl } = req.body
        
        if (!imageUrl || typeof imageUrl !== 'string') {
            return res.status(400).json({ error: 'imageUrl is required' })
        }
        
        const imageBuffer = await backgroundService.removeBackgroundFromImage(imageUrl)
        
        // Set appropriate headers for image response
        res.set('Content-Type', 'image/png')
        res.send(imageBuffer)

    } catch(err) {
        console.error('REMOVE BG ERROR:', err?.response?.data || err)
        loggerService.error('Failed to remove background', err)
        res.status(500).send({
            err: 'Failed to remove background',
            details: err?.response?.data || err?.message
        })
    }
}