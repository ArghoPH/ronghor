import { hexHsl } from './math.js';

export function hueName(h){ if(h<12||h>=346) return 'red'; if(h<40) return 'orange'; if(h<64) return 'yellow'; if(h<85) return 'lime'; if(h<160) return 'green'; if(h<192) return 'teal'; if(h<212) return 'sky blue'; if(h<252) return 'blue'; if(h<285) return 'violet'; if(h<318) return 'magenta'; return 'pink'; }
export function colorName(hex){
  const [h,s,l]=hexHsl(hex);
  if(l>=99.5) return 'White';
  if(l<=3) return 'Black';
  if(l>=94) return 'Off-white';
  if(l<=9) return 'Near black';
  let base;
  if(s<9) base='grey';
  else if(h>=12&&h<48&&l<42) base='brown';
  else base=hueName(h);
  const pre=l>=85?'Pale ':l>=68?'Light ':l<=17?'Very dark ':l<=34?'Dark ':'';
  const n=pre+base; return n.charAt(0).toUpperCase()+n.slice(1);
}
export function psych(hex){
  const [h,s,l]=hexHsl(hex);
  if(s<12||l<10||l>94) return {n:'Black / grey',feel:'Seriousness, luxury and restraint. Puts work and photos first.',fit:'Portfolios, luxury brands, news, photography',care:'Pure black and white can feel lifeless, so keep one accent color.'};
  if(h>=12&&h<48&&l<40) return {n:'Brown',feel:'Warmth, earthiness and reliability.',fit:'Coffee, bakeries, furniture, organic products',care:'Very dark brown blends into body text, so keep buttons and text clearly different.'};
  if(h<15||h>=345) return {n:'Red',feel:'Energy, urgency, excitement and appetite.',fit:'Restaurants, sales, news, sports',care:'It can be confused with error messages; use a different shade for errors.'};
  if(h<45) return {n:'Orange',feel:'Enthusiasm, friendliness and buy-now urgency.',fit:'E-commerce, food delivery, kids\' sites',care:'For white button text, choose a deeper orange.'};
  if(h<70) return {n:'Yellow',feel:'Joy, optimism and attention.',fit:'Kids, education, sale banners',care:'Yellow text on white can\'t be read; use it for backgrounds and badges.'};
  if(h<160) return {n:'Green',feel:'Nature, health, growth and money.',fit:'Agriculture, NGOs, health, fintech, government',care:'If it matches your success green, shift the success color a little.'};
  if(h<195) return {n:'Teal',feel:'Calm, clean and modern.',fit:'Clinics, travel, tech, wellness',care:'White text on very light teal looks washed out.'};
  if(h<255) return {n:'Blue',feel:'Trust, security and professionalism.',fit:'Banks, tech, corporate, hospitals, education',care:'Everyone uses blue; pick a bold accent if you want to stand out.'};
  if(h<290) return {n:'Purple',feel:'Creativity, premium quality and imagination.',fit:'SaaS, beauty, creative agencies, gaming',care:'Very light purple looks toy-like; use a deep shade for seriousness.'};
  return {n:'Pink / magenta',feel:'Softness, fashion and youth.',fit:'Fashion, beauty, gift shops, events',care:'White text works on deep pink; use dark text on light pink.'};
}
