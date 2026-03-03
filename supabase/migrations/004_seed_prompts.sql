-- ============================================================
-- 004_seed_prompts.sql
-- Seed data: 70 original 30-min prompts + 20 new 15-min + 15 new 60-min
-- ============================================================

insert into public.prompts (id, title, description, difficulty_level, time_required_minutes, growth_weight, subject_tags, skill_focus_tags) values

-- ============================================================
-- ORIGINAL 30-MINUTE PROMPTS (ids 1-70)
-- ============================================================

-- Characters & Portraits — Beginner
(1,  'Draw a self-portrait using only line — no shading.', 'Draw a self-portrait using only line — no shading.', 'beginner', 30, 0.30, array['characters_portraits'], array['composition']),
(2,  'Sketch a character based on one emotion: joy.', 'Sketch a character based on one emotion: joy.', 'beginner', 30, 0.30, array['characters_portraits'], array['lighting_shadow']),
(3,  'Draw a person using exaggerated proportions.', 'Draw a person using exaggerated proportions.', 'beginner', 30, 0.30, array['characters_portraits'], array['gesture_movement']),
(4,  'Create a character silhouette that communicates personality.', 'Create a character silhouette that communicates personality.', 'beginner', 30, 0.30, array['characters_portraits'], array['composition']),
(5,  'Draw a portrait using only three values (light, mid, dark).', 'Draw a portrait using only three values (light, mid, dark).', 'beginner', 30, 0.30, array['characters_portraits'], array['lighting_shadow']),
(6,  'Design a street musician with strong silhouette clarity.', 'Design a street musician with strong silhouette clarity.', 'beginner', 30, 0.30, array['characters_portraits'], array['gesture_movement']),
(7,  'Draw a character lit from below.', 'Draw a character lit from below.', 'beginner', 30, 0.30, array['characters_portraits'], array['composition']),
(8,  'Create a portrait with dramatic side lighting.', 'Create a portrait with dramatic side lighting.', 'beginner', 30, 0.30, array['characters_portraits'], array['lighting_shadow']),
(9,  'Design a character whose outfit tells their story.', 'Design a character whose outfit tells their story.', 'beginner', 30, 0.30, array['characters_portraits'], array['gesture_movement']),
(10, 'Draw two characters interacting without dialogue.', 'Draw two characters interacting without dialogue.', 'beginner', 30, 0.30, array['characters_portraits'], array['composition']),
(11, 'Draw a character in forced perspective.', 'Draw a character in forced perspective.', 'beginner', 30, 0.30, array['characters_portraits'], array['lighting_shadow']),
(12, 'Paint a portrait where color defines mood.', 'Paint a portrait where color defines mood.', 'beginner', 30, 0.30, array['characters_portraits'], array['gesture_movement']),
(13, 'Design a character using negative space intentionally.', 'Design a character using negative space intentionally.', 'beginner', 30, 0.30, array['characters_portraits'], array['composition']),
(14, 'Draw a figure in motion mid-gesture.', 'Draw a figure in motion mid-gesture.', 'beginner', 30, 0.30, array['characters_portraits'], array['lighting_shadow']),
(15, 'Create a character composition framed through foreground objects.', 'Create a character composition framed through foreground objects.', 'beginner', 30, 0.30, array['characters_portraits'], array['gesture_movement']),

-- Environments & Landscapes — Beginner
(16, 'Draw a quiet room in your home.', 'Draw a quiet room in your home.', 'beginner', 30, 0.30, array['environments_landscapes'], array['composition']),
(17, 'Sketch a simple landscape using only 10 lines.', 'Sketch a simple landscape using only 10 lines.', 'beginner', 30, 0.30, array['environments_landscapes'], array['lighting_shadow']),
(18, 'Draw a window scene from memory.', 'Draw a window scene from memory.', 'beginner', 30, 0.30, array['environments_landscapes'], array['gesture_movement']),
(19, 'Sketch a city block using basic shapes.', 'Sketch a city block using basic shapes.', 'beginner', 30, 0.30, array['environments_landscapes'], array['composition']),
(20, 'Draw a landscape using only silhouette.', 'Draw a landscape using only silhouette.', 'beginner', 30, 0.30, array['environments_landscapes'], array['lighting_shadow']),

