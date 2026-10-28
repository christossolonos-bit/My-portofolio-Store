# Project tour videos

Each portfolio aisle uses a narrated local tour:

- `*-tour.mp4` — product tour with feature scenes + YouTube snapshots
- `*-poster.png` — first-frame poster

## Rebuild all

```bash
node scripts/tours/build-all.mjs
```

## Rebuild one

```bash
node scripts/tours/build-all.mjs luna-agent
```

Tour scripts live in `scripts/tours/tours.json`.
Related YouTube thumbnails are downloaded into `scripts/tours/thumbs/`.
