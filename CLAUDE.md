# The Inner Compass — repo notes

## Portal version sync (do not skip)

Listed on `small-steps-to-great-harmony` as id `compass`. On every shippable
commit+push: bump this repo's `package.json` version if needed, set the
matching `version` in the portal's `src/data/apps.ts`, then commit and push
the portal too. Details: `.cursor/rules/portal-version-sync.mdc`.
