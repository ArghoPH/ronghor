import { renderSiteContent } from './components/preview.js';
import { toast } from './components/toast.js';
import { $ } from './dom.js';
import { render } from './render.js';
import { persist, state } from './state.js';

export const hist = { stack: [], i: -1 };

export function snapshot() {
    return JSON.stringify({ p: state.p, name: state.name, presetId: state.presetId, content: state.content, why: state.why, mode: state.mode });
}

export function commit() {
    const s = snapshot();
    if (hist.stack[hist.i] === s) {
        persist();
        return;
    }
    hist.stack = hist.stack.slice(0, hist.i + 1);
    hist.stack.push(s);
    if (hist.stack.length > 80)
        hist.stack.shift();
    hist.i = hist.stack.length - 1;
    persist();
    updateUndo();
}

export function restore(s) {
    const o = JSON.parse(s); const contentChanged = o.content !== state.content;
    Object.assign(state, {
        p: o.p, name: o.name, presetId: o.presetId, content: o.content, why: o.why, mode: o.mode
    });
    state.gen.base = state.p.primary;
    if (contentChanged)
        renderSiteContent();
    render();
    persist();
}

export function undo() {
    if (hist.i <= 0)
        return; hist.i--;
    restore(hist.stack[hist.i]);
    toast('Back to the previous version');
}

export function redo() {
    if (hist.i >= hist.stack.length - 1)
        return;
    hist.i++;
    restore(hist.stack[hist.i]);
}

export function updateUndo() {
    $('#undoBtn').disabled = hist.i <= 0; $('#redoBtn').disabled = hist.i >= hist.stack.length - 1;
}
