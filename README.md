Bootcamp Grad Landing Page:
Get more job offers.
Let companies fall in love with you.

Business Landing Page:
Build a team that actually fits.
watch 2 minute videos ...
Jigsaw puzzle :)

Business Landing Page:
Attract more talent.
Let candidates fall in love with you.

to setup:
```
npm i
```

to run localhost:
```
npm run start-dev
```

postgres connection is via `/src-server/pg.ts` and whatever connection string is in `envs/` (we don't have envs yet)

currently we're faking data via `/src/hardcoded.ts`

we want to move that to stuff to `/src-server/routes/table_name.ts`

and import the `table_name.ts` files in `/src-server/index.ts`

and `table_name.ts` should surface GET and POST endpoints at `/api/table_name`

(for how to setup the endpoint, how to import it in index.ts etc, see `/src-server/routes/user.ts`)