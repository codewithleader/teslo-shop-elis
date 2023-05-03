import type { NextApiRequest, NextApiResponse } from 'next';
import { IProduct } from 'interfaces';
import { db } from 'database';
import { ProductModel } from 'models';
import { isValidObjectId } from 'mongoose';
// Cloudinary
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data =
  | {
      message: string;
    }
  | IProduct[]
  | IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);

    case 'POST':
      return createProduct(req, res);

    case 'PUT':
      return updateProduct(req, res);

    case 'DELETE':
      return res.status(400).json({ message: 'No implementado' });

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

/* ----------------------- CREATE ----------------------- */
const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { images = [] } = req.body as IProduct;

  if (images.length < 2) {
    return res.status(400).json({ message: 'El producto necesita al menos 2 imagenes' });
  }

  // todo: Posiblemente http://localhost:3000/products/imageName.jpg

  try {
    await db.connect();

    // Comprobar si el slug es único
    const productInDB = await ProductModel.findOne({ slug: req.body.slug });
    if (productInDB) {
      await db.disconnect();
      return res.status(400).json({ message: 'Ya existe un producto con ese slug' });
    }

    const product = new ProductModel(req.body);
    await product.save();

    await db.disconnect();

    res.status(201).json(product);
  } catch (error) {
    db.disconnect();
    console.error(error);
    return res.status(400).json({ message: 'Revisar logs del servidor' });
  }
};

/* ------------------------ READ ------------------------ */
const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();

  const products = await ProductModel.find().sort({ title: 'asc' }).lean();

  await db.disconnect();

  const updatedProducts = products.map(product => {
    // procesamiento de imagenes cuando la subamos al server
    product.images = product.images.map(image => {
      return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`;
    });

    return product;
  });

  return res.status(200).json(updatedProducts);
};

/* ----------------------- UPDATE ----------------------- */
const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id = '', images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'El id del producto no es válido' });
  }

  if (images.length < 2) {
    return res.status(400).json({ message: 'Es necesario al menos 2 imagenes' });
  }

  // todo: Posiblemente http://localhost:3000/products/imageName.jpg

  try {
    await db.connect();

    const product = await ProductModel.findById(_id);

    if (!product) {
      return res.status(400).json({ message: 'No existe un producto con ese ID' });
    }

    // todo: Eliminar fotos en Cloudinary
    // https://res.cloudinary.com/efradariok/image/upload/v1683126127/xvunkabfburm6v3ra5n4.jpg

    product.images.forEach(async image => {
      if (!images.includes(image)) {
        // Obtener el nombre de la foto que es el requisito para eliminar en cloudinary
        const [fileId, extension] = image
          //
          .substring(image.lastIndexOf('/') + 1)
          .split('.'); // [xvunkabfburm6v3ra5n4, jpg]
        console.log({ image, fileId, extension });

        // Eliminar de Cloudinary con el fileId
        await cloudinary.uploader.destroy(fileId);
      }
    });

    await product.update(req.body);

    await db.disconnect();

    return res.status(200).json(product);
  } catch (error) {
    await db.disconnect();
    console.error(error);
    return res.status(400).json({ message: 'Revisar la consola del servidor' });
  }
};

/* ----------------------- DELETE ----------------------- */
