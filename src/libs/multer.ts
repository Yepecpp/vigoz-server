import multer from 'multer';
import { PrivReq } from '@utils/middleware';
import fs from 'fs';
export function Geturl(arr: string[]) {
  if (arr.length === 0) return '';
  return arr[arr.length - 1];
}
const defPath = 'public/uploads/';
export const storage = multer.diskStorage({
  destination: (_req: PrivReq, _file, cb) => {
    cb(null, defPath);
  },
  filename: (req: PrivReq, file, cb) => {
    const path = Geturl(req.logData.url.split('/'));
    if (!path) return cb(new Error('No path'), '');
    const id = req.auth?.user._id;
    if (!id) return cb(new Error('No id'), '');
    if (!fs.existsSync(`${defPath}${path}/${id}`)) {
      fs.mkdirSync(`${defPath}${path}/${id}`, { recursive: true });
    }
    const ext = file.originalname.split('.').pop();
    const name = `${path}/${id}/avatar.${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });
export default upload;

