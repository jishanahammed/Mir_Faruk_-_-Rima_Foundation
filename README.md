This is a [Next.js](https://nextjs.org) App Router project organized with a `src`-based structure for cleaner long-term maintenance.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
public/
src/
  app/
    favicon.ico
    globals.css
    layout.js
    page.js
  components/
    home/
    layout/
    ui/
  lib/
```

## Conventions

- Keep route files inside `src/app`
- Put reusable UI in `src/components`
- Store small content/config helpers in `src/lib`
- Keep static assets in `public`
- Use the `@/*` alias for imports from `src`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
