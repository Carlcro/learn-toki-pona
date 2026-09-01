# Scene art queue

Every "describe this scene" exercise needs one picture. The first pass at that
art was generated line work that turned out too ambiguous to read at the size
it renders — and a scene the learner cannot make out is a question they cannot
answer. So the drawings are switched off: a scene shows its **title** in words
until a real illustration replaces it.

**Nothing is deleted.** The old SVG components still sit in
`src/components/scenes/` and are still wired into `SCENE_REGISTRY`. They are
simply not shown.

## Shipping one

1. Add the component to `src/components/scenes/` and register it in
   `SCENE_REGISTRY` (`src/components/scenes/registry.ts`) — already done for
   all fifteen keys below.
2. Add its `svgKey` to `SCENE_ART_READY` in the same file.

That second step is the switch. Everything not in that set keeps showing its
title, so artwork can land one scene at a time without a half-finished set
reaching a learner.

## House style

These are the constraints every scene shares. They come from `DESIGN.md` — the
two-accent rule and the flat rule are system-wide, not per-picture taste.

- **Canvas**: `viewBox="0 0 200 140"` (10:7 landscape). Renders about 220px
  wide, so nothing may depend on detail that dies at that size.
- **Colour**: exactly two. Lines in lavender `#d7b0fe`, ground `#1e1836`. No
  third hue, ever — no green, brown, blue, white, black, or skin tones.
- **Flat**: no gradients, vignette, shading, shadow, glow, texture, grain, 3D,
  perspective, or depth.
- **Line**: outline only, uniform weight, rounded caps and joins, hollow
  shapes — nothing filled in.
- **Figures**: a circle for the head, a smooth dome for the body, sides running
  straight to a single horizontal ground line. No face, hair, hands, feet, or
  clothing.
- **Composition**: centred, even margins, nothing cropped or touching an edge.

If the picture arrives as SVG it drops straight into the registry and inherits
the theme colour through `stroke="currentColor"`. If it arrives as a raster
image it needs an `<img>`-based component and a home for the file — ask and
that plumbing gets built.

## Base prompt

Paste this, then the `SUBJECT` block for the scene you are generating.

```
A single flat vector-style illustration for a cozy children's learning app.

STYLE: minimal geometric line art. Figures are built from simple primitives —
a circle for the head, and below it a smooth dome/arch for the body whose sides
run straight down to the ground. No face, no hair, no hands, no feet, no
clothing. One straight horizontal ground line runs under everything.

LINE: outline only, thin and perfectly uniform in weight, with rounded ends and
rounded corners. Every shape is hollow — nothing is filled in.

COLOR: exactly two colors in the whole image. All lines are soft pastel
lavender-violet (#d7b0fe). The background is flat, even, deep indigo-navy
(#1e1836), identical in every corner. No third color anywhere.

DO NOT INCLUDE: gradients, vignette, darkened corners, shading, shadows,
highlights, glow, texture, grain, 3D, perspective, depth, sparkles, background
scenery, patterns, borders, frames, text, or watermarks.

COMPOSITION: landscape 3:2, centered, generous and even margins, nothing
cropped or touching an edge. The subject fills about two thirds of the frame
height.

SUBJECT: <paste the scene block here>
```

Two things learned the hard way on the first attempt: **ask for the arm
explicitly** — it gets dropped otherwise, and the arm is what turns an object
near a head into an action — and **say that liquid surfaces stay level**, or
the water is drawn parallel to a tilted rim and reads as stripes.

## The fifteen scenes

Ordered by lesson. "Must support" lists the model answers the picture has to
make sayable; if a learner cannot get to those sentences from the image, the
image has failed regardless of how it looks.

### 1. `drinking-water` — A person drinking water

- Lesson 1 · `src/components/scenes/DrinkingWater.tsx`
- Must support: `jan li moku e telo.` · `telo li pona.`

```
SUBJECT: one person drinking water from a glass. The arm is clearly visible: a
single bent line leaving the upper side of the body, angling up to the glass,
two straight segments meeting at a soft rounded elbow. The glass is a tapered
outline, slightly wider at the rim than the base, tilted only about 15 degrees
toward the mouth — not lying diagonally — with its rim nearly touching the
lower edge of the head circle. Inside it, the water is one or two gentle wavy
lines that are horizontal and level with the ground, never parallel to the
tilted rim.
```

