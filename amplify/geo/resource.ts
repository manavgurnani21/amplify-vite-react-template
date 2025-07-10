// import { defineGeo } from `xyz`;

// export const geo = defineGeo({
//   name: `geo`,
//   schema: {
//     type: `object`,
//     properties: {
//       lat: { type: `number` },
//       lon: { type: `number` },
//     },
//     required: [`lat`, `lon`],
//   },
//   example: { lat: 0, lon: 0 },
//   validate: (geo) => {
//     if (geo.lat < -90 || geo.lat > 90) {
//       throw new Error(`Latitude must be between -90 and 90`);
//     }
//     if (geo.lon < -180 || geo.lon > 180) {
//       throw new Error(`Longitude must be between -180 and 180`);
//     }
//   },
// });