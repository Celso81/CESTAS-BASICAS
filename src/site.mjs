import { pages } from './pages.mjs';
import { innerPages } from './inner-pages.mjs';
import { editorialPages } from './editorial-pages.mjs';
export const sitePages = (config, catalog) => [...pages(config, catalog), ...innerPages(config, catalog), ...editorialPages(config, catalog)];