### 2. `i-eat-you-drink` — I eat, you drink

- Lesson 1 · `src/components/scenes/IEatYouDrink.tsx`
- Must support: `mi moku e moku.` · `sina moku e telo.`

The one scene that carries two subjects at once, so the two actions have to be
told apart at a glance — that contrast *is* the exercise.

```
SUBJECT: two people standing side by side, facing the viewer, clearly separated
by empty space. The left figure is eating: its bent arm lifts a small round
piece of food to its mouth. The right figure is drinking: its bent arm lifts a
tapered glass to its mouth, with one horizontal wavy line inside for water. Both
arms are clearly visible bent lines with rounded elbows. The food is unmistakably
solid and round; the glass is unmistakably a container of liquid.
```

### 3. `big-small` — A big person and a small person

- Lesson 2 · `src/components/scenes/BigSmall.tsx`
- Must support: `jan suli li pona.` · `jan lili li moku.`

Scale is the whole point, so the two figures must be identical in shape and
differ only in size — any other difference invites the wrong sentence.

```
SUBJECT: two people standing side by side on the ground line, drawn in exactly
the same style and proportions but at very different sizes. The left figure is
large, roughly twice the height of the right figure, which is small. Nothing
else distinguishes them — same head circle, same dome body, same line weight.
```

### 4. `person-and-animal` — A person and an animal together

- Lesson 3 · `src/components/scenes/PersonAndAnimal.tsx`
- Must support: `jan en soweli li pona.` · `soweli li suli.`

```
SUBJECT: a person standing on the left and a four-legged animal standing on the
right, both on the ground line, close together as a pair. The animal is drawn in
profile facing left toward the person: a horizontal oval body, a smaller circle
head raised at the front, a short tail at the back, and four clearly visible
straight legs reaching down to the ground. The animal is roughly as tall as the
person — large, not a pet at their feet.
```

### 5. `small-animal` — A small animal beside a person

- Lesson 2 · `src/components/scenes/SmallAnimal.tsx`
- Must support: `soweli lili li pona.` · `soweli mute li moku.`

Needs both *small* and *several*, and must not be confusable with scene 4.

```
SUBJECT: a person standing on the left, and on the right two or three small
four-legged animals on the ground beside them, clearly much shorter than the
person — about knee height. Each animal is in profile: a small horizontal oval
body, a circle head raised at the front, a short tail, four straight legs. The
animals are heads-down eating from a small shallow bowl on the ground.
```

### 6. `wants-to-eat` — A person reaching for food

- Lesson 3 · `src/components/scenes/WantsToEat.tsx`
- Must support: `jan li wile moku.` · `jan li wile moku e telo.`

Wanting, not eating — the food must be *out of reach*, or this collapses into
scene 1 or 2.

```
SUBJECT: a person reaching toward food they have not got yet. Their arm is a
straight line extended fully sideways toward a small round piece of food resting
on a simple flat table or shelf, with a clear gap between the fingertip end of
the arm and the food — the arm stops short, it does not touch or hold anything.
The food stays on the surface, well away from the mouth.
```

### 7. `not-eating` — A person turning food down

- Lesson 4 · `src/components/scenes/NotEating.tsx`
- Must support: `jan li moku ala.` · `jan li wile ala moku.`

Refusal has to read as refusal, not as reaching — the mirror image of scene 6,
and the pair most likely to be confused.

```
SUBJECT: a person refusing offered food. The head circle is turned away to one
side. The near arm is raised in a clear stop gesture — a bent line ending in a
short flat horizontal bar, palm-out — held between the body and a small round
piece of food on a simple plate that is being offered from the other side. The
body leans slightly back, away from the plate. Nothing touches the food.
```

### 8. `asking-good` — Asking whether the food is any good

- Lesson 4 · `src/components/scenes/AskingGood.tsx`
- Must support: `telo li pona ala pona?` · `moku li pona ala.`

The one scene that has to depict a *question*, which line art cannot really do
without a symbol. A single question mark is the exception worth making — note
that it breaks the no-text rule deliberately, and it is the only glyph allowed
anywhere in the set.

```
SUBJECT: a person standing beside a small table, gesturing with one bent arm
toward a glass of water and a small round piece of food resting on it. Above and
to the side of their head floats one large simple question mark, drawn in the
same line style and weight as everything else. No other text or symbol appears.
```