-- Environments & Landscapes — Intermediate
(21, 'Design a cozy café interior.', 'Design a cozy café interior.', 'intermediate', 30, 0.60, array['environments_landscapes'], array['gesture_movement']),
(22, 'Draw a forest path with layered depth.', 'Draw a forest path with layered depth.', 'intermediate', 30, 0.60, array['environments_landscapes'], array['composition']),
(23, 'Create a scene using strong foreground/midground/background.', 'Create a scene using strong foreground/midground/background.', 'intermediate', 30, 0.60, array['environments_landscapes'], array['lighting_shadow']),
(24, 'Sketch an abandoned building.', 'Sketch an abandoned building.', 'intermediate', 30, 0.60, array['environments_landscapes'], array['gesture_movement']),
(25, 'Draw a rainy street scene.', 'Draw a rainy street scene.', 'intermediate', 30, 0.60, array['environments_landscapes'], array['composition']),
(26, 'Create a cinematic wide-angle environment.', 'Create a cinematic wide-angle environment.', 'intermediate', 30, 0.60, array['environments_landscapes'], array['lighting_shadow']),
(27, 'Draw an environment using atmospheric perspective.', 'Draw an environment using atmospheric perspective.', 'intermediate', 30, 0.60, array['environments_landscapes'], array['gesture_movement']),
(28, 'Design a sci-fi cityscape.', 'Design a sci-fi cityscape.', 'intermediate', 30, 0.60, array['environments_landscapes'], array['composition']),
(29, 'Illustrate a storm approaching.', 'Illustrate a storm approaching.', 'intermediate', 30, 0.60, array['environments_landscapes'], array['lighting_shadow']),
(30, 'Draw an interior lit by a single light source.', 'Draw an interior lit by a single light source.', 'intermediate', 30, 0.60, array['environments_landscapes'], array['gesture_movement']),

-- Creatures & Fantasy — Intermediate
(31, 'Invent a small forest creature.', 'Invent a small forest creature.', 'intermediate', 30, 0.60, array['creatures_fantasy'], array['composition']),
(32, 'Design a hybrid animal.', 'Design a hybrid animal.', 'intermediate', 30, 0.60, array['creatures_fantasy'], array['lighting_shadow']),
(33, 'Draw a creature using geometric base forms.', 'Draw a creature using geometric base forms.', 'intermediate', 30, 0.60, array['creatures_fantasy'], array['gesture_movement']),
(34, 'Create a mythic guardian statue.', 'Create a mythic guardian statue.', 'intermediate', 30, 0.60, array['creatures_fantasy'], array['composition']),
(35, 'Design a dragon using only silhouette.', 'Design a dragon using only silhouette.', 'intermediate', 30, 0.60, array['creatures_fantasy'], array['lighting_shadow']),
(36, 'Draw a creature adapted to deep ocean life.', 'Draw a creature adapted to deep ocean life.', 'intermediate', 30, 0.60, array['creatures_fantasy'], array['gesture_movement']),
(37, 'Sketch a fantasy mount.', 'Sketch a fantasy mount.', 'intermediate', 30, 0.60, array['creatures_fantasy'], array['composition']),
(38, 'Create a creature that reflects its environment.', 'Create a creature that reflects its environment.', 'intermediate', 30, 0.60, array['creatures_fantasy'], array['lighting_shadow']),
(39, 'Design a gentle monster.', 'Design a gentle monster.', 'intermediate', 30, 0.60, array['creatures_fantasy'], array['gesture_movement']),
(40, 'Illustrate a mythical creature mid-flight.', 'Illustrate a mythical creature mid-flight.', 'intermediate', 30, 0.60, array['creatures_fantasy'], array['composition']),

