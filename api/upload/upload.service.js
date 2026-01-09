export const uploadService = {
    upload
}

async function upload(file) {
    return `/uploads/boards/${file.filename}`
}