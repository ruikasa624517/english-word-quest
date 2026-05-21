# Version History

## v0.2.1

- Added a local admin button and admin test panel.
- Admin actions can add XP, trigger level-up, mark the active goal as learned, open review, open monster battle, fill items, and clear local progress.
- Production restriction hook added through `ADMIN_EMAILS`; local demo admin remains available for the mock user.

## v0.2.0

- Import now accepts English words only; the local server fetches short Traditional Chinese meanings and examples from Cambridge when available, with local fallback.
- Quiz options prefer same part of speech and visually similar words.
- Replaced level-up mini-game with item rewards and monster battles every 5 adventurer levels.
- Added inventory items for healing and damage.
- Added generated monster variants and monster battle UI.
- Added achievements view for correct answers, combo streak, login days, first level-up, and monster defeats.

## v0.1.0

- Multi-goal user profiles: each learning goal has its own placement test, rank, learned words, weak words, and daily tests.
- Goal switching and adding goals from the dashboard.
- Rank-based word difficulty weighting for study sessions.
- Grand review test unlocks at 60% learned words and can upgrade the current goal rank.
- Retro mini-game timer fixed so it counts down without full page rerenders.
- Responsive layout improvements for small screens.

Restore snapshot: `versions/v0.1.0`