-- Everyday Objects — Intermediate
(41, 'Draw your favorite mug from observation.', 'Draw your favorite mug from observation.', 'intermediate', 30, 0.60, array['everyday_objects'], array['lighting_shadow']),
(42, 'Sketch a pair of worn shoes.', 'Sketch a pair of worn shoes.', 'intermediate', 30, 0.60, array['everyday_objects'], array['gesture_movement']),
(43, 'Draw a still life with 3 objects.', 'Draw a still life with 3 objects.', 'intermediate', 30, 0.60, array['everyday_objects'], array['composition']),
(44, 'Illustrate a messy desk scene.', 'Illustrate a messy desk scene.', 'intermediate', 30, 0.60, array['everyday_objects'], array['lighting_shadow']),
(45, 'Draw an object using dramatic shadow.', 'Draw an object using dramatic shadow.', 'intermediate', 30, 0.60, array['everyday_objects'], array['gesture_movement']),

-- Everyday Objects — Advanced
(46, 'Sketch something transparent.', 'Sketch something transparent.', 'advanced', 30, 0.80, array['everyday_objects'], array['composition']),
(47, 'Draw a reflective object.', 'Draw a reflective object.', 'advanced', 30, 0.80, array['everyday_objects'], array['lighting_shadow']),
(48, 'Create a minimal object study.', 'Create a minimal object study.', 'advanced', 30, 0.80, array['everyday_objects'], array['gesture_movement']),
(49, 'Draw an object from an unusual angle.', 'Draw an object from an unusual angle.', 'advanced', 30, 0.80, array['everyday_objects'], array['composition']),
(50, 'Illustrate a broken object.', 'Illustrate a broken object.', 'advanced', 30, 0.80, array['everyday_objects'], array['lighting_shadow']),

-- Story Scenes — Advanced
(51, 'Draw a moment before something changes.', 'Draw a moment before something changes.', 'advanced', 30, 0.80, array['story_scenes'], array['gesture_movement']),
(52, 'Illustrate a reunion scene.', 'Illustrate a reunion scene.', 'advanced', 30, 0.80, array['story_scenes'], array['composition']),
(53, 'Depict a character waiting.', 'Depict a character waiting.', 'advanced', 30, 0.80, array['story_scenes'], array['lighting_shadow']),
(54, 'Show tension without faces.', 'Show tension without faces.', 'advanced', 30, 0.80, array['story_scenes'], array['gesture_movement']),
(55, 'Draw a quiet victory moment.', 'Draw a quiet victory moment.', 'advanced', 30, 0.80, array['story_scenes'], array['composition']),
(56, 'Illustrate a scene in total silence.', 'Illustrate a scene in total silence.', 'advanced', 30, 0.80, array['story_scenes'], array['lighting_shadow']),
(57, 'Show contrast between chaos and calm.', 'Show contrast between chaos and calm.', 'advanced', 30, 0.80, array['story_scenes'], array['gesture_movement']),
(58, 'Draw a farewell.', 'Draw a farewell.', 'advanced', 30, 0.80, array['story_scenes'], array['composition']),
(59, 'Illustrate anticipation.', 'Illustrate anticipation.', 'advanced', 30, 0.80, array['story_scenes'], array['lighting_shadow']),
(60, 'Create a scene using only body language.', 'Create a scene using only body language.', 'advanced', 30, 0.80, array['story_scenes'], array['gesture_movement']),
(61, 'Draw using only gesture lines.', 'Draw using only gesture lines.', 'advanced', 30, 0.80, array['story_scenes'], array['composition']),
(62, 'Limit yourself to 3 colors.', 'Limit yourself to 3 colors.', 'advanced', 30, 0.80, array['story_scenes'], array['lighting_shadow']),
(63, 'Create a composition using rule of thirds.', 'Create a composition using rule of thirds.', 'advanced', 30, 0.80, array['story_scenes'], array['gesture_movement']),
(64, 'Draw using high contrast lighting.', 'Draw using high contrast lighting.', 'advanced', 30, 0.80, array['story_scenes'], array['composition']),
(65, 'Create a piece focused entirely on texture.', 'Create a piece focused entirely on texture.', 'advanced', 30, 0.80, array['story_scenes'], array['lighting_shadow']),
(66, 'Use overlapping forms to create depth.', 'Use overlapping forms to create depth.', 'advanced', 30, 0.80, array['story_scenes'], array['gesture_movement']),
(67, 'Compose using only negative space.', 'Compose using only negative space.', 'advanced', 30, 0.80, array['story_scenes'], array['composition']),
(68, 'Focus on dynamic perspective.', 'Focus on dynamic perspective.', 'advanced', 30, 0.80, array['story_scenes'], array['lighting_shadow']),
(69, 'Draw using exaggerated light direction.', 'Draw using exaggerated light direction.', 'advanced', 30, 0.80, array['story_scenes'], array['gesture_movement']),
(70, 'Create rhythm using repeated shapes.', 'Create rhythm using repeated shapes.', 'advanced', 30, 0.80, array['story_scenes'], array['composition']),

