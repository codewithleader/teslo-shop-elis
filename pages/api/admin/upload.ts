import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
// import fs from 'fs'; // Para guardar en nuestro filesystem
// Cloudinary
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = {
  message: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

// ! IMPORTANTE: Estamos llamando este endpoint una vez por cada imagen. Tomar precauciones.
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return uploadFile(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

// Almacenar el en nuestro fileSystem (Obviamente en NextJS NO SE DEBE HACER, lo recomendado es usar Firebase Storage, AWS S3, Cloudinary o cualquier otro servicio externo)
// const saveFile = async (file: formidable.File) => {
//   // Obtener el link de la imagen de la carpeta temporal
//   const data = fs.readFileSync(file.filepath);

//   // Guardar en nuestro file system en la carpeta "public"
//   fs.writeFileSync(`./public/${file.originalFilename}`, data);

//   // Eliminar todo de la carpeta temporal para que no se sature
//   fs.unlinkSync(file.filepath);

//   return;
// };

// En cambio usar: Cloudinary
const saveFile = async (file: formidable.File): Promise<string> => {
  const { secure_url } = await cloudinary.uploader.upload(file.filepath);

  return secure_url;
};

const parseFiles = async (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Preparar el objeto de formidable para analizar que es lo que estoy mandando
    const form = new formidable.IncomingForm();

    // Parsear los archivos que vienen en la "req"
    form.parse(req, async (error, fields, files) => {
      // console.log({ error, fields, files });

      if (error) return reject(error);

      const filePath = await saveFile(files.file as formidable.File);
      resolve(filePath);
    });
  });
};

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const imageUrl = await parseFiles(req);
  return res.status(200).json({ message: imageUrl });
};