### 9. `good-looking-person` — A good-looking person

- Lesson 5 · `src/components/scenes/GoodLookingPerson.tsx`
- Must support: `jan pi pona lukin li pona.`

The hardest one: "good *looking*" is about appearance and about being seen, and
neither survives being drawn as a stick figure. A mirror is the most legible
route — it makes the picture about how someone looks without needing a face.

```
SUBJECT: a person standing in front of a tall mirror, seen from the side. The
mirror is a simple upright rounded rectangle on a small stand, and inside it is
a smaller, simplified repeat of the same figure — head circle and dome body —
as the reflection. The person faces the mirror. Nothing else is in the frame.
```

### 10. `crowded-house` — A house full of people

- Lesson 5 · `src/components/scenes/CrowdedHouse.tsx`
- Must support: `tomo pi jan mute li suli.` · `tomo li suli.`

Both *many people* and *big house* have to survive at 220px, so the figures
inside need to be countable-ish rather than a texture.

```
SUBJECT: a large house drawn as a simple outline — a square body with a
triangular roof — filling most of the frame, with a doorway in the middle. Inside
it stand five or six small people, drawn as head circles above dome bodies,
packed shoulder to shoulder in a row and clearly visible through the open front
of the house. The house is unmistakably large relative to the people.
```

### 11. `come-here` — Waving someone over

- Lesson 6 · `src/components/scenes/ComeHere.tsx`
- Must support: `sina o kama.` · `jan o kama.`

```
SUBJECT: two people on the ground line with a wide gap between them. The figure
on the left has one arm raised and bent, beckoning — the forearm curved inward
toward their own body, the classic come-here wave. The figure on the right stands
some distance away, facing them, arms down. The gap between them is the largest
empty space in the picture.
```

### 12. `give-food` — Handing someone food

- Lesson 6 · `src/components/scenes/GiveFood.tsx`
- Must support: `sina o pana e moku.` · `sina o pana e telo.`

The handover has to be mid-transfer — both figures touching the same object —
or it reads as two people standing near a plate.

```
SUBJECT: two people facing each other, standing close together. Between them,
at chest height, a small shallow bowl of food is being passed from one to the
other: the left figure's arm extends to hold one side of the bowl and the right
figure's arm extends to take the other side, both arms clearly visible and both
touching the bowl at the same time.
```

### 13. `at-home` — A person at home

- Lesson 7 · `src/components/scenes/AtHome.tsx`
- Must support: `mi lon tomo.` · `jan li lon tomo.`

Being somewhere, not going somewhere. Must not be confusable with scene 14, so
the figure is *inside* and *still*.

```
SUBJECT: one person standing inside a house. The house is a simple outline — a
square body with a triangular roof — drawn around the figure, which stands
centered and upright well within the walls, arms down, entirely at rest. No door
is open, nothing is entering or leaving, and no part of the figure crosses the
outline of the house.
```

### 14. `going-to` — A person walking toward a house

- Lesson 7 · `src/components/scenes/GoingTo.tsx`
- Must support: `mi tawa tomo.` · `jan li tawa tomo.`

Motion, and the direct contrast with scene 13. This is the one scene where the
figure needs legs — the dome body cannot show a stride, and the stride is the
only thing carrying the verb.

```
SUBJECT: one person walking toward a house. The house is a simple outline — a
square body with a triangular roof — standing on the right side of the frame.
The person is on the left, clearly outside it, drawn mid-stride: instead of a
closed dome body, the body ends in two straight legs scissored apart in a
walking step, with the leading leg pointing toward the house. One arm swings
forward. There is clear empty ground between the person and the house.
```

### 15. `strange-drink` — A person drinking something strange

- Lesson 8 · `src/components/scenes/StrangeDrink.tsx`
- Must support: `jan li moku e telo nasa.` · `telo nasa li ike.`

Same action as scene 1, so everything rests on the drink itself reading as
*wrong*.

```
SUBJECT: one person drinking from a strange vessel, with a clearly visible bent
arm holding it to their mouth. The vessel is lopsided and irregular — a
crooked, asymmetric flask rather than a clean tapered glass — and inside it the
liquid is drawn as a jagged, uneven line rather than a smooth wave. Three or
four small round bubbles rise from the mouth of the vessel into the space above
it. The figure's head is tilted slightly back and away, recoiling.
```