-- ============================================================
-- NEW 15-MINUTE PROMPTS (ids 71-90)
-- Quick sketches — accessible, low friction
-- ============================================================

(71, 'Draw a single hand in any pose.', 'Draw a single hand in any pose.', 'beginner', 15, 0.25, array['characters_portraits'], array['gesture_movement']),
(72, 'Quick gesture sketch of someone sitting.', 'Quick gesture sketch of someone sitting.', 'beginner', 15, 0.20, array['characters_portraits'], array['gesture_movement']),
(73, 'Draw a leaf from observation.', 'Draw a leaf from observation.', 'beginner', 15, 0.20, array['everyday_objects'], array['lighting_shadow']),
(74, 'Sketch any object on your desk in 15 minutes.', 'Sketch any object on your desk in 15 minutes.', 'beginner', 15, 0.20, array['everyday_objects'], array['composition']),
(75, 'Draw a simple face using only circles and lines.', 'Draw a simple face using only circles and lines.', 'beginner', 15, 0.20, array['characters_portraits'], array['composition']),
(76, 'Draw the view directly outside your nearest window.', 'Draw the view directly outside your nearest window.', 'beginner', 15, 0.20, array['environments_landscapes'], array['composition']),
(77, 'Quick sketch of your own foot or shoe.', 'Quick sketch of your own foot or shoe.', 'beginner', 15, 0.20, array['everyday_objects'], array['gesture_movement']),
(78, 'Draw a tree silhouette against the sky.', 'Draw a tree silhouette against the sky.', 'beginner', 15, 0.20, array['environments_landscapes'], array['lighting_shadow']),
(79, 'Capture a seated figure in 5 confident strokes.', 'Capture a seated figure in 5 confident strokes.', 'beginner', 15, 0.20, array['characters_portraits'], array['gesture_movement']),
(80, 'Quick still life: one object, one clear light source.', 'Quick still life: one object, one clear light source.', 'intermediate', 15, 0.40, array['everyday_objects'], array['lighting_shadow']),
(81, 'Sketch an animal from memory — focus on the silhouette.', 'Sketch an animal from memory — focus on the silhouette.', 'intermediate', 15, 0.35, array['creatures_fantasy'], array['gesture_movement']),
(82, 'Sketch a face showing one clear emotion.', 'Sketch a face showing one clear emotion.', 'intermediate', 15, 0.35, array['characters_portraits'], array['lighting_shadow']),
(83, 'Quick landscape thumbnail — establish mood with value.', 'Quick landscape thumbnail — establish mood with value.', 'intermediate', 15, 0.35, array['environments_landscapes'], array['composition']),
(84, 'Draw a small creature in a single dynamic pose.', 'Draw a small creature in a single dynamic pose.', 'intermediate', 15, 0.35, array['creatures_fantasy'], array['composition']),
(85, 'Sketch a doorway or entrance.', 'Sketch a doorway or entrance.', 'beginner', 15, 0.25, array['environments_landscapes'], array['composition']),
(86, 'Draw a crumpled piece of paper.', 'Draw a crumpled piece of paper.', 'intermediate', 15, 0.40, array['everyday_objects'], array['lighting_shadow']),
(87, 'Quick gesture: two figures interacting.', 'Quick gesture: two figures interacting.', 'intermediate', 15, 0.40, array['characters_portraits'], array['gesture_movement']),
(88, 'Draw a staircase or ladder.', 'Draw a staircase or ladder.', 'intermediate', 15, 0.40, array['environments_landscapes'], array['composition']),
(89, 'Quick study: draw water in any form.', 'Quick study: draw water in any form.', 'intermediate', 15, 0.40, array['environments_landscapes'], array['lighting_shadow']),
(90, 'Sketch an expressive eye — every mark counts.', 'Sketch an expressive eye — every mark counts.', 'beginner', 15, 0.25, array['characters_portraits'], array['lighting_shadow']),

