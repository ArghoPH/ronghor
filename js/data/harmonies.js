export const HARM=[
 ['mono','Monochrome','Light and dark versions of a single hue. The safest, cleanest option.'],
 ['analog','Analogous','Neighboring hues on the wheel, 30° apart. Calm and natural; good for nature and health sites.'],
 ['comp','Complementary','The accent comes from the opposite side of the wheel, so sale tags and badges really pop.'],
 ['split','Split','The two hues beside the opposite one. As lively as complementary, but easier on the eye.'],
 ['triad','Triadic','Three hues evenly spaced on the wheel. Colorful and playful; suits kids and gaming sites.'],
];
export const HN=Object.fromEntries(HARM.map(h=>[h[0],h]));
