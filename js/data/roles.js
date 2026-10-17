export const ROLES=[
 {k:'bg',name:'Background',css:'--color-bg',where:'Behind the whole page',tip:'Covers the most area. Use white or a very light tint; a hint of your primary hue mixed in keeps the page feeling unified.'},
 {k:'surface',name:'Surface',css:'--color-surface',where:'Cards, nav bar, forms',tip:'Only needs to differ slightly from the background so cards read as separate objects. Usually white.'},
 {k:'text',name:'Text',css:'--color-text',where:'Headings and paragraphs',tip:'Use a very dark shade tinted toward your primary instead of pure black (#000000). Aim for 7:1 against the background.'},
 {k:'muted',name:'Muted text',css:'--color-muted',where:'Subtitles, dates, hints',tip:'For secondary information. Go too light and nobody can read it; keep at least 4.5:1.'},
 {k:'border',name:'Border',css:'--color-border',where:'Lines, dividers, inputs',tip:'Barely visible. Its only job is to separate areas.'},
 {k:'primary',name:'Primary',css:'--color-primary',where:'Main buttons, links, logo',tip:'Your brand color. Use it only where you want visitors to click. Put it everywhere and nothing stands out.'},
 {k:'onPrimary',name:'On primary',css:'--color-on-primary',where:'Text on primary buttons',tip:'Usually white. If the primary is light (yellow, sky blue), use dark text. Unless locked, it updates by itself when the primary changes.'},
 {k:'secondary',name:'Secondary',css:'--color-secondary',where:'Large bands, feature sections',tip:'The primary\'s companion. Adds variety in stat bands or highlight sections so the page doesn\'t feel flat.'},
 {k:'accent',name:'Accent',css:'--color-accent',where:'Badges, sale tags, stars',tip:'The attention grabber. Use it sparingly; two or three spots per page is plenty.'},
 {k:'success',name:'Success',css:'--color-success',where:'Success messages, check marks',tip:'A green. For messages like "Submitted" or "Payment successful".',status:1},
 {k:'warning',name:'Warning',css:'--color-warning',where:'Cautions, low stock',tip:'Orange or deep yellow. Not an error, but worth noticing.',status:1},
 {k:'danger',name:'Danger',css:'--color-danger',where:'Errors, delete buttons',tip:'A red. Only for mistakes or destructive actions, so it always means "careful".',status:1},
];
export const RK=ROLES.map(r=>r.k);
export const RN=Object.fromEntries(ROLES.map(r=>[r.k,r]));
