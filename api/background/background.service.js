import axios from "axios"
import { loggerService } from "../../services/logger.service.js"

const PYTHON_BG_SERVICE_URL =
  process.env.BG_REMOVAL_SERVICE_URL ||
  'http://127.0.0.1:8001/remove-background'

export const backgroundService = {
    removeBackgroundFromImage
}

async function removeBackgroundFromImage(imageUrl) {
    try {
        const response = await axios.post(PYTHON_BG_SERVICE_URL, 
            { image_url: imageUrl },
            { responseType: 'arraybuffer', 
                timeout: 30_000 
            }
        )

        return response.data
    } catch (err) {
        loggerService.error('Background removal service failed', err)
        throw err
    }
}