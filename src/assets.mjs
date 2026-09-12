import { createHash } from 'node:crypto';

export const contentHash = source => createHash('sha256').update(source).digest('hex').slice(0, 16);
const asset = (name, extension, source) => ({ path: `/assets/${name}.${contentHash(source)}.${extension}`, source });

export function browserAssets({ styles, app, contact }) {
  // Git publica LF; manter os mesmos nomes ao gerar no Windows e na Cloudflare.
  styles = styles.replace(/\r\n/g, '\n');
  app = app.replace(/\r\n/g, '\n');
  contact = contact.replace(/\r\n/g, '\n');
  const contactAsset = asset('contact', 'mjs', contact);
  const importSource = "'./contact.mjs'";
  if (app.split(importSource).length !== 2) throw new Error('app.js deve importar contact.mjs exatamente uma vez para versionar a dependência.');
  // O hash do aplicativo inclui o caminho versionado de sua dependência.
  const appSource = app.replace(importSource, `'./${contactAsset.path.split('/').at(-1)}'`);
  return {
    styles: asset('styles', 'css', styles),
    app: asset('app', 'js', appSource),
    contact: contactAsset
  };
}
