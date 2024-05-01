import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename)

const fileRemover = (filename) => {
    fs.unlink(path.join(__dirname, "../uploads", filename), (err) => {
        if(err && err.code == "ENOENT") {
            console.log(`File ${filename} doesn't exist`);
        }else if(err) { 
            console.log(`Error ocurred while trying to remove file ${filename}`);
        }else {
            console.log(`removed ${filename}`);
        }
    })
}

export { fileRemover }