-- ============================================================
-- NEW 60-MINUTE PROMPTS (ids 91-105)
-- Deep studies — complex, multi-element, high growth
-- ============================================================

(91,  'Draw a full-body character with detailed costume design.', 'Draw a full-body character with detailed costume design.', 'advanced', 60, 0.70, array['characters_portraits'], array['composition']),
(92,  'Create a detailed interior scene with consistent perspective.', 'Create a detailed interior scene with consistent perspective.', 'advanced', 60, 0.75, array['environments_landscapes'], array['composition']),
(93,  'Illustrate a dynamic action sequence across two panels.', 'Illustrate a dynamic action sequence across two panels.', 'advanced', 60, 0.75, array['story_scenes'], array['gesture_movement']),
(94,  'Design a creature with detailed surface texture and anatomy.', 'Design a creature with detailed surface texture and anatomy.', 'advanced', 60, 0.75, array['creatures_fantasy'], array['lighting_shadow']),
(95,  'Draw a landscape from imagination with full atmospheric depth.', 'Draw a landscape from imagination with full atmospheric depth.', 'advanced', 60, 0.70, array['environments_landscapes'], array['lighting_shadow']),
(96,  'Create a character portrait with expressive, complex lighting.', 'Create a character portrait with expressive, complex lighting.', 'intermediate', 60, 0.60, array['characters_portraits'], array['lighting_shadow']),
(97,  'Build a scene with three distinct, well-differentiated depth layers.', 'Build a scene with three distinct, well-differentiated depth layers.', 'intermediate', 60, 0.60, array['environments_landscapes'], array['composition']),
(98,  'Draw a group of 3 or more characters in a shared moment.', 'Draw a group of 3 or more characters in a shared moment.', 'advanced', 60, 0.80, array['story_scenes'], array['composition']),
(99,  'Create a detailed still life with 5 or more objects.', 'Create a detailed still life with 5 or more objects.', 'intermediate', 60, 0.60, array['everyday_objects'], array['composition']),
(100, 'Design a fantasy creature with a believable environment context.', 'Design a fantasy creature with a believable environment context.', 'advanced', 60, 0.75, array['creatures_fantasy'], array['composition']),
(101, 'Illustrate a narrative moment with strong emotional impact.', 'Illustrate a narrative moment with strong emotional impact.', 'advanced', 60, 0.80, array['story_scenes'], array['lighting_shadow']),
(102, 'Draw a full environment: sky, mid-ground, and foreground in harmony.', 'Draw a full environment: sky, mid-ground, and foreground in harmony.', 'intermediate', 60, 0.65, array['environments_landscapes'], array['composition']),
(103, 'Create a character study with multiple angle sketches on one page.', 'Create a character study with multiple angle sketches on one page.', 'advanced', 60, 0.75, array['characters_portraits'], array['gesture_movement']),
(104, 'Draw a complex architectural scene using one-point perspective.', 'Draw a complex architectural scene using one-point perspective.', 'advanced', 60, 0.80, array['environments_landscapes'], array['composition']),
(105, 'Illustrate a character in an environment that reflects their inner world.', 'Illustrate a character in an environment that reflects their inner world.', 'advanced', 60, 0.80, array['story_scenes'], array['composition']);

-- Sync the serial sequence to avoid collisions on future inserts
select setval('public.prompts_id_seq', (select max(id) from public.prompts));
