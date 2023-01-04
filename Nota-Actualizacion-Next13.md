# Next13 - Nueva sintaxis con MaterialUI

Hay dos posibles soluciones a un inconveniente que introdujo Next13 con los nuevos links.

Antes:

```bash
<NextLink href='/category/men' passHref>
  <Link>
    <Button color={ asPath === '/category/men' ? 'primary':'info'}>Hombres</Button>
  </Link>
</NextLink>
```

- Posible solución 1: agregar legacyBehavior, el cual deja todo como estaba en Next12 y mantiene la compatibilidad

```bash
<NextLink href='/category/men' passHref legacyBehavior>
  <Link>
     <Button color={ asPath === '/category/men' ? 'primary':'info'}>Hombres</Button>
  </Link>
</NextLink>
```

- Posible solución 2: Evitar que se genere un nuevo `<a>` (Anchor tag) cuando usamos el Material UI Link

```bash
<NextLink
   href={ router.query.p ? `/auth/register?p=${ router.query.p }`: '/auth/register' }
>
    <Link underline='always' component={'span'}>
        ¿No tienes cuenta?
    </Link>
</NextLink>
```

Referencias:

[https://nextjs.org/docs/api-reference/next/link](https://nextjs.org/docs/api-reference/next/link)

[https://nextjs.org/blog/next-13#nextlink](https://nextjs.org/blog/next-13#nextlink)
