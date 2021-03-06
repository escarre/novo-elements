import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NOVO_ELEMENTS_LABELS_PROVIDERS } from './../src/novo-elements';
import 'rxjs/add/operator/map';

import { DemoApp } from './pages/app/App';
import './index.scss';

/**
 * Main Bootstrapping
 */
export function main() {
    return bootstrap(DemoApp, [
        ...ROUTER_PROVIDERS,
        ...NOVO_ELEMENTS_LABELS_PROVIDERS,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ]).catch(err => console.error(err)); // eslint-disable-line
}

document.addEventListener('DOMContentLoaded', () => main());
