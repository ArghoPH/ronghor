import { renderContrast } from './components/contrast.js';
import { syncControls } from './components/controls.js';
import { renderExport } from './components/export.js';
import { renderWheel } from './components/generator.js';
import { renderGuide } from './components/guide.js';
import { renderHead, renderLogo } from './components/header.js';
import { markPresets } from './components/presets.js';
import { applySiteVars, updatePop } from './components/preview.js';
import { updateStrip } from './components/strip.js';
import { updateUndo } from './history.js';
import { activePalette } from './state.js';

export function render() {
  const f =
    activePalette();
    applySiteVars(f);
    updateStrip();
    renderLogo();
    renderHead();
    renderContrast(f);
    renderWheel();
    renderGuide(f);
    renderExport();
    markPresets();
    syncControls();
    updateUndo();
    updatePop();
}